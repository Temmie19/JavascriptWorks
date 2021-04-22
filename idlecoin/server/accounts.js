import { Accounts } from 'meteor/accounts-base';
import { Mongo } from 'meteor/mongo';

Accounts.onCreateUser((options, user) => {
    const userToCreate = Object.assign({
      connected: "false",
      createdAt: new Date(),
      processingPower: 20,
      coinBalance: 0.0,
      lastLogin: (new Date()).getTime(),
    }, user);
  
    if (options.profile) userToCreate.profile = options.profile;
  
    return userToCreate;
  });