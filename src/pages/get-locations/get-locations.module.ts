import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GetLocationsPage } from './get-locations';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    GetLocationsPage,
  ],
  imports: [
    IonicPageModule.forChild(GetLocationsPage),
    ReactiveFormsModule
  ],
  exports: [
    ReactiveFormsModule
  ]
})
export class GetLocationsPageModule {}
