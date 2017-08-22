const Tsubaki = require('../../Tsubaki.js');
const Discord = require('discord.js');

const Command = require('../Command.js');

/** The invite command */
class Invite extends Command {
  /** Create the command */
  constructor() {
    super(
      'invite'
      , `${Tsubaki.name} will private message you information about her`
      + `, including her invite link.`
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
        `Invite ${Tsubaki.name} to your server!`, 'css'
      ) + `\n\n${this.getInformation()}`)
      .addField(`${Tsubaki.name }'s Help Server`,
        '[Click here to join](https://discord.gg/Gf7hb33)')
      .addField(`${Tsubaki.name}'s Invitation Link`,
        '[Click here to invite](https://discordapp.com/oauth2/authorize'
        + `?client_id=${Tsubaki.botId}&scope=bot&permissions=305196094)`)
      .setColor(Tsubaki.color.green);
    message.author.send({embed: embed});
  }
}

module.exports = Invite;
