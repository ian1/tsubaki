const Tsubaki = require('../../Tsubaki.js');
const Command = require('../Command.js');

/** The tts command */
class Tts extends Command {
  /** Create the command */
  constructor() {
    super('tts', 'Will say given message out loud.', ' <message>');
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
      ), 10000);
    } else {
      message.channel.sendType(args.join(' '), {tts: true}, 10000);
    }
  }
}

module.exports = Tts;
