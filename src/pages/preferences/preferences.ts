import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HttpHeaders, HttpClient } from '@angular/common/http';

/**
 * Generated class for the PreferencesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-preferences',
  templateUrl: 'preferences.html',
})
export class PreferencesPage {
  pref: { home: string, work: string, outside: string } = {
    home: '',
    work: '',
    outside: ''
  };
  oldLocation = {};
  newLocation;

  constructor(private http: HttpClient, public navCtrl: NavController, public navParams: NavParams) {
    
    var headers = new HttpHeaders(
      {
        "Content-Type": "application/json"
    });
    
    this.http.post("https://pos.api.here.com/positioning/v1/locate?app_id=KJD5CFq6IOliojNRr4fb&app_code=zkTv9Gi4DVjxmihZik2V1w",
    {
      "gsm": [{
      "mcc": 262,
      "mnc": 1,
      "lac": 5126,
      "cid": 21857
      }]
    },
        {headers})
        .subscribe(
            val => {
                console.log("PUT call successful value returned in body",val);
                this.oldLocation = val !== this.newLocation ? this.newLocation : this.oldLocation;
                this.newLocation = val;
                console.log('Old Location is');
                console.log(this.oldLocation);
                console.log('New Location Is');
                console.log(this.newLocation);
            },
            response => {
                console.log("PUT call in error", response);
            },
            () => {
                console.log("The PUT observable is now completed.");
            }
        );
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PreferencesPage');
  }

  getNew() {
    console.log('Get New!');
  }

}
