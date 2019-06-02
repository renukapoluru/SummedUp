import { Component } from '@angular/core';
import { IonicPage, NavController, CardTitle } from 'ionic-angular';
import { HttpHeaders, HttpClient } from '@angular/common/http';

@IonicPage()
@Component({
  selector: 'page-cards',
  templateUrl: 'cards.html'
})
export class CardsPage {
  cardItems: any;
  showLoader: boolean;
  constructor(private http: HttpClient, public navCtrl: NavController) {
    this.getPreference();
    this.showLoader = false;
  }

  getPreference(){
    this.http.post("https://summedupwmn.herokuapp.com/v1/graphql",{query: "{\n  users {\n    home_pref\n    other_pref\n    work_pref\n  }\n}\n"})
        .subscribe(
            val => {
              const usersData : any = val;
              this.cardItems = usersData.data.users[0];
              console.log(this.cardItems);
              this.showLoader = false;
            },
            response => {
                console.log("PUT call in error", response);
            },
            () => {
                console.log("The PUT observable is now completed.");
            }
        );
  };

  deletePreference(){
    this.showLoader = true;
    this.http.post("https://summedupwmn.herokuapp.com/v1/graphql",{query: "mutation {\n  update_users(where: {userid: {_eq: 1}}, _set: {home_pref: 0, other_pref: 0, work_pref: 0}) {\n   returning {\n      home_pref\n      other_pref\n      userid\n      work_pref\n    }\n  }\n}\n"})
    .subscribe(
      val => {

        this.getPreference();
      },
        response => {
            console.log("PUT call in error", response);
        },
        () => {
            console.log("The PUT observable is now completed.");
        }
    ); 
  };  
  editPreference(){
    this.showLoader = true;
    this.http.post("https://summedupwmn.herokuapp.com/v1/graphql",{query: `mutation {\n  update_users(where: {userid: {_eq: 1}}, _set: {home_pref: ${this.cardItems.home_pref}, other_pref: ${this.cardItems.other_pref}, work_pref: ${this.cardItems.work_pref}}) {\n   returning {\n      home_pref\n      other_pref\n      userid\n      work_pref\n    }\n  }\n}\n`})
    .subscribe(
      val => {

        this.getPreference();
      },
        response => {
            console.log("PUT call in error", response);
        },
        () => {
            console.log("The PUT observable is now completed.");
        }
    ); 
  }; 
}
