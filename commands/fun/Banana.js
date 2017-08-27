const Tsubaki = require('../../Tsubaki.js');
const Command = require('../Command.js');

/** The banana command */
class Banana extends Command {
  /** Create the command */
  constructor() {
    super('banana', 'Will give the mentioned member a banana.', ' <@mention>');
  }

  /**
   * @param {Discord.Message} message The sent command
   * @param {string[]} args The arguments in the command
   * @param {Discord.Client} bot The instance of the discord client
   * @param {sqlite.Database} db The instance of the database
   */
  execute(message, args, bot, db) {
    let memberMention = message.mentions.users.first();
    if (memberMention == message.author) {
      message.channel.sendType(Tsubaki.Style.embed(
        `:x: Don't be greedy, sweetie~ :kissing_heart:`
      ), 10000);
      return;
    }

    if (memberMention == '' || memberMention === undefined) {
      message.channel.sendType(Tsubaki.Style.unknownUser(), 10000);
    } else {
      message.channel.sendType(
        `:banana: ${message.author.tag} has given ${memberMention} a banana!`
        , 20000);

      Tsubaki.getPoints(memberMention.id).then((points) => {
        Tsubaki.setPoints(memberMention.id, points + 1, message.channel);
      });
    }
  }
}

module.exports = Banana;
