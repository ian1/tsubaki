const Tsubaki = require('../../Tsubaki.js');
const AdminCommand = require('./AdminCommand.js');

/** The kick command */
class Kick extends AdminCommand {
  /** Create the command */
  constructor() {
    super('kick', 'Will kick the specified user.', ' <@mention> [reason]');
  }

  /**
   * @param {Discord.Message} message The sent command
   * @param {string[]} args The arguments in the command
   * @param {Discord.Client} bot The instance of the discord client
   * @param {sqlite.Database} db The instance of the database
   */
  executeAdmin(message, args, bot, db) {
    let userToKick = message.mentions.users.first();
    if (userToKick == '' || userToKick === undefined) {
      message.channel.sendType(Tsubaki.Style.unknownUser() );
      return;
    }
    let userID = userToKick.id;

    let isKickable = message.guild.member(userToKick).kickable;

    let reason = args.slice(1).join(' ');

    if (isKickable || userID.kickable) {
      message.guild.member(userToKick.id).send(
        `You have been **kicked** by **${message.author}`
        + (reason.length > 0 ? ` for: **${reason}**` : ' !')
      );

      if (reason.length > 0) {
        message.guild.member(userToKick).kick(reason);
      } else {
        message.guild.member(userToKick).kick();
      }

      message.channel.sendType(Tsubaki.Style.success(
        `**${userToKick.tag}** has been **kicked** by **${message.author}**`
        + (reason.length > 0 ? ` for: **${reason}**` : ' !')
         )
      );
    } else if (!isKickable || !(userID.kickable)) {
      message.channel.sendType(Tsubaki.Style.error(
        'You can\'t kick that user!'
      ) );
    }
  }
}

module.exports = Kick;
