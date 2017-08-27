const Tsubaki = require('../../Tsubaki.js');
const Command = require('../Command.js');

/** The add command */
class Add extends Command {
  /** Create the command */
  constructor() {
    super(
      'add'
      , 'Will add the numbers given.'
      , ' <number 1> <num2> [num3] [num4]...'
    );
  }

  /**
   * @param {Discord.Message} message The sent command
   * @param {string[]} args The arguments in the command
   * @param {Discord.Client} bot The instance of the discord client
   * @param {sqlite.Database} db The instance of the database
   */
  execute(message, args, bot, db) {
    if (args.length < 2) {
      message.channel.sendType(Tsubaki.Style.warn(
        'Hey, you must provide the numbers first!'
      ), 10000);
      return;
    }
    let numArray = args.map((n) => parseInt(n));
    let total = numArray.reduce((p, c) => p + c);

    if (!(total < 9007199254740991)) {
      message.channel.sendType(Tsubaki.Style.warn(
        'Hey, you must provide the numbers first!'
      ), 10000);
    } else message.channel.sendType(total, 20000);
  }
}

module.exports = Add;
