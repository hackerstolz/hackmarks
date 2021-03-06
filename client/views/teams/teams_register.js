'use strict';

Router.route('/teams/register', {
    name: 'teamsRegister',
    template: 'teamsRegister'
});

Template.teamsRegister.events({
    'submit .register.form': function (e) {
        e.preventDefault();
        var teamName = $('.register.form .name').val();

        if (!teamName || !teamName.trim()) {
            App.error.handle({}, 'Please provide a valid team name.');
            throw 'up';
        }

        App.teams.collection.insert({name: teamName}, function (err, teamId) {
            if (err) {
                App.error.handle(err, 'Could not register team. ' + err.message);
            } else {
                App.teams.join(teamId)
            }
        });
    },
    'click .logout': function () {
        Meteor.logout();
    }
});

App.component('teams').expose({
    join: function (teamId) {
        var userId = Meteor.userId();
        var f = function (err) {
            App.error.handle(err, 'Team registered but failed to assign to user');
            Meteor.users.update(userId, {$unset: {'profile.teamId': 1}});
            Router.go('teamsRegister');
        };
        Meteor.users.update(userId, {$set: {'profile.teamId': teamId}},
            function (err) {
                if (err) {
                    f(err);
                } else {
                    App.teams.collection.update(teamId, {$push: {memberIds: userId}}, function (err) {
                        if (err) {
                            f(err);
                        } else {
                            Router.go('/');
                        }
                    });

                }
            });
    }
});