const Tsubaki = require('../../Tsubaki.js');
const Command = require('../Command.js');

/** The (abstract) admin command class */
class AdminCommand extends Command {
  /**
   * Sets up the command variables
   * @param {string} command The command
   * @param {string} description What the command does
   * @param {string} usage How to use the command (arguments)
   */
  constructor(command, description, usage = '') {
    super(command, description, usage);
  }

  /**
   * The execute command for admin commands, overridden by the command classes
   * @param {Discord.Message} message The sent command
   * @param {string[]} args The arguments in the command
   * @param {Discord.Client} bot The instance of the discord client
   * @param {sqlite.Database} db The instance of the database
   */
  executeAdmin(message, args, bot, db) {
    throw new Error('Abstract method!');
  }

  /**
   * Checks for permissions before executing the command
   * @param {Discord.Message} message The sent command
   * @param {string[]} args The arguments in the command
   * @param {Discord.Client} bot The instance of the discord client
   * @param {sqlite.Database} db The instance of the database
   */
  execute(message, args, bot, db) {
    if (message.member !== undefined
      && message.member.hasPermission(Tsubaki.adminPermission)) {
      this.executeAdmin(message, args, bot, db);
    } else {
      message.channel.sendType(Tsubaki.Style.notFound() );
      return;
    }
  }
}

module.exports = AdminCommand;
