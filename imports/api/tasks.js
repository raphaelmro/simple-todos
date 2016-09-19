import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Tasks = new Mongo.Collection('tasks');

if (Meteor.isServer) {
  //This code only runs on the server
  Meteor.publish('tasks', function taskPublication(){
    return Tasks.find();
  });
}

Meteor.methods({
  'tasks.insert'(text){
    check(text, String);

    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    Task.insert({
      text,
      createdAt: new Date(),
      owner: this.userId,
      username: Meteor.users.findOne(this.userId).username,
    });
  },
  'tasks.remove'(taskId){
    check(taskId, String);
    Tasks.remove(taskId);
  },
  'task.setChecked'(taskId, setChecked){
    check(taskId, String);
    check(setChecked, Boolean);

    Tasks.update(taskId,{$set: {checked: setChecked}});
  },
  'tasks.setPrivate'(taskId, setToPrivate){
    check(taskId, String);
    check(setToPrivate, Boolean);

    const task = Tasks.findOne(taskId);

    // Make sure only the task owner can make private
    if (task.owner !== this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    Tasks.update(taskId, {$set: {private: setToPrivate}});

  },

})
