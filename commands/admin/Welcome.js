const Tsubaki = require("../../Tsubaki.js");
const Discord = require("discord.js");

let _super = require("../Command.js").prototype;
let method = Welcome.prototype = Object.create(_super);

method.constructor = Welcome;

function Welcome() {
  _super.constructor.apply(this, ["welcome", "Toggle welcome messages on or off for specified channel.", " <enable|disable> [#channel]"]);
}

method.executeAdmin = function (message, args, bot, db) {
  
  if (args.length == 0) return message.channel.send({ embed: Tsubaki.Style.warn("Invalid arguments! Usage: " + this.getUsage()) });
  let guildId = message.guild.id;
  let channelId = message.channel.id;

  let status = args[0].toLowerCase();
  if (args.length >= 2 && args[1].startsWith('<#') && args[1].endsWith('>')) channelId = args[1].substring(2, args[1].length - 1);

  if (status === "enable") {
    if (!message.guild.channels.find('id', channelId)) 
      return message.channel.send({ embed: Tsubaki.Style.warn("Sorry, I couldn't find a channel with the id " + channelId + ".") });
    db.get('SELECT * FROM guilds WHERE guild_id = ' + guildId, function (err, row) {
      if (row === undefined) {
        db.run('INSERT INTO guilds VALUES (' + guildId + ', ' + channelId + ')');
        message.channel.send({
          embed: Tsubaki.Style.success('Welcome messages are now ' + Tsubaki.Style.code('enabled')
            + ' for this guild in channel <#' + channelId + '>.')
        });
      } else if (row.channel_id == channelId) {
        message.channel.send({
          embed: Tsubaki.Style.warn('Welcome messages are already ' + Tsubaki.Style.code('enabled')
            + ' for this guild in channel <#' + channelId + '>,')
        });
      } else {
        db.run('UPDATE guilds SET channel_id = ' + channelId + ' WHERE guild_id = ' + guildId);
        message.channel.send({
          embed: Tsubaki.Style.success('Welcome messages have been switched to channel <#' + channelId + '> for this guild.')
        });
      }
    });
  } else if (status === "disable") {
    db.run('DELETE FROM guilds WHERE guild_id = ' + guildId, function () {
      message.channel.send({
        embed: Tsubaki.Style.success('Welcome messages are now ' + Tsubaki.Style.code('disabled') + ' for this guild. :frowning:')
      });
    });
  } else {
    message.channel.send({ embed: Tsubaki.Style.warn("Invalid arguments! Usage: " + this.getUsage()) });
  }
}

method.execute = function (message, args, bot, db) {
  if (message.member !== undefined && message.member.hasPermission(Tsubaki.adminPermission)) {
    this.executeAdmin(message, args, bot, db);
  } else {
    return message.channel.send({ embed: Tsubaki.Style.notFound() });
  }
}

module.exports = Welcome;