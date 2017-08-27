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
      ) );
      return;
    }

    if (memberMention == '' || memberMention === undefined) {
      message.channel.sendType(Tsubaki.Style.unknownUser() );
    } else {
      message.channel.sendType(Tsubaki.Style.embed(
        `:banana: **${message.author.tag}** has given ${memberMention} a banana!`
      ) );

      Tsubaki.getPoints(memberMention.id).then((points) => {
        Tsubaki.setPoints(memberMention.id, points + 1, message.channel);
      });
    }
  }
}

module.exports = Banana;
