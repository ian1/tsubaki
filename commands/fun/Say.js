const Tsubaki = require('../../Tsubaki.js');
const Command = require('../Command.js');

/** The say command */
class Say extends Command {
  /** Create the command */
  constructor() {
    super('say', Tsubaki.name + ' will say any message given.', ' <message>');
  }

  /**
   * @param {Discord.Message} message The sent command
   * @param {string[]} args The arguments in the command
   * @param {Discord.Client} bot The instance of the discord client
   * @param {sqlite.Database} db The instance of the database
   */
  execute(message, args, bot, db) {
    if (args.length == 0) {
      message.channel.sendType(Tsubaki.Style.warn(
        'Please tell me what to say!'
      ), );
    } else {
      message.channel.sendType(args.join(' '), {tts: false});
    }
  }
}

module.exports = Say;
