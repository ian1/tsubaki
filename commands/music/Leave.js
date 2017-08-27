const Tsubaki = require('../../Tsubaki.js');
const Command = require('../Command.js');
const Music = require('./Music.js');

/** The leave command */
class Leave extends Command {
  /** Create the command */
  constructor() {
    super('leave', `Remove ${Tsubaki.name} from the voice channel`);
  }

  /**
   * @param {Discord.Message} message The sent command
   * @param {string[]} args The arguments in the command
   * @param {Discord.Client} bot The instance of the discord client
   * @param {sqlite.Database} db The instance of the database
   */
  execute(message, args, bot, db) {
    if (message.member !== undefined
      && message.member.hasPermission(Tsubaki.adminPermission)) {
      let music = Music.getMusic(message.member.voiceChannel);
      if (music === undefined) {
        message.channel.sendType(Tsubaki.Style.warn(
          'You aren\'t in a voice channel!', `${Tsubaki.name} music`
        ), 10000);
      } else {
        music.leave();
        message.channel.sendType(Tsubaki.Style.success(
          `${Tsubaki.name} music left ${music.getMusicChannel().name}.`
          , `${Tsubaki.name} music on ${music.getMusicChannel().name}`
        ), 10000);
      }
    } else {
      message.channel.sendType(Tsubaki.Style.notFound(), 10000);
    }
  }
}

module.exports = Leave;
