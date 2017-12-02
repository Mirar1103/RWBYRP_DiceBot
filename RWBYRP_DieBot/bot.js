/**
 * Created by Maximilian on 02.12.2017.
 */
var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');
var random = require('lodash.random');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var xhr = new XMLHttpRequest();
xhr.addEventListener('load', function(event) {
    if (xhr.status >= 200 && xhr.status < 300) {
        var answerjson = xhr.responseText;
        var answer = JSON.parse(answerjson);
        var reply = "Result: " + answer.result + ',' + answer.details;
        console.log(reply);
        bot.sendMessage({
            to: ChannelID,
            message: reply
        })
    } else {
        console.warn(xhr.statusText, xhr.responseText);
    }
});
var ChannelID
// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';
// Initialize Discord Bot
var bot = new Discord.Client({
    token: auth.token,
    autorun: true
});
bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});
bot.on('message', function (user, userID, channelID, message, evt) {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    ChannelID = channelID;
    if (message.substring(0, 6) == '!roll ') {
        var args = message.substring(6).split(' ');
        var cmd = args[0];
        roll(cmd);

    }
});
function roll(input) {
    var address = "https://rolz.org/api/?"+input+".json";
    console.log(address);
    xhr.open("GET", address);
    xhr.send();
}