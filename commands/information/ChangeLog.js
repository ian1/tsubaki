const Tsubaki = require('../../Tsubaki.js');
const Discord = require('discord.js');
const Command = require('../Command.js');

/** The changelog command */
class ChangeLog extends Command {
  /** Create the command */
  constructor() {
    super('changelog', 'Will show ' + Tsubaki.name + '\'s change log.');
  }

  /**
   * @param {Discord.Message} message The sent command
   * @param {string[]} args The arguments in the command
   * @param {Discord.Client} bot The instance of the discord client
   * @param {sqlite.Database} db The instance of the database
   */
  execute(message, args, bot, db) {
    let embed = new Discord.RichEmbed()
      .setDescription('um something idk')
      .setColor(Tsubaki.color.white);
    message.channel.sendType({embed: embed} );
  }
}

module.exports = ChangeLog;
