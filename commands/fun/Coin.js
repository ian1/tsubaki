const Tsubaki = require('../../Tsubaki.js');
const Command = require('../Command.js');

/** The coin commnand */
class Coin extends Command {
  /** Create the command */
  constructor() {
    super('coin', Tsubaki.name + ' will flip a coin for you.');
  }

  /**
   * @param {Discord.Message} message The sent command
   * @param {string[]} args The arguments in the command
   * @param {Discord.Client} bot The instance of the discord client
   * @param {sqlite.Database} db The instance of the database
   */
  execute(message, args, bot, db) {
    let coins = [
      'Heads',
      'Tails',
    ];
    
    message.channel.sendType(
      ':fingers_crossed: You flipped a coin and it landed on...  '
    ).then((msg) => {
      setTimeout(() => {
        msg.editTemp(
          msg.content
          + `  **${coins[Math.floor(Math.random() * coins.length)]}**!`
          , 10000);
      }, 1000);
    });
  }
}

module.exports = Coin;
