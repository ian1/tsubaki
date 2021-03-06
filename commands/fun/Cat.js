const Tsubaki = require('../../Tsubaki.js');
const Command = require('../Command.js');
const random = require('random-animal');

/** The cat command */
class Cat extends Command {
  /** Create the cat command */
  constructor() {
    super('cat', 'Will give a random picture of a cat.');
  }

  /**
   * @param {Discord.Message} message The sent command
   * @param {string[]} args The arguments in the command
   * @param {Discord.Client} bot The instance of the discord client
   * @param {sqlite.Database} db The instance of the database
   */
  execute(message, args, bot, db) {
    random.cat().then(
      (url) => message.channel.sendType(url)
    ).catch((err) => {
      console.log(err);
      message.channel.sendType(Tsubaki.Style.errorGeneric() );
    });
  }
}

module.exports = Cat;
