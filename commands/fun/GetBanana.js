const Tsubaki = require('../../Tsubaki.js');
const Command = require('../Command.js');

/** The getbanana command */
class GetBanana extends Command {
  /** Create the command */
  constructor() {
    super('getbanana', 'Will give you a banana, and list your current points.');
  }

  /**
   * @param {Discord.Message} message The sent command
   * @param {string[]} args The arguments in the command
   * @param {Discord.Client} bot The instance of the discord client
   * @param {sqlite.Database} db The instance of the database
   */
  execute(message, args, bot, db) {
    Tsubaki.getPoints(message.author.id, (points) => {
      message.channel.sendType(`${message.author}`
        + `, :banana: *You are currently Banana level*`
        + ` \`${Tsubaki.getLevelR(points)}\`, *with*`
        + ` \`${points}\` Bananas!`);
    });
  }
}

module.exports = GetBanana;
