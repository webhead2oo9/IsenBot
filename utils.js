var fs = require('fs'),
    path = require('path'),
    _ = require("underscore");

var utils = {};

utils.checkMentions = function (mentions, user) {
    for (var i=0; i< mentions.length; i++) {
        if (mentions[i]._userId == user.id) return true;
    }

    return false;
}

utils.isMentioned = function (message, user) {
        return message.content.indexOf(user.mention) !== 0 && utils.checkMentions(message.mentions, user);
};    

utils.usersOnline = function (client, guild){
	return client.Users.onlineMembersForGuild(guild);
}

utils.getDirectories = function(srcpath) {
    return fs.readdirSync(srcpath).filter(function(file) {
        return fs.statSync(path.join(srcpath, file)).isDirectory();
    });
}

utils.getMemberById = function (guild, id) {
    return _.find(guild.members, function(member) { 
        return member._userId === id;
    });
}

utils.dateDifference = function (date1, date2, divisible) {
    var difference = (date1.getTime() - date2.getTime())
    return (divisible? difference / divisible : difference);
}

utils.getArgs = function (argsString) {
    return argsString.trim().replace(/\s\s+/g, ' ').split(" ");
}

module.exports = utils;