const Tsubaki = require('../../Tsubaki.js');
const Discord = require('discord.js');

const Command = require('../Command.js');

class Info extends Command {
  constructor() {
    super('info', 'Shows ' + Tsubaki.name + '\'s information.', '');
  }

  execute(message, args, bot, db) {
    let embed = new Discord.RichEmbed()
      .setDescription(Tsubaki.Style.bold('Information About ' + Tsubaki.name) + '\n\n     '
        + Tsubaki.name + ' is a ' + Tsubaki.Style.bold('Discord.js') + ' bot. She can be used for moderation, '
        + 'administration, utility, and just for fun. She has a wide range of commands everyone will enjoy, '
        + 'and she is constantly being updated and added to.' + '\n')
      .setFooter('Created by ' + Tsubaki.author)
      .setColor(Tsubaki.color.white);
    message.channel.send({ embed: embed });
  }
}

module.exports = Info;