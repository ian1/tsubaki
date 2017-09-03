const Tsubaki = require('../../Tsubaki.js');
const Command = require('../Command.js');
const Music = require('./Music.js');

/** The play command */
class Play extends Command {
  /** Create the command */
  constructor() {
    super('play', 'Resume playback');
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
        'You aren\'t in a voice channel!', `${Tsubaki.name} music`
      ) );
    } else {
      if (music.getPlaying() === undefined) {
        message.channel.sendType(Tsubaki.Style.warn(
          'I\'m not playing anything right now.'
          , `${Tsubaki.name} music on ${music.getMusicChannel().name}`
        ) );
      } else {
        if (music.resume()) {
          message.channel.sendType(Tsubaki.Style.success(
            'Resumed ' + music.getPlaying().titleUrl + '.'
            , `${Tsubaki.name} music on ${music.getMusicChannel().name}`
          ) );
        } else {
          message.channel.sendType(Tsubaki.Style.warn(
            music.getPlaying().titleUrl + ' is already playing.'
            , `${Tsubaki.name} music on ${music.getMusicChannel().name}`
          ) );
        }
      }
    }
  }
}

module.exports = Play;
