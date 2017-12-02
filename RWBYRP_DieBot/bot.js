/**
 * Created by Maximilian on 02.12.2017.
 */
var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');
var random = require('lodash.random');
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
    if (message.substring(0, 6) == '!roll ') {
        var args = message.substring(6).split(' ');
        var cmd = args[0];

                bot.sendMessage({
                    to: channelID,
                    message: roll(cmd)
                })
    }
});
function roll(input) {
    var numberreg = new RegExp("[0-9]*");
    var numberOfDie = input.match(numberreg);
    var result = 'result:';
    var diereg = new RegExp("[a-z]");
    var die = input.match(diereg);
    var remains = input.split(diereg)[1];
    var difficulty = remains.match(numberreg);

    if(die=='d') {
        var dieResult = 0;
        for (i = 0; i < numberOfDie; i++) {
            dieResult += random(1, difficulty);
        }
        result += ' ' + dieResult;
    }
       else if(die=='m'){
        var dieResults = '(';
                    var successes = 0;
                    var ones = 0;
            for(i = 0; i<numberOfDie; i++){
                var roll = random(1,10);
                dieResults += roll+',';
                if(roll >= difficulty){
                    successes++;
                }
                else if(roll == 1){
                    ones++;
                }
                if(roll ==10){
                    i--;
                }

            }
           result += successes +' Ones:'+ones +' '+ dieResults +')';
    } else {
        result = 'Please use a command I understand, Begin it with !roll and then use either [number]d[dieSize] or [numberOfDice]m[difficulty]. For example: 4m8 would mean I roll $ tn sided dies agaisnt a targeet difficulty of 8';
    }

    return result;
}