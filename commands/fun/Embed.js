const Tsubaki = require('../../Tsubaki.js');
const Discord = require('discord.js');

const Command = require('../Command.js');

class Embed extends Command {
  constructor() {
    super('embed', 'Will embed any message given.', ' [color code] <message>');
  }

  execute(message, args, bot, db) {
    let msg = '';
    let color = Tsubaki.color.gray;
    if (args.length >= 2 && args[0].length == 6) {
      color = '0x' + args[0];
      msg = args.slice(1).join(' ');
    } else if (args.length >= 1) {
      msg = args.join(' ')
    } else {
      return message.channel.send({ embed: Tsubaki.Style.warn('Please tell me what to say!') });
    }
    
    let embed = new Discord.RichEmbed()
      .setDescription(msg)
      .setColor(color);
    message.channel.send({ embed: embed });
  }
}

module.exports = Embed;