const Tsubaki = require('../../Tsubaki.js');
const Discord = require('discord.js');

const Command = require('../Command.js');

/** The info command */
class Info extends Command {
  /** Create the command */
  constructor() {
    super('info', 'Shows ' + Tsubaki.name + '\'s information.');
  }

  /**
   * @param {Discord.Message} message The sent command
   * @param {string[]} args The arguments in the command
   * @param {Discord.Client} bot The instance of the discord client
   * @param {sqlite.Database} db The instance of the database
   */
  execute(message, args, bot, db) {
    let embed = new Discord.RichEmbed()
      .setDescription(`**Information About ${Tsubaki.name}:**`
      + `\n\n${Tsubaki.name} is a **Discord.js** bot. She can be used for`
      + ' moderation, administration, utility, and just for fun. She has a wide'
      + ' range of commands everyone will enjoy, and she is constantly being'
      + ' updated and added to.'
      + '\nGithub Repository: https://github.com/ian1/tsubaki \n')
      .setFooter('Created by ' + Tsubaki.author)
      .setColor(Tsubaki.color.white);
    message.channel.sendTemp({embed: embed}, 30000);
  }
}

module.exports = Info;
