var Discordie = require("discordie");
var config = require("./config.json");
var utils = require("./utils.js"); 
var commands = require("./commands.js");

var client = new Discordie();

client.connect(config.auth);

client.Dispatcher.on("GATEWAY_READY", e => {
  console.log("Connected as: " + client.User.username);

});

client.Dispatcher.on("MESSAGE_CREATE", e => {
    var hasMentioned = utils.isMentioned(e.message, client._user);
    var message = e.message;
    var content = message.resolveContent();
    var isCom = content[0] == "!";

    if (message.author.id === client._user.id || !isCom && !hasMentioned) return;

    // @{bot} command [somthing] || !command [something]
    var cmdtxt = (isCom? 
        content.split(" ")[0].substring(1):
        content.split(" ")[1]);

    var suffix = (isCom? 
        content.substring(cmdtxt.length + 2):
        content.substring("@"+client._user.username.length + cmdtxt.length + 2));

    if (cmdtxt == "help") {
        var msg = "";
        for (var cmd in commands) {
                var info = "!" + cmd;
                var usage = commands[cmd].usage;
                if(usage){
                    info += " " + usage;
                }
                var description = commands[cmd].description;
                if (description){
                    info += "\n\t" + description;
                }
                msg += "\n"+ info;
            }

        message.reply(msg);
    }
        
    

    var command = commands[cmdtxt];

    if (command) {
        try {
            command.process(client, e.message, suffix);
        } catch(e) {    
            if (config.debug) message.reply("command " + cmdtxt + " failed :(\n" + e.stack);            
        }
    }
});

exports.addCommand = function(commandName, commandObject){
    try {
        commands[commandName] = commandObject;
    } catch(err){
        console.log(err);
    }
}

exports.commandCount = function(){
    return Object.keys(commands).length;
}