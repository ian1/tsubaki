const Tsubaki = require('../Tsubaki.js');

/**
 * The (abstract) command class
 */
class Command {
  /**
   * Sets up the command variables
   * @param {string} command The command
   * @param {string} description What the command does
   * @param {string} usage How to use the command (arguments)
   */
  constructor(command, description, usage = '') {
    this._command = command;
    this._description = description;
    this._usage = Tsubaki.prefix + command + usage;
  }

  /**
   * Execute the command, then delete the message.
   * @param {Discord.Message} message The sent command
   * @param {string[]} args The arguments in the command
   * @param {Discord.Client} bot The instance of the discord client
   * @param {sqlite.Database} db The instance of the database
   */
  executeInternal(message, args, bot, db) {
    this.execute(message, args, bot, db);
    message.delete();
  }

  /**
   * The execute command, overridden by the command classes. If this is an admin
   * command, all it does is check for permissions, then runs executeAdmin
   * @param {Discord.Message} message The sent command
   * @param {string[]} args The arguments in the command
   * @param {Discord.Client} bot The instance of the discord client
   * @param {sqlite.Database} db The instance of the database
   */
  execute(message, args, bot, db) {
    throw new Error('Abstract method!');
  }

  /**
   * @return {string} The command
   */
  getCommand() {
    return this._command;
  };

  /**
   * @return {string} The description
   */
  getDescription() {
    return this._description;
  };

  /**
   * @return {string} The usage
   */
  getUsage() {
    return this._usage;
  };

  /**
   * @return {string} Tsubaki's info
   */
  getInformation() {
    return `**${Tsubaki.name} Information:**`
      + `\n${Tsubaki.name} is a Discord.js bot that you can have fun with`
      + ` *and* moderate with. Do \`${Tsubaki.help().getUsage()}\``
      + ` and a list of all my commands will pop up.`;
  };
}

module.exports = Command;

/* TEMPLATE

const Tsubaki = require('../../Tsubaki.js');
const Discord = require('discord.js');

const Command = require('../Command.js');

class NAME extends Command {
  constructor() {
    super('COMMAND', 'DESCRIPTION', 'USAGE');
  }

  execute(message, args, bot, db) {
    // ACTION
  }
}

module.exports = NAME;

*/
