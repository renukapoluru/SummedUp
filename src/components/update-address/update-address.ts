import { Component } from '@angular/core';

/**
 * Generated class for the UpdateAddressComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'update-address',
  templateUrl: 'update-address.html'
})
export class UpdateAddressComponent {

  text: string;

  constructor() {
    console.log('Hello UpdateAddressComponent Component');
    this.text = 'Hello World';
  }

}
