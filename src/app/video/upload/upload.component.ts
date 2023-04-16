import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  AngularFireStorage,
  AngularFireStorageModule,
  AngularFireUploadTask,
} from '@angular/fire/compat/storage';
import { v4 as uuid } from 'uuid';
import { last, switchMap } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { ClipService } from 'src/app/services/clip.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css'],
})
export class UploadComponent implements OnDestroy {
  isDragover = false;
  file: File | null = null;
  nextStep = false;
  //to toggle the component:
  showAlert = false;
  alertColor = 'blue';
  alertMsg = 'Please wait! your clip is being uploaded';
  //for disabling the form:
  inSubmission = false;
  percentage = 0;
  showPercentage = false;
  user: firebase.User | null = null;
  task?: AngularFireUploadTask;

  title = new FormControl('', {
    validators: [Validators.required, Validators.minLength(3)],
    nonNullable: true,
  });
  uploadForm = new FormGroup({
    title: this.title,
  });
  constructor(
    private storage: AngularFireStorage,
    private auth: AngularFireAuth,
    private clipService: ClipService,
    private router: Router
  ) {
    auth.user.subscribe((user) => (this.user = user));
  }

  ngOnDestroy(): void {
    this.task?.cancel();
  }

  storeFile($event: Event) {
    this.isDragover = false;
    this.file = ($event as DragEvent).dataTransfer
      ? ($event as DragEvent).dataTransfer?.files.item(0) ?? null
      : ($event.target as HTMLInputElement).files?.item(0) ?? null;
    if (!this.file || this.file.type !== 'video/mp4') {
      return;
    }
    //update a form controll value:
    this.title.setValue(this.file.name.replace(/\.[^/.]+$/, ''));
    this.nextStep = true;
  }
  uploadFile() {
    this.uploadForm.disable();
    this.showAlert = true;
    this.alertColor = 'blue';
    this.alertMsg = 'Please wait! your clip is being uploaded';
    this.inSubmission = true;
    this.showPercentage = true;
    const clipFileName = uuid();
    // const clipPath = `clips/${this.file?.name}`
    const clipPath = `clips/${clipFileName}.mp4`;
    //the next function recieves two arguments: the name of the file and the file object.
    // upload() - this function will initiate the upload, and returns an object with observables
    // observables are interfaces to handle asynchronous operations.
    this.task = this.storage.upload(clipPath, this.file);
    //creating a reference to a file:
    const clipRef = this.storage.ref(clipPath);
    //percentageChanges - an observable from rxjs:
    this.task.percentageChanges().subscribe((progress) => {
      this.percentage = (progress as number) / 100;
    });
    this.task
      .snapshotChanges()
      .pipe(
        last(),
        //getDownloadUrl func. returns an observable.
        switchMap(() => clipRef.getDownloadURL())
      )
      .subscribe({
        next: async (url) => {
          const clip = {
            uid: this.user?.uid as string,
            displayName: this.user?.displayName as string,
            title: this.title.value,
            fileName: `${clipFileName}.mp4`,
            url,
          };

          const clipDocRef = await this.clipService.createClip(clip);

          console.log(clip);

          this.alertColor = 'green';
          this.alertMsg = 'Success!!!';
          this.showPercentage = false;

          setTimeout(() => {
            this.router.navigate(['clip', clipDocRef.id]);
          }, 1000);
        },
        error: (error) => {
          this.uploadForm.enable();
          this.alertColor = 'red';
          this.alertMsg = 'Upload failed. Please try again';
          //we need to enable the user to upload the file again, so inSubmission will be set to 'true':
          this.inSubmission = true;
          this.showPercentage = false;
          console.error(error);
        },
      });
  }
}
