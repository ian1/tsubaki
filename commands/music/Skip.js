const Tsubaki = require('../../Tsubaki.js');
const Discord = require('discord.js');

const Command = require('../Command.js');
const Music = require('./Music.js');

class Skip extends Command {
  constructor() {
    super('skip', 'Skip the current song', '');
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
        message.channel.sendTemp(Tsubaki.Style.success('Skipped ' + music.getPlaying().title + '.'
          , Tsubaki.name + ' music on ' + music.getMusicChannel().name), 10000);
        music.skip();
      }  
    }
  }
}

module.exports = Skip;