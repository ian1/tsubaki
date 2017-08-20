const Tsubaki = require('../../Tsubaki.js');
const Discord = require('discord.js');

const Command = require('../Command.js');
const Music = require('./Music.js');

class Pause extends Command {
  constructor() {
    super('pause', 'Pause playback', '');
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
        if (music.pause()) {
          message.channel.sendTemp(Tsubaki.Style.success('Paused ' + music.getPlaying().title + '.'
            , Tsubaki.name + ' music on ' + music.getMusicChannel().name), 10000);
        } else {
          message.channel.sendTemp(Tsubaki.Style.warn(music.getPlaying().title + ' is already paused.'
            , Tsubaki.name + ' music on ' + music.getMusicChannel().name), 10000);
        }
      } 
    }
  }
}

module.exports = Pause;