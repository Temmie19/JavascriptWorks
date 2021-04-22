import { Meteor } from 'meteor/meteor';
import '../imports/api/tasks.js';
import './accounts.js';
import '../imports/api/attributes.js';

var currentDifficulty = 1;
var dollarWorth = 0.0001;
var miningSpeed = currentDifficulty * 100;
var costOfPower = dollarWorth * 0.00001 * currentDifficulty;

