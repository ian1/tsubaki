const Tsubaki = require('../../Tsubaki.js');
const Discord = require('discord.js');

const Command = require('../Command.js');

class UnBan extends Command {
  constructor() {
    super('unban', 'Unban the specified user.', ' <id> [reason]');
  }

  executeAdmin(message, args, bot, db) {
    let userToUnBan = bot.users.get(args[0]);
    if (userToUnBan == '' || userToUnBan === undefined) return message.channel.sendTemp(Tsubaki.Style.unknownUser(), 10000);
    
    let reason = args.slice(1).join(' ');
    userToUnBan.send('You have been {0} by {1} {2}'
      .format(Tsubaki.Style.bold('unbanned'), Tsubaki.Style.bold(message.author), (reason.length > 0 ? ' for: ' + Tsubaki.Style.bold(reason) : '!')));

    message.guild.unban(userToUnBan);

    message.channel.sendTemp(Tsubaki.Style.success('{0} has been {1} by {2} {3}'
      .format(userToUnBan.username, Tsubaki.Style.bold('unbanned'), Tsubaki.Style.bold(message.author.tag),
      (reason.length > 0 ? 'for: ' + Tsubaki.Style.bold(reason) : '!'))), 30000);
  }

  execute(message, args, bot, db) {
    if (message.member !== undefined && message.member.hasPermission(Tsubaki.adminPermission)) {
      this.executeAdmin(message, args, bot, db);
    } else {
      return message.channel.sendTemp(Tsubaki.Style.notFound(), 10000);
    }
  }
}

module.exports = UnBan;