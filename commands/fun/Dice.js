const Tsubaki = require('../../Tsubaki.js');
const Command = require('../Command.js');

/** The dice command */
class Dice extends Command {
  /** Create the command */
  constructor() {
    super(
      'dice', `${Tsubaki.name} will roll the dice and give you a random number.`
    );
  }

  /**
   * @param {Discord.Message} message The sent command
   * @param {string[]} args The arguments in the command
   * @param {Discord.Client} bot The instance of the discord client
   * @param {sqlite.Database} db The instance of the database
   */
  execute(message, args, bot, db) {
    message.channel.sendTemp(
      `:game_die: You rolled a ${Math.ceil(Math.random() * 6)}`
      , 10000);
  }
}

module.exports = Dice;
