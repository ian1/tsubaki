const Tsubaki = require('../../Tsubaki.js');
const Discord = require('discord.js');
const Command = require('../Command.js');

/** The ping command */
class Ping extends Command {
  /** Create the command */
  constructor() {
    super(
      'ping', `Returns ${Tsubaki.name}'s ping (useful for testing connection).`
    );
  }

  /**
   * @param {Discord.Message} message The sent command
   * @param {string[]} args The arguments in the command
   * @param {Discord.Client} bot The instance of the discord client
   * @param {sqlite.Database} db The instance of the database
   */
  execute(message, args, bot, db) {
    let ping = bot.ping;
    let color = Tsubaki.color.green;
    if (ping > 150) {
      color = Tsubaki.color.red;
    } else if (ping > 100) {
      color = Tsubaki.color.yellow;
    }

    let embed = new Discord.RichEmbed()
      .setDescription(
        `Pong! \`${Number(Math.round(ping + 'e2') + 'e-2') + ' ms'}\`.`
      ).setColor(color);
    message.channel.sendTemp({embed: embed}, 5000);
  }
}

module.exports = Ping;
