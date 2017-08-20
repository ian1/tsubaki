const Tsubaki = require('../../Tsubaki.js');
const Discord = require('discord.js');

const Command = require('../Command.js');
const Music = require('./Music.js');

class Play extends Command {
  constructor() {
    super('play', 'Resume playback', '');
  }

  execute(message, args, bot, db) {
    let music = Music.getMusic(message.member.voiceChannel);
    if (music === undefined) {
      message.channel.sendTemp(Tsubaki.Style.warn('You aren\'t in a voice channel!'
        , Tsubaki.name + ' music'), 10000);
    } else {
      if (music.getPlaying() === undefined) {
        message.channel.sendTemp(Tsubaki.Style.warn('I\'m not playing anything right now.'
          , Tsubaki.name + ' music on ' + music.getMusicChannel().name), 10000);
      } else {
        if (music.resume()) {
          message.channel.sendTemp(Tsubaki.Style.success('Resumed ' + music.getPlaying().titleUrl + '.'
            , Tsubaki.name + ' music on ' + music.getMusicChannel().name), 10000);
        } else {
          message.channel.sendTemp(Tsubaki.Style.warn(music.getPlaying().titleUrl + ' is already playing.'
            , Tsubaki.name + ' music on ' + music.getMusicChannel().name), 10000);
        }
      }
    }
  }
}

module.exports = Play;