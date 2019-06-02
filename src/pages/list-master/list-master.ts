import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HttpHeaders, HttpClient } from '@angular/common/http';

@IonicPage()
@Component({
  selector: 'page-list-master',
  templateUrl: 'list-master.html'
})
export class ListMasterPage {

  homeLocation = {
    "location": {
    "lat": 50.5187469,
    "lng": 13.37551117,
    "accuracy": 338
    }
  };
  workLocation = {
    "location": {
      "lat": 52.5187469,
      "lng": 13.37551117,
      "accuracy": 338
    }
  };
  homeInterval;
  workInterval;
  othersInterval;
  homeHours = 0;
  workHours = 0;
  otherHours = 0;
  constructor(private http: HttpClient, public navCtrl: NavController, public navParams: NavParams) {

  }

  ngOnInit() {
    this.getCurrentHours();
  }

  inHome() {
    this.homeInterval = setInterval(() => {
      this.homeHours = this.homeHours + 1;
    }, 60000);  
  }

  inWork() {
    this.workInterval = setInterval(() => {
      this.workHours = this.workHours + 1;
    }, 60000);  
  }

  others() {
    this.othersInterval = setInterval(() => {
      this.otherHours = this.otherHours + 1;
    }, 60000);  
  }

  getCurrentHours() {
    // var dateFormat = require('dateformat');
    // var now = new Date();
    // console.log(now);
    // this.http.post(`https://summedupwmn.herokuapp.com/v1/graphql`, 
    // { query: `{\n  usersdatetime(where: {date: {_eq: ${now}}, homeHours: {}, workHours: {}}) {\n    workHours\n    homeHours\n  }\n}\n`}
    // ).subscribe(
    //   val => {
    //     console.log('Value', val);
    //     this.callAPI();
    //   },
    //   response => {
    //     console.log('Response', response);
    //   },
    //   () => {
    //     console.log('Check!');
    //   }
    // );
  }

  callAPI() { 
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
                const newLocation: any = val;
                if( (newLocation.location.lat == this.homeLocation.location.lat) &&
                    (newLocation.location.lng == this.homeLocation.location.lng)
                ) {
                  this.inHome();
                  clearInterval(this.workInterval);
                  clearInterval(this.othersInterval);
                }
                else if( (newLocation.location.lat == this.workLocation.location.lat) &&
                    (newLocation.location.lng == this.workLocation.location.lng)
                ) {
                  this.inWork();
                  clearInterval(this.homeInterval);
                  clearInterval(this.othersInterval);
                }
                else {
                  this.others();
                  clearInterval(this.homeInterval);
                  clearInterval(this.workInterval);
                }
            },
            response => {
                console.log("Server Responded With", response);
            }
        );
  }

}
