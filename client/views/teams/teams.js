'use strict';

Template.teamsChooser.events({
    'click .join.btn': function (e) {
        e.preventDefault();

    }
});

Router.route('/teams/chooser', {
    name: 'teamsChooser',
    template: 'teamsChooser'
});

Template.teamsRegister.events({
    'submit .register.form': function (e) {
        e.preventDefault();
        var teamName = $('.team-name').val();

        if (!teamName || !teamName.trim()) {
            App.error.handle({}, 'Please provide a valid team name.')
            throw 'up';
        }

        App.teams.collection.insert({name: teamName}, function (err, teamId) {
            if (err) {
                App.error.handle(err, 'Could not register team.');
            } else {
                var userId = Meteor.userId();
                Meteor.users.update(userId, {$set: {'profile.teamId': teamId}}
                    , function (err) {
                        if (err) {
                            App.error.handle(err, 'Team registered but failed to assign to user');
                            Router.go('teamsChooser');
                        } else {
                            Router.go('/');
                        }
                    });
            }
        });
    }
});

Router.route('/teams/register', {
    name: 'teamsRegister',
    template: 'teamsRegister'
});
Router.route('/teams/join', {
    name: 'teamsJoin',
    template: 'teamsJoin'
});