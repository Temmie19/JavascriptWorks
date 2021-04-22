import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Tracker } from 'meteor/tracker';
import { Mongo } from 'meteor/mongo';

import { Tasks } from '../api/tasks.js';

import './task.js';
import './body.html';
import { data } from 'jquery';

const users = Meteor.users;
const difficulty = new Mongo.Collection("difficulty");

Template.body.onCreated(function bodyOnCreated(){
  this.state = new ReactiveDict();
})

Template.body.helpers({
    tasks() {
      const instance = Template.instance();
      if (instance.state.get('hideCompleted')){
        return Tasks.find({ checked: {$ne: true } }, { sort: { createdAt: -1 } });
      }
        return Tasks.find({}, { sort: { createdAt: -1} });
      },
    incompleteCount() {
      return Tasks.find({ checked: { $ne: true } }).count();
    },

});

Template.body.events({
  'submit .new-task'(event){
    event.preventDefault();

    const target = event.target;
    const text = target.text.value;

    Tasks.insert({
      text,
      createdAt: new Date(),
      owner: Meteor.userId(),
      username: Meteor.user().username,
    });

    target.text.value = '';
  },
  'change .hide-completed input'(event, instance){
    instance.state.set('hideCompleted', event.target.checked);
  },
});

Template.purchaseButton.events({
  "click #buyPower": function(){buyPower();}
});

Tracker.autorun(() => {
  if(Meteor.userId()){
    Meteor.call('status.connectionStatus', Meteor.userId(), "true");
    sendPing(Meteor.userId());
    startInterval();
    Meteor.subscribe('userData', Meteor.userId());
    Meteor.subscribe('difficulty');
    Meteor.subscribe('powerCost');
  }
});

Tracker.autorun((checking) =>{
  data = users.findOne({"_id": Meteor.userId()})
  console.log("Current balance: ", data);

  if(typeof(data) == "object" && Object.keys(data).length > 2){
    setTimeout(updateBalance(), 1000);
    setTimeout(updatePower(), 1000);
    checking.stop();
  }
})

function sendPing(userID){
  console.log("Pinged server!");
  Meteor.call('status.confirmConnection', userID, (new Date()).getTime()/1000);
}

function startInterval(){
  console.log("Interval started");
  setInterval(() => {sendPing(Meteor.userId())}, 60000);
}

function updateBalance(){
  console.log("Update started")
  var balance = (users.findOne({"_id": Meteor.userId()})['processingPower'] / difficulty.findOne({"current": "difficulty"})["difficulty"]);
  setInterval(() =>{
    document.getElementById("balance").textContent = Math.trunc(users.findOne({"_id": Meteor.userId()})['coinBalance'] * 100000000)/100000000;
  }, 1000);
  setInterval(() =>{
    var fraction = balance/50;
    document.getElementById("balance").textContent = Math.trunc((parseFloat(document.getElementById("balance").textContent) + fraction)*1000000000)/1000000000;
  }, 50);
}

function updatePower(){
  console.log("Power logged")
  document.getElementById("power").textContent = ((users.findOne({"_id": Meteor.userId()})['processingPower']).toString() + " MH/s")
}

function buyPower(){
  cost =  difficulty.findOne({"current": "power"})["powerCost"];
  discountCost = difficulty.findOne({"current": "power"})["powerCost"] * 10
  calculated = Math.trunc(users.findOne({"_id":Meteor.userId()})['coinBalance'] * cost)
  discountRate = Math.trunc(users.findOne({"_id":Meteor.userId()})['coinBalance'] * cost * 10)
  dialogString = "Sell " + (calculated/cost).toString() + " coins for " + (calculated).toString() + " MH/s?"
  if(users.findOne({"_id": Meteor.userId()})['processingPower'] < 101){
    dialogString = "Low hash rate discount! Processing power is 10x cheaper! \n\nSell " + (discountRate/discountCost).toString()
     + " coins for " + (discountRate).toString() + " MH/s?";
  }
  if(confirm(dialogString)){
    Meteor.call('attributes.buyPower', Meteor.userId());
  }

}