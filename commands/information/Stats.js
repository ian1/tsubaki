const Tsubaki = require('../../Tsubaki.js');
const Discord = require('discord.js');

const Command = require('../Command.js');

class Stats extends Command {
  constructor() {
    super('stats', 'Will show guilds, users, and channels ' + Tsubaki.name + ' is in.', '');
  }

  execute(message, args, bot, db) {
    let embed = new Discord.RichEmbed()
      .setDescription(Tsubaki.Style.bold(Tsubaki.name) + ' Guild Stats:')
      .addField('Guilds', bot.guilds.size)
      .addField('Users', bot.users.size)
      .addField('Channels', bot.channels.size)
      .setColor(Tsubaki.color.green)
      .setFooter(Tsubaki.name + ' Stats');
    message.channel.sendTemp({ embed: embed }, 20000);
  }
}

module.exports = Stats;