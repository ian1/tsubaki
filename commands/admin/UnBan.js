const Tsubaki = require('../../Tsubaki.js');
const AdminCommand = require('./AdminCommand.js');

/** The unban command */
class UnBan extends AdminCommand {
  /** Create the command */
  constructor() {
    super('unban', 'Unban the specified user.', ' <id> [reason]');
  }

  /**
   * @param {Discord.Message} message The sent command
   * @param {string[]} args The arguments in the command
   * @param {Discord.Client} bot The instance of the discord client
   * @param {sqlite.Database} db The instance of the database
   */
  executeAdmin(message, args, bot, db) {
    let userToUnBan = bot.users.get(args[0]);
    if (userToUnBan == '' || userToUnBan === undefined) {
      message.channel.sendType(Tsubaki.Style.unknownUser() );
      return;
    }

    let reason = args.slice(1).join(' ');
    userToUnBan.send(
      `You have been **unbanned** by **${message.author}**`
      + (reason.length > 0 ? ` for: **${reason}**` : ' !')
    );

    message.guild.unban(userToUnBan);

    message.channel.sendType(Tsubaki.Style.success(
      `${userToUnban.tag} have been **unbanned** by **${message.author}**`
      + (reason.length > 0 ? ` for: **${reason}**` : ' !')
    ) );
  }
}

module.exports = UnBan;
