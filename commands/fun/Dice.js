const Tsubaki = require('../../Tsubaki.js');
const Discord = require('discord.js');

const Command = require('../Command.js');

class Dice extends Command {
  constructor() {
    super('dice', Tsubaki.name + ' will roll the dice and give you a random number.', '');
  }

  execute(message, args, bot, db) {
    message.channel.sendTemp(':game_die: You rolled a ' + (Math.ceil(Math.random() * 6)), 10000);
  }
}

module.exports = Dice;