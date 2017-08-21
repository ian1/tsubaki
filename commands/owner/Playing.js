const Tsubaki = require('../../Tsubaki.js');
const Discord = require('discord.js');

const Command = require('../Command.js');

class Playing extends Command {
  constructor() {
    super('playing', 'Set the game of the ' + Tsubaki.name + '. If left empty, it will revert to default.', ' [game]');
  }

  executeAdmin(message, args, bot, db) {
    Tsubaki.setPlaying(args.join(' '));
  }

  execute(message, args, bot, db) {
    if (message.member !== undefined && (message.member.id === Tsubaki.ianId || message.member.id === Tsubaki.davidId)) {
      this.executeAdmin(message, args, bot, db);
    } else {
      return message.channel.sendTemp(Tsubaki.Style.notFound(), 10000);
    }
  }
}

module.exports = Playing;