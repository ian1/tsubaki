const Tsubaki = require('../../Tsubaki.js');
const AdminCommand = require('./AdminCommand.js');

/** The welcome command */
class Welcome extends AdminCommand {
  /** Create the command */
  constructor() {
    super(
      'welcome', 'Toggle welcome messages on or off for specified channel.'
      , ' <enable|disable> [#channel]'
    );
  }

  /**
   * @param {Discord.Message} message The sent command
   * @param {string[]} args The arguments in the command
   * @param {Discord.Client} bot The instance of the discord client
   * @param {sqlite.Database} db The instance of the database
   */
  executeAdmin(message, args, bot, db) {
    if (args.length == 0) {
      message.channel.sendType(Tsubaki.Style.warn(
        'Invalid arguments! Usage: ' + this.getUsage()
      ) );
      return;
    }

    let guildId = message.guild.id;
    let channelId = message.channel.id;

    let status = args[0].toLowerCase();
    if (args.length >= 2 && args[1].startsWith('<#') && args[1].endsWith('>')) {
      channelId = args[1].substring(2, args[1].length - 1);
    }

    if (status === 'enable') {
      if (!message.guild.channels.find('id', channelId)) {
        message.channel.sendType(Tsubaki.Style.warn(
          `Sorry, I couldn't find a channel with the id ${channelId}.`
        ) );
        return;
      }

      db.get(`SELECT * FROM guilds WHERE guild_id = ${guildId}`, (err, row) => {
        if (row === undefined) {
          db.run(`INSERT INTO guilds VALUES (${guildId}, ${channelId})`);
          message.channel.sendType(Tsubaki.Style.success(
            'Welcome messages are now `enabled`'
              + ` for this guild in channel <#${channelId}>.`
          ) );
        } else if (row.channel_id == channelId) {
          message.channel.sendType(Tsubaki.Style.warn(
            'Welcome messages are already `enabled`'
            + ` for this guild in channel <#${channelId}>.`
          ) );
        } else {
          db.run(
            `UPDATE guilds SET channel_id = ${channelId}`
            + ` WHERE guild_id = ${guildId}`
          );
          message.channel.sendType(Tsubaki.Style.success(
            `Welcome messages have been switched to channel`
            + ` <#${channelId}> for this guild.`
          ) );
        }
      });
    } else if (status === 'disable') {
      db.run('DELETE FROM guilds WHERE guild_id = ' + guildId, () => {
        message.channel.sendType(Tsubaki.Style.success(
          'Welcome messages are now `disabled` for this guild. :frowning:'
        ) );
      });
    } else {
      message.channel.sendType(Tsubaki.Style.warn(
        'Invalid arguments! Usage: ' + this.getUsage()
      ) );
    }
  }
}

module.exports = Welcome;
