const Tsubaki = require('../../Tsubaki.js');
const OwnerCommand = require('./OwnerCommand.js');

/** The playing command */
class Playing extends OwnerCommand {
  /** Create the command */
  constructor() {
    super(
      'playing', `Set the game of ${Tsubaki.name}. If left empty, it will`
      + ` revert to default.`
      , ' [game]'
    );
  }

  /**
   * @param {Discord.Message} message The sent command
   * @param {string[]} args The arguments in the command
   * @param {Discord.Client} bot The instance of the discord client
   * @param {sqlite.Database} db The instance of the database
   */
  executeOwner(message, args, bot, db) {
    Tsubaki.setPlaying(args.join(' '));
  }
}

module.exports = Playing;
