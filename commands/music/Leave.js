const Tsubaki = require('../../Tsubaki.js');
const Discord = require('discord.js');

const Command = require('../Command.js');
const Music = require('./Music.js');

class Leave extends Command {
  constructor() {
    super('leave', 'Remove ' + Tsubaki.name + ' from the voice channel', '');
  }

  execute(message, args, bot, db) {
    if (message.member !== undefined && message.member.hasPermission(Tsubaki.adminPermission)) {
      let music = Music.getMusic(message.member.voiceChannel);
      if (music === undefined) {
        message.channel.sendTemp(Tsubaki.Style.warn('You aren\'t in a voice channel!'
          , Tsubaki.name + ' music'), 10000);
      } else {
        music.leave();
        message.channel.sendTemp(Tsubaki.Style.success(Tsubaki.name + ' music left '
          + music.getMusicChannel().name + '.'
          , Tsubaki.name + ' music on ' + music.getMusicChannel().name), 10000);
      }
    } else {
      return message.channel.sendTemp(Tsubaki.Style.notFound(), 10000);
    }
  }
}

module.exports = Leave;