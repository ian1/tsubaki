const Tsubaki = require('../../Tsubaki.js');
const Discord = require('discord.js');
const Command = require('../Command.js');

/** The stats command */
class Stats extends Command {
  /** Create the command */
  constructor() {
    super(
      'stats', `Will show guilds, users, and channels ${Tsubaki.name} is in.`
    );
  }

  /**
   * @param {Discord.Message} message The sent command
   * @param {string[]} args The arguments in the command
   * @param {Discord.Client} bot The instance of the discord client
   * @param {sqlite.Database} db The instance of the database
   */
  execute(message, args, bot, db) {
    let embed = new Discord.RichEmbed()
      .setDescription(`**${Tsubaki.name} Guild Stats:**`)
      .addField('Guilds', bot.guilds.size)
      .addField('Users', bot.users.size)
      .addField('Channels', bot.channels.size)
      .setColor(Tsubaki.color.green)
      .setFooter(`${Tsubaki.name} Stats`);
    message.channel.sendType({embed: embed}, 20000);
  }
}

module.exports = Stats;
