'use strict';

Router.route('admin', {
    data: function () {
        return {
            teams: App.teams.collection.find()
        };
    }
});


Template.admin.events({
    'click .team': function (e) {
        Session.set('teams.selected', this._id);
    },
    'click .team .start-funding.btn': function () {
        App.admin.collection.insert({_id: 'funding', teamId: this._id});
    },
    'click .team .stop-funding.btn': function () {
        App.admin.collection.remove({_id: 'funding'});
    }
});

Template.admin.helpers({
    selected: function () {
        var selected = Session.get('teams.selected') === this._id;
        var funding = App.admin.collection.findOne('funding');
        var funded = funding && funding.teamId === this._id;
        return selected || funded ? 'selected' : null;
    },
    fundingStarted: function () {
        return App.admin.collection.findOne('funding') ? 'funding-started' : null;
    }
});