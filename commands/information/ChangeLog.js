const Tsubaki = require('../../Tsubaki.js');
const Discord = require('discord.js');

const Command = require('../Command.js');

class ChangeLog extends Command {
  constructor() {
    super('changelog', 'Will show ' + Tsubaki.name + '\'s change log.', '');
  }

  execute(message, args, bot, db) {
    let embed = new Discord.RichEmbed()
      .setDescription('not done ;)')
      .setColor(Tsubaki.color.white);
    message.channel.sendTemp({ embed: embed }, 20000);
  }
}

module.exports = ChangeLog;