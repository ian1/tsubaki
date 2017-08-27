const Tsubaki = require('../../Tsubaki.js');
const OwnerCommand = require('./OwnerCommand.js');

/** The leaveguild command */
class LeaveGuild extends OwnerCommand {
  /** Create the command */
  constructor() {
    super('leaveguild', `Remove ${Tsubaki.name} from a guild.`, ' <guild id>');
  }

  /**
   * @param {Discord.Message} message The sent command
   * @param {string[]} args The arguments in the command
   * @param {Discord.Client} bot The instance of the discord client
   * @param {sqlite.Database} db The instance of the database
   */
  executeOwner(message, args, bot, db) {
    if (args.length > 0) {
      let guild = bot.guilds.get(args[0]);
      guild.leave();
      message.channel.sendType(Tsubaki.Style.success(
        `Left server ${guild.name}.`
      ), 10000);
    } else {
      message.channel.sendType(Tsubaki.Style.warn(
        'Please provide a guild id.'
      ), 10000);
    }
  }
}

module.exports = LeaveGuild;
