const Tsubaki = require('../../Tsubaki.js');
const AdminCommand = require('./AdminCommand.js');

/** The delete command */
class Delete extends AdminCommand {
  /** Create the command */
  constructor() {
    super(
      'delete', 'Delete the specified number of messages.'
      , ' <number between 1 and 99>'
    );
  }

  /**
   * @param {Discord.Message} message The sent command
   * @param {string[]} args The arguments in the command
   * @param {Discord.Client} bot The instance of the discord client
   * @param {sqlite.Database} db The instance of the database
   */
  executeAdmin(message, args, bot, db) {
    if (args.length == 0 || parseInt(args[0]) < 1) {
      message.channel.sendType(Tsubaki.Style.warn(
        ':grey_question: How many messages do you want to delete?'
      ) );
    } else if (parseInt(args[0]) > 100) {
      message.channel.sendType(Tsubaki.Style.warn(
        `I can't delete more than 100 messages!`
      ) );
    } else {
      message.channel.fetchMessages({limit: parseInt(args[0]) + 1})
        .then((messages) => message.channel.bulkDelete(messages)).catch((err) => {
        message.channel.sendType(Tsubaki.Style.errorGeneric() );
        console.log(err);
      });
    }
  }
}

module.exports = Delete;
