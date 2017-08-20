const Tsubaki = require('../../Tsubaki.js');
const Discord = require('discord.js');

const Command = require('../Command.js');

class LeaveGuild extends Command {
  constructor() {
    super('leaveguild', 'Remove ' + Tsubaki.name + ' from a guild.', ' <guild id>');
  }

  executeAdmin(message, args, bot, db) {
    if (args.length > 0) {
      let guild = bot.guilds.get(args[0]);
      guild.leave();
      message.channel.send(Tsubaki.Style.success('Left server ' + guild.name));
    }
    else message.channel.send(Tsubaki.Style.warn('Please provide a guild id'));
  }

  execute(message, args, bot, db) {
    if (message.member !== undefined && (message.member.id === Tsubaki.ianId || message.member.id === Tsubaki.davidId)) {
      this.executeAdmin(message, args, bot, db);
    } else {
      return message.channel.send(Tsubaki.Style.notFound());
    }
  }
}

module.exports = LeaveGuild;