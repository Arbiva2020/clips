import { Component, OnInit } from '@angular/core';
import { TitleStrategy } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ModalService } from '../services/modal.service';

// import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
})
export class NavComponent implements OnInit {
  constructor(
    public modal: ModalService,
    public auth: AuthService,
    // private afAuth: AngularFireAuth,
  ) {}
  ngOnInit(): void {}

  openModal($event: Event) {
    $event.preventDefault();

    this.modal.toggleModal('auth');
  }


}
