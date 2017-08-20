const Tsubaki = require('../../Tsubaki.js');
const Discord = require('discord.js');

const Command = require('../Command.js');

class UnBan extends Command {
  constructor() {
    super('unban', 'Unban the specified user.', ' <id> [reason]');
  }

  executeAdmin(message, args, bot, db) {
    let userToUnBan = bot.users.get(args[0]);
    if (userToUnBan == '' || userToUnBan === undefined) return message.channel.send(Tsubaki.Style.unknownUser());
    
    let reason = args.slice(1).join(' ');
    userToUnBan.send('You have been {0} by {1} {2}'
      .format(Tsubaki.Style.bold('unbanned'), Tsubaki.Style.bold(message.author), (reason.length > 0 ? ' for: ' + Tsubaki.Style.bold(reason) : '!')));

    message.guild.unban(userToUnBan);

    message.channel.send(Tsubaki.Style.success('{0} has been {1} by {2} {3}'
      .format(userToUnBan.username, Tsubaki.Style.bold('unbanned'), Tsubaki.Style.bold(message.author.tag),
      (reason.length > 0 ? 'for: ' + Tsubaki.Style.bold(reason) : '!'))));
  }

  execute(message, args, bot, db) {
    if (message.member !== undefined && message.member.hasPermission(Tsubaki.adminPermission)) {
      this.executeAdmin(message, args, bot, db);
    } else {
      return message.channel.send(Tsubaki.Style.notFound());
    }
  }
}

module.exports = UnBan;