import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalComponent } from './modal/modal.component';
import { TabsContainerComponent } from './tabs-container/tabs-container.component';
import { TabComponent } from './tab/tab.component';
import { InputComponent } from './input/input.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AlertComponent } from './alert/alert.component';
import { EventBlockerDirective } from './directives/event-blocker.directive';
// import { NgxMaskDirective, NgxMaskPipe, provideNgxMask, IConfig } from 'ngx-mask'
// import { NgxMaskModule } from 'ngx-mask'
// import { ModalService } from '../services/modal.service';

 
@NgModule({
  declarations: [
    ModalComponent,
    TabsContainerComponent,
    TabComponent,
    InputComponent,
    AlertComponent,
    EventBlockerDirective
  ],
  imports: [
    CommonModule, 
    ReactiveFormsModule,
    // NgxMaskDirective, NgxMaskPipe
    // NgxMaskModule.forRoot() 
  ], 
  exports: [
    ModalComponent, 
    TabsContainerComponent, 
    TabComponent, 
    InputComponent,
    AlertComponent,
    EventBlockerDirective,
  ], 
  // providers: [ModalService]
  // providers: [provideNgxMask()]
})

export class SharedModule { }
