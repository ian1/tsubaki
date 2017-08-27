const Tsubaki = require('../../Tsubaki.js');
const Discord = require('discord.js');
const Command = require('../Command.js');

/** The embed command */
class Embed extends Command {
  /** Create the command */
  constructor() {
    super('embed', 'Will embed any message given.', ' [color code] <message>');
  }

  /**
   * @param {Discord.Message} message The sent command
   * @param {string[]} args The arguments in the command
   * @param {Discord.Client} bot The instance of the discord client
   * @param {sqlite.Database} db The instance of the database
   */
  execute(message, args, bot, db) {
    let msg = '';
    let color = Tsubaki.color.gray;
    if (args.length >= 2 && args[0].length == 6) {
      color = '0x' + args[0];
      msg = args.slice(1).join(' ');
    } else if (args.length >= 1) {
      msg = args.join(' ');
    } else {
      message.channel.sendType(Tsubaki.Style.warn(
        'Please tell me what to say!'
      ), 10000);
      return;
    }

    let embed = new Discord.RichEmbed()
      .setDescription(msg)
      .setColor(color);
    message.channel.sendType({embed: embed});
  }
}

module.exports = Embed;
