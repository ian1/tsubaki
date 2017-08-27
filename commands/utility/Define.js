const Tsubaki = require('../../Tsubaki.js');
const Discord = require('discord.js');
const Command = require('../Command.js');
const webdict = require('webdict');

/** The define command */
class Define extends Command {
  /** Create the command */
  constructor() {
    super('define', 'Will define any word.', ' <word>');
  }

  /**
   * @param {Discord.Message} message The sent command
   * @param {string[]} args The arguments in the command
   * @param {Discord.Client} bot The instance of the discord client
   * @param {sqlite.Database} db The instance of the database
   */
  execute(message, args, bot, db) {
    let toDefine = message.content.split(' ')[1];
    if (toDefine == '' || toDefine === undefined) {
      message.channel.sendType(Tsubaki.Style.warn(
        'Provide a word to define! :book:'
      ), 10000);
    } else {
      webdict('dictionary', toDefine).then((resp) => {
        let result = resp.definition[0];

        let embed = new Discord.RichEmbed()
          .addField('Word', toDefine)
          .addField('Definition', result)
          .setColor(Tsubaki.color.green)
          .setFooter(Tsubaki.name + ' Dictionary');
        message.channel.sendType({embed: embed}, 20000);
      }).catch(() => {
        message.channel.sendType(Tsubaki.Style.error(
          'Hmm... I can\'t find that word. Please check your spelling!'
        ), 10000);
      });
    }
  }
}

module.exports = Define;
