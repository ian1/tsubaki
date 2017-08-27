const Tsubaki = require('../../Tsubaki.js');
const Command = require('../Command.js');
const Music = require('./Music.js');

/** The skip command */
class Skip extends Command {
  /** Create the command */
  constructor() {
    super('skip', 'Skip the current song');
  }

  /**
   * @param {Discord.Message} message The sent command
   * @param {string[]} args The arguments in the command
   * @param {Discord.Client} bot The instance of the discord client
   * @param {sqlite.Database} db The instance of the database
   */
  execute(message, args, bot, db) {
    let music = Music.getMusic(message.member.voiceChannel);
    if (music === undefined) {
      message.channel.sendType(Tsubaki.Style.warn(
        'You aren\'t in a voice channel!'
        , `${Tsubaki.name} music`
      ), 10000);
    } else {
      if (music.getPlaying() === undefined) {
        message.channel.sendType(Tsubaki.Style.warn(
          'I\'m not playing anything right now.'
          , `${Tsubaki.name} music on ${music.getMusicChannel().name}`
        ), 10000);
      } else {
        message.channel.sendType(Tsubaki.Style.success(
          `Skipped ${music.getPlaying().titleUrl}.`
          , `${Tsubaki.name} music on ${music.getMusicChannel().name}`
        ), 10000);
        music.skip();
      }
    }
  }
}

module.exports = Skip;
