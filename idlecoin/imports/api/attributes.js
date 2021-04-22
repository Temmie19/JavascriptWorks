import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

const difficulty = new Mongo.Collection("difficulty");

difficulty.insert({"difficulty": 10000000, "current": "difficulty"});
difficulty.insert({"powerCost": 10000, "current": "power"});

var cost = difficulty.findOne({"current":"power"})['powerCost']

const db = Meteor.users;


Meteor.publish('getBalance', function(userID) {
    return db.findOne({"_id":userID}['coinBalance']);
});

Meteor.publish('getProcessingPower', function(userID) {
    return db.findOne({"_id":userID}['processingPower']);
});

Meteor.publish('userData', function(userID) {
    var user = db.find({"_id":userID});
    return user;
});

Meteor.publish('difficulty', function() {
    var currentDifficulty = difficulty.find({"current": "difficulty"});
    return currentDifficulty;
});
Meteor.publish('powerCost', function() {
    var currentDifficulty = difficulty.find({"current": "power"});
    return currentDifficulty;
});

Meteor.methods({
    'status.connectionStatus'(userID, boolean){
        db.update({"_id":userID}, {"$set": {"connected": boolean}});
    },
    'status.confirmConnection'(userID, time){
        db.update({"_id":userID}, {"$set": {"lastPinged": time}});
    },
    'attributes.buyPower'(userID){
        var currentBalance = db.findOne({"_id":userID})['coinBalance'];
        var powerToAdd = Math.trunc(currentBalance*cost);
        var balanceToRemove = powerToAdd/cost;
        var newPower = db.findOne({"_id":userID})['processingPower'] + powerToAdd;
        if(db.findOne({"_id":userID})['processingPower'] < 101){
            newPower = newPower * 10;
        }
        db.update({"_id":userID}, {"$set": {"coinBalance": currentBalance - balanceToRemove }});
        db.update({"_id":userID}, {"$set": {"processingPower": newPower}});
    }
});