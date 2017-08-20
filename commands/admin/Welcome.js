const Tsubaki = require('../../Tsubaki.js');
const Discord = require('discord.js');

const Command = require('../Command.js');

class Welcome extends Command {
  constructor() {
    super('welcome', 'Toggle welcome messages on or off for specified channel.', ' <enable|disable> [#channel]');
  }

  executeAdmin(message, args, bot, db) {
    if (args.length == 0) return message.channel.send(Tsubaki.Style.warn('Invalid arguments! Usage: ' + this.getUsage()));
    let guildId = message.guild.id;
    let channelId = message.channel.id;

    let status = args[0].toLowerCase();
    if (args.length >= 2 && args[1].startsWith('<#') && args[1].endsWith('>')) channelId = args[1].substring(2, args[1].length - 1);

    if (status === 'enable') {
      if (!message.guild.channels.find('id', channelId)) 
        return message.channel.send(Tsubaki.Style.warn('Sorry, I couldn\'t find a channel with the id ' + channelId + '.'));
      db.get('SELECT * FROM guilds WHERE guild_id = ' + guildId, function (err, row) {
        if (row === undefined) {
          db.run('INSERT INTO guilds VALUES (' + guildId + ', ' + channelId + ')');
          message.channel.send(
            Tsubaki.Style.success('Welcome messages are now ' + Tsubaki.Style.code('enabled')
              + ' for this guild in channel <#' + channelId + '>.')
          );
        } else if (row.channel_id == channelId) {
          message.channel.send(
            Tsubaki.Style.warn('Welcome messages are already ' + Tsubaki.Style.code('enabled')
              + ' for this guild in channel <#' + channelId + '>,')
          );
        } else {
          db.run('UPDATE guilds SET channel_id = ' + channelId + ' WHERE guild_id = ' + guildId);
          message.channel.send(
            Tsubaki.Style.success('Welcome messages have been switched to channel <#' + channelId + '> for this guild.')
          );
        }
      });
    } else if (status === 'disable') {
      db.run('DELETE FROM guilds WHERE guild_id = ' + guildId, function () {
        message.channel.send(
          Tsubaki.Style.success('Welcome messages are now ' + Tsubaki.Style.code('disabled') + ' for this guild. :frowning:')
        );
      });
    } else {
      message.channel.send(Tsubaki.Style.warn('Invalid arguments! Usage: ' + this.getUsage()));
    }
  }

  execute(message, args, bot, db) {
    if (message.member !== undefined && message.member.hasPermission(Tsubaki.adminPermission)) {
      this.executeAdmin(message, args, bot, db);
    } else {
      return message.channel.send(Tsubaki.Style.notFound());
    }
  }
}

module.exports = Welcome;