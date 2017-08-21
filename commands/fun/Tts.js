const Tsubaki = require('../../Tsubaki.js');
const Discord = require('discord.js');

const Command = require('../Command.js');

class Tts extends Command {
  constructor() {
    super('tts', 'Will say given message out loud.', ' <message>');
  }

  execute(message, args, bot, db) {
    if (args.length == 0) {
      message.channel.sendTemp(Tsubaki.Style.warn('Please tell me what to say!'), 10000);
    } else {
      message.channel.send(args.join(' '), { tts: true }).then(msg => {
        msg.delete(10000);
      });
    }
  }
}

module.exports = Tts;