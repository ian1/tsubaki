const Tsubaki = require('../../Tsubaki.js');
const Command = require('../Command.js');
const Music = require('./Music.js');

/** The pause command */
class Pause extends Command {
  /** Create the command */
  constructor() {
    super('pause', 'Pause playback');
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
      message.channel.sendTemp(Tsubaki.Style.warn(
        'You aren\'t in a voice channel!', Tsubaki.name + ' music'
      ) );
    } else {
      if (music.getPlaying() === undefined) {
        message.channel.sendTemp(Tsubaki.Style.warn(
          'I\'m not playing anything right now.'
          , `${Tsubaki.name} music on ${music.getMusicChannel().name}`
        ) );
      } else {
        if (music.pause()) {
          message.channel.sendTemp(Tsubaki.Style.success(
            'Paused ' + music.getPlaying().titleUrl + '.'
            , `${Tsubaki.name} music on ${music.getMusicChannel().name}`
          ) );
        } else {
          message.channel.sendTemp(Tsubaki.Style.warn(
            `${music.getPlaying().titleUrl} is already paused.`
            , `${Tsubaki.name} music on ${music.getMusicChannel().name}`
          ) );
        }
      }
    }
  }
}

module.exports = Pause;
