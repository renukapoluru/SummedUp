import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Chart } from 'chart.js';

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
  @ViewChild('doughnutCanvas') doughnutCanvas;
  doughnutChart: any;
  sum;
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
    var now = new Date();
    console.log(now);
    this.http.post(`https://summedup-wmn.herokuapp.com/v1/graphql`, 
    {query: `{\n  usersdatetime(where: {record_date: {_eq: "02/6/19"}}) {\n    homeHours\n    record_date\n    workHours\n		otherHours\n  }\n}\n`}
    ).subscribe(
      val => {
        const dateData:any = val;
        const hoursSpent = dateData.data.usersdatetime[0];
        if(dateData.data.usersdatetime.length !== 0 ) {
          this.homeHours = hoursSpent.homeHours;
          this.workHours = hoursSpent.workHours;
          this.otherHours = hoursSpent.otherHours;
          debugger;
          this.loadChartData();
        }
        this.callAPI();
      },
      response => {
        console.log('Response', response);
      },
      () => {
        console.log('Check!');
      }
    );
  }

  async loadChartData() {
    debugger;
    this.sum = this.homeHours + this.workHours + this.otherHours;
    const val1 = Math.floor((this.homeHours/this.sum)*100);
    const val2 = Math.floor((this.workHours/this.sum)*100);
    const val3 = Math.floor((this.otherHours/this.sum)*100);
    const percentages = [];
    percentages.push(val1);
    percentages.push(val2);
    percentages.push(val3);
    console.log(percentages);
    this.loadChart(percentages)
  }
  
  loadChart(data) {  

    debugger;
      this.doughnutChart = new Chart(this.doughnutCanvas.nativeElement, {
      type: 'doughnut',
      data: {
          labels: ["Home", "Work", "Other"],
          datasets: [{
              label: '# of Votes',
              data: data,
              backgroundColor: [
                  'rgba(255, 99, 132)',
                  'rgba(54, 162, 235)',
                  'rgba(255, 206, 86)'
              ],
              hoverBackgroundColor: [
                  "#FF6384",
                  "#36A2EB",
                  "#FFCE56"
              ]
          }]
      }

  });

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
            },
            () => {
              this.http.post('https://summedup-wmn.herokuapp.com/v1/graphql', { query: `mutation {\n  update_usersdatetime(_set: {otherHours: ${this.otherHours}, homeHours: ${this.homeHours}, workHours: ${this.workHours}}, where: {record_date: {_eq: "02/06/19"}}) {\n    returning {\n      homeHours\n      otherHours\n      workHours\n      record_date\n    }\n  }\n}\n`}).subscribe(
                val => {
                  console.log(val);
                },
                response => {
                  console.log(response);
                },
                () => {
                  console.log('Safe');
                }
              );
            }
        );
  }

}
