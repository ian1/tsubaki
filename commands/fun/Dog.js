const Tsubaki = require('../../Tsubaki.js');
const Discord = require('discord.js');
const random = require('random-animal');

const Command = require('../Command.js');

class Dog extends Command {
  constructor() {
    super('dog', 'Will give a random picture of a dog.', '');
  }

  execute(message, args, bot, db) {
    random.dog().then(url => message.channel.send(url)).catch(err => {
      console.log(err.message);
      message.channel.send({ embed: Tsubaki.Style.errorGeneric() });
    });
  }
}

module.exports = Dog;