var utils = require("./utils.js");
var _ = require("underscore");
var responses = require("./responses.js");

exports.commands = [
    "ping",
	"perm",
	"votekick",
	"kick",
    "ban",
    "voteban",
    "unban",
    "promote"
];

var votekick_cache = {};
var voteban_cache = {};

exports.ping = {
	usage: "",
	description: "Response from bot",
	process: function (bot, message, suffix) {
       message.reply("pong");
	}
}

exports.perm = {
	usage: "[user]",
	description: "Returns the user's permissions in this channel",
	process: function (bot, message, suffix) {
        var user = message.mentions[0] || message.author
		
        var perm = user.permissionsFor(message.guild);
        var messagePerm = "";
        _.each(perm.General, (el, index) => {
            messagePerm += "\n"+index+ ": " + el;
        });

		message.reply("permissions of " + user.username + ':' + messagePerm);
	}
}

exports.kick = {
	usage: "<user>",
	description: "Kick a user!",
	process: function(bot, message, suffix) {	
        
        var usersToKick = _.filter(message.mentions, user => { 
            return user.id !== bot._user.id;
        });

        if (usersToKick.length == 0) {
            if (message.mentions.length > 0) {
                message.reply(responses.getFailResponse())
            } else {
                message.reply("You must specify a user to kick! Use: !kick @<username>");
            }
        } else {
            _.each(usersToKick, user => {
                var member = utils.getMemberById(message.guild, user.id);
                var promise = member.kick();

                promise.then((reason) => {
                    message.reply("Kicked "+ user.username);
                }).catch((reason) => {
                    message.reply("Failed to Kick @"+ user.username +" ("+ reason +")");
                });
            });                
        }
	}
};

exports.votekick = {
	usage: "<user>",
	description: "Kick a user!",
	process: function(bot, message, suffix) {	
        var neededVotes = 2;
        var usersToKick = _.filter(message.mentions, user => { 
            return user.id !== bot._user.id;
        });

        var user = usersToKick[0] || null;

        if (!user) {
            if (message.mentions.length > 0) {
                message.reply(responses.getFailResponse());
            } else {
                message.reply("You must specify a user to vote kick! Use: !votekick @<username>");
            }
        } else {
            var user_kick = votekick_cache[user.id] || { created: new Date(), votes: [] };

            var days = utils.dateDifference(new Date(), user_kick.created, (1000*60*60*24));

            if (days >= 1) {
                user_kick = { created: new Date(), votes: [] };
            }
            
            if (_.findIndex(user_kick.votes, (x) => x.id == message.author.id) == -1) {
                user_kick.votes.push(message.author);
            } else {
                message.reply("You can only vote once per person.");
                return;
            }
            
            votekick_cache[user.id] = user_kick;

            if (user_kick.votes.length >= 2) {
                var member = utils.getMemberById(message.guild, user.id);
                var promise = member.kick();

                promise.then((reason) => {
                    message.reply("Kicked "+ user.username);
                    votekick_cache[user.id] = undefined;
                }).catch((reason) => {
                    message.reply("Failed to Kick @"+ user.username +" ("+ reason +")");
                    votekick_cache[user.id] = undefined;
                });         
            } else {
                message.reply("Requires "+ (neededVotes - user_kick.votes.length) + " more votes to kick @"+user.username); 
            }
        }
	}
};

exports.ban = {
	usage: "<user>",
	description: "bans the user",
	process: function(bot, message, suffix){

        var usersToBan = _.filter(message.mentions, user => { 
            return user.id !== bot._user.id;
        });

		if (usersToBan.length == 0) {
            if (message.mentions.length > 0) {
                message.reply(responses.getFailResponse());
            } else {
                message.reply("You must specify a user to ban! Use: !ban @<username>");
            }
        } else {
            _.each(usersToBan, user => {
                var member = utils.getMemberById(message.guild, user.id);
                var promise = member.ban();

                promise.then((reason) => {
                    message.reply("Banned "+ user.username);
                }).catch((reason) => {
                    message.reply("Failed to Ban @"+ user.username +" ("+ reason +")");
                });
            });                
        }
	}
};

exports.voteban = {
	usage: "<user>",
	description: "Vote Ban a user!",
	process: function(bot, message, suffix) {	
        var neededVotes = 2;
        var users = _.filter(message.mentions, user => { 
            return user.id !== bot._user.id;
        });

        var user = users[0] || null;

        if (!user) {
            if (message.mentions.length > 0) {
                message.reply(responses.getFailResponse())
            } else {
                message.reply("You must specify a user to vote ban! Use: !votebane @<username>");
            }
        } else {
            var user_kick = voteban_cache[user.id] || { created: new Date(), votes: [] };

            var days = utils.dateDifference(new Date(), user_kick.created, (1000*60*60*24));

            if (days >= 1) {
                user_kick = { created: new Date(), votes: [] };
            }
            
            if (_.findIndex(user_kick.votes, (x) => x.id == message.author.id) == -1) {
                user_kick.votes.push(message.author);
            } else {
                message.reply("You can only vote once per person.");
                return;
            }
            
            voteban_cache[user.id] = user_kick;

            if (user_kick.votes.length >= 2) {
                var member = utils.getMemberById(message.guild, user.id);
                var promise = member.kick();

                promise.then((reason) => {
                    message.reply("Banned "+ user.username);
                    voteban_cache[user.id] = undefined;
                }).catch((reason) => {
                    message.reply("Failed to Ban @"+ user.username +" ("+ reason +")");
                    voteban_cache[user.id] = undefined;
                });         
            } else {
                message.reply("Requires "+ (neededVotes - user_kick.votes.length) + " more votes to Ban @"+user.username); 
            }
        }
	}
};

exports.unban = {
	usage: "<user>",
	description: "unbans the user.",
	process: function(bot, message, suffix){
		var args = utils.getArgs(suffix);
		var usertxt = args.shift();
        
        var bans = message.guild.getBans();

        var user = _.find(bans, (ban) => ban.username == usertxt);
		
		if (user) {
			var promise = bot.guild.unban(user);

            promise.then((reason) => {
                    message.reply("Unbanned "+ user.username);
                }).catch((reason) => {
                    message.reply("Failed to Unbanned "+ user.username +" ("+ reason +")");
                });
		} else {
			message.reply("Couldn't find " + usertxt + " to unban. Sorry");
		}
	}
};


exports.promote = {
	usage: "<user> [role]",
	description: "Promotes specified user to Role",
	process: function (bot, message, suffix) {
        if (!message.mentions[0]) {
             message.reply("You can't promote no one you dingle doink");
             return;
        }

        var user = utils.getMemberById(message.guild, message.mentions[0].id);
        var author = utils.getMemberById(message.guild, message.author.id);
	    var args = utils.getArgs(suffix);
		var roleName = args[1] || "members";

        var role = _.find(message.guild.roles, (role) => {
            return role.name.toLowerCase() == roleName.toLowerCase();
        });
        
        if (!role) {
            message.reply("Couldn't find role: '"+ roleName +"'");
            return;
        }

        if (user.hasRole(role)) { 
            message.reply(user.username + " already is part of '"+ role.name +"'");
            return;
        }

            var promise = user.assignRole(role);

            promise.then((reason) => {
                    message.reply("Assigned '"+ role.name +"' to @"+ user.username);
                }).catch((reason) => {
                    message.reply("Failed to Assign '"+ role.name +"' to @"+ user.username +" ("+ reason +")");
                });
           // message.reply("You can't promote "+ user.username + " to '"+ role.name +"'")
        
	}
}
