const Tsubaki = require('../../Tsubaki.js');
const Discord = require('discord.js');

const Command = require('../Command.js');

class Invite extends Command {
  constructor() {
    super('invite', Tsubaki.name + ' will private message you information about her, including her invite link.', '');
  }

  execute(message, args, bot, db) {
    let embed = new Discord.RichEmbed()
      .setDescription(Tsubaki.Style.codeBlock('Invite ' + Tsubaki.name + ' to your server!', 'css') + '\n\n' + this.getInformation())
      .addField(Tsubaki.name + '\'s Help Server',
        Tsubaki.Style.url('Click Here to join', 'https://discord.gg/Gf7hb33'))
      .addField(Tsubaki.name + '\'s Invitation Link',
        Tsubaki.Style.url('Click Here to invite', 'https://discordapp.com/oauth2/authorize?'
        + 'client_id=334386617626263553&scope=bot&permissions=305196094'))
      .setColor(Tsubaki.color.green);
    message.author.send({ embed: embed });
  }
}

module.exports = Invite;