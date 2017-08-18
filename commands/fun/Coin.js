const Tsubaki = require('../../Tsubaki.js');
const Discord = require('discord.js');

const Command = require('../Command.js');

class Coin extends Command {
  constructor() {
    super('coin', Tsubaki.name + ' will flip a coin for you.', '');
  }

  execute(message, args, bot, db) {
    let coins = [
      'Heads',
      'Tails',
    ]
    message.channel.send(':fingers_crossed: You flipped a coin and it landed on...  ' + Tsubaki.Style.bold(coins[Math.floor(Math.random() * coins.length)] + '!'));
  }
}

module.exports = Coin;