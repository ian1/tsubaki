const Tsubaki = require('../../Tsubaki.js');
const Discord = require('discord.js');
const random = require('random-animal');

const Command = require('../Command.js');

class Cat extends Command {
  constructor() {
    super('cat', 'Will give a random picture of a cat.', '');
  }

  execute(message, args, bot, db) {
    random.cat().then(url => message.channel.sendTemp(url, 30000)).catch(err => {
      console.log(err.message);
      message.channel.sendTemp(Tsubaki.Style.errorGeneric(), 10000);
    });
  }
}

module.exports = Cat;