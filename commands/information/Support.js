const Tsubaki = require('../../Tsubaki.js');
const Discord = require('discord.js');
const Command = require('../Command.js');

/** The support command  */
class Support extends Command {
  /** Create the command */
  constructor() {
    super(
      'support'
      , `${Tsubaki.name} will private message you the support server link.`
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
      .setDescription(Tsubaki.Style.codeBlock(
        'Have Questions or need help?', 'js'
      ) + '\n\n' + this.getInformation())
      .addField(`**${Tsubaki.name}**'s Help Server`
      , '[Click Here to join](https://discord.gg/Gf7hb33)')
      .setColor(Tsubaki.color.green);
    message.author.send({embed: embed});
  }
}

module.exports = Support;
