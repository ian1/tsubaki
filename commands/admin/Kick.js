const Tsubaki = require('../../Tsubaki.js');
const Discord = require('discord.js');

const Command = require('../Command.js');

class Kick extends Command {
  constructor() {
    super('kick', 'Will kick the specified user.', ' <@mention> [reason]');
  }

  executeAdmin(message, args, bot, db) {
    let userToKick = message.mentions.users.first();
    if (userToKick == '' || userToKick === undefined) return message.channel.sendTemp(Tsubaki.Style.unknownUser(), 10000);
    let userID = userToKick.id;

    let isKickable = message.guild.member(userToKick).kickable;

    let reason = args.slice(1).join(' ');

    if (isKickable || userID.kickable) {
      message.guild.member(userToKick.id).send(':boot: You have been {0} by {1} {2}'
        .format(Tsubaki.Style.bold('kicked'), Tsubaki.Style.bold(message.author), (reason.length > 0 ? ' for: ' + Tsubaki.Style.bold(reason) : '!')));

      if (reason.length > 0) {
        message.guild.member(userToKick).kick(reason);
      } else {
        message.guild.member(userToKick).kick();
      }

      message.channel.sendTemp(':boot: {0} has been {1} by {2} {3}'
        .format(userToKick.username, Tsubaki.Style.bold('kicked'), Tsubaki.Style.bold(message.author.tag),
        (reason.length > 0 ? 'for: ' + Tsubaki.Style.bold(reason) : '!')), 30000);
    } else if (!isKickable || !(userID.kickable)) {
      message.channel.sendTemp(Tsubaki.Style.error('You can\'t kick that user!'), 10000);
    }
  }

  execute(message, args, bot, db) {
    if (message.member !== undefined && message.member.hasPermission(Tsubaki.adminPermission)) {
      this.executeAdmin(message, args, bot, db);
    } else {
      return message.channel.sendTemp(Tsubaki.Style.notFound(), 10000);
    }
  }
}

module.exports = Kick;