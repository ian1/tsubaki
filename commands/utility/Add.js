const Tsubaki = require('../../Tsubaki.js');
const Discord = require('discord.js');

const Command = require('../Command.js');

class Add extends Command {
  constructor() {
    super('add', 'Will add the numbers given.', ' <number 1> <num2> [num3] [num4]...');
  }

  execute(message, args, bot, db) {
    if (args.length < 2) {
      return message.channel.send({ embed: Tsubaki.Style.warn('Hey, you must provide the numbers first!') });
    }
    let numArray = args.map(n => parseInt(n));
    let total = numArray.reduce((p, c) => p + c);
    
    if (!(total < 9007199254740991)) message.channel.send({ embed: Tsubaki.Style.warn('Hey, you must provide the numbers first!') });
    else message.channel.send(total);
  }
}

module.exports = Add;