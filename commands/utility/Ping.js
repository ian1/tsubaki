const Tsubaki = require('../../Tsubaki.js');
const Discord = require('discord.js');

const Command = require('../Command.js');

class Ping extends Command {
  constructor() {
    super('ping', 'Returns ' + Tsubaki.name + '\'s ping (useful for testing connection).', '');
  }

  execute(message, args, bot, db) {
    let ping = bot.ping;
    let color = Tsubaki.color.green;
    if (ping > 150) {
      color = Tsubaki.color.red;
    } else if (ping > 100) {
      color = Tsubaki.color.yellow;
    }

    let embed = new Discord.RichEmbed()
      .setDescription('Pong! ' + Tsubaki.Style.code(Number(Math.round(ping + 'e2') + 'e-2') + ' ms') + '.')
      .setColor(color);
    message.channel.send({ embed: embed });
  }
}

module.exports = Ping;