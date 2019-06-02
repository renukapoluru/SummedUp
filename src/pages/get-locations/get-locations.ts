import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormGroup, FormControl } from '@angular/forms';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/map';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { TabsPage } from '../tabs/tabs';

/**
 * Generated class for the GetLocationsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-get-locations',
  templateUrl: 'get-locations.html',
})
export class GetLocationsPage {
  locationsForm: FormGroup;
  homeLocations: any;
  workLocations:any;
  homeChosenLocation:any;
  workChosenLocation:any;
  homeSubscribe;
  workSubscribe;
  noLocationsHouseMsg = false;
  constructor(
      private storage: Storage,
      private http: HttpClient,
      public navCtrl: NavController, public navParams: NavParams,
    ) {
    this.locationsForm = new FormGroup({
      'searchString': new FormControl(''),
      'workLocation': new FormControl('')
    });
    this.homeSubscribe = this.locationsForm.controls.searchString.valueChanges.debounceTime(500).subscribe((val) => {
      if(val === '' || this.homeChosenLocation) {
        this.homeLocations = null;
      } else {
      this.http.get(`https://places.demo.api.here.com/places/v1/suggest?at=52.5187469%2C13.37551117&q=${val}&app_id=KJD5CFq6IOliojNRr4fb&app_code=zkTv9Gi4DVjxmihZik2V1w`)
        .subscribe(
          val => {
            const homeLocations: any = val;
            // this.noLocationsHouseMsg = homeLocations.length > 0 ? true : false;
            this.homeLocations = homeLocations.suggestions.slice(0,5);
            console.log('Value', val);
          },
          response => {
            this.homeLocations = null;
            console.log('Response', response);
          },
          () => {
            console.log('OK!');
          }
        )
      }
    });
    this.workSubscribe = this.locationsForm.controls.workLocation.valueChanges.debounceTime(500).subscribe((val) => {
      if(val === '' || this.workChosenLocation) {
        this.workLocations = null;
      } else {
      this.http.get(`https://places.demo.api.here.com/places/v1/suggest?at=52.5187469%2C13.37551117&q=${val}&app_id=KJD5CFq6IOliojNRr4fb&app_code=zkTv9Gi4DVjxmihZik2V1w`)
        .subscribe(
          val => {
            const workLocations: any = val;
            // this.noLocationsHouseMsg = homeLocations.length > 0 ? true : false;
            this.workLocations = workLocations.suggestions.slice(0,5);
            console.log('Value', val);
          },
          response => {
            this.workLocations = null;
            console.log('Response', response);
          },
          () => {
            console.log('OK!');
          }
        )
      }
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GetLocationsPage');
  }

  chooseHome(locationAddress) {
    this.homeSubscribe.unsubscribe();
    this.homeLocations = null;
    this.http.get(`https://geocoder.api.here.com/6.2/geocode.json?searchtext=${locationAddress}&app_id=KJD5CFq6IOliojNRr4fb&app_code=zkTv9Gi4DVjxmihZik2V1w&gen=9`)
    .subscribe(
      val => {
        this.homeChosenLocation = val;
      },
      response => {
        console.log('Response', response);
      },
      () => {
        console.log('Ok!');
      }
    );
  }


  chooseWork(locationAddress) {
    this.workSubscribe.unsubscribe();
    this.workLocations = null;
    this.http.get(`https://geocoder.api.here.com/6.2/geocode.json?searchtext=${locationAddress}&app_id=KJD5CFq6IOliojNRr4fb&app_code=zkTv9Gi4DVjxmihZik2V1w&gen=9`)
    .subscribe(
      val => {
        this.workChosenLocation = val;
      },
      response => {
        console.log('Response', response);
      },
      () => {
        console.log('Ok!');
      }
    );
    this.setInLocalStorage();
  }

  setInLocalStorage() {
    this.storage.set('userAuthorized', 1);
    this.storage.get('userAuthorized').then(valueStr => {
    });
  }

  
  navigate() {
    this.navCtrl.push(TabsPage);
  }

}
