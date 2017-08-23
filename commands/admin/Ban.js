const Tsubaki = require('../../Tsubaki.js');
const AdminCommand = require('./AdminCommand.js');

/** The ban command */
class Ban extends AdminCommand {
  /** Create the command */
  constructor() {
    super('ban', 'Ban mentioned user for a week.', ' <@mention> [reason]');
  }

  /**
   * @param {Discord.Message} message The sent command
   * @param {string[]} args The arguments in the command
   * @param {Discord.Client} bot The instance of the discord client
   * @param {sqlite.Database} db The instance of the database
   */
  executeAdmin(message, args, bot, db) {
    let userToBan = message.mentions.users.first();
    if (userToBan == '' || userToBan === undefined) {
      message.channel.sendTemp(Tsubaki.Style.unknownUser(), 10000);
      return;
    }

    let userID = userToBan.id;

    let isBannable = message.guild.member(userToBan).bannable;

    let reason = args.slice(1).join(' ');

    if (isBannable || userID.bannable) {
      message.guild.member(userToBan.id).send(
        `You have been **banned** by **${message.author}**`
        + (reason.length > 0 ? ` for: **${reason}**` : ' !')
      );

      if (reason.length > 0) {
        message.guild.member(userToBan).ban(7, reason);
      } else {
        message.guild.member(userToBan).ban(7);
      }

      message.channel.sendTemp(Tsubaki.Style.success(
        `${userToBan.tag} has been **banned** by **${message.author}**`
        + (reason.length > 0 ? ` for: **${reason}` : ' !')
      ), 30000);
    } else if (!isBannable || !(userID.bannable)) {
      message.channel.sendTemp(Tsubaki.Style.error(
        `You can't ban that user!`
      ), 10000);
    }
  }
}

module.exports = Ban;
