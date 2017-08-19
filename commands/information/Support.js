const Tsubaki = require('../../Tsubaki.js');
const Discord = require('discord.js');

const Command = require('../Command.js');

class Support extends Command {
  constructor() {
    super('support', Tsubaki.name + ' will private message you the support server link.', '');
  }

  execute(message, args, bot, db) {
    let embed = new Discord.RichEmbed()
      .setDescription(Tsubaki.Style.codeBlock('Have Questions or need help?', 'js') + '\n\n' + this.getInformation())
      .addField(Tsubaki.Style.bold(Tsubaki.name + '\'s Help Server'), Tsubaki.Style.url('Click Here to join',
        'https://discord.gg/Gf7hb33'))
      .setColor(Tsubaki.color.green);
    message.author.send({ embed: embed });
  }
}

module.exports = Support;