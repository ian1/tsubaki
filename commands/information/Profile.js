const Tsubaki = require('../../Tsubaki.js');
const Discord = require('discord.js');

const Command = require('../Command.js');

class Profile extends Command {
  constructor() {
    super('profile', 'Will show you the profile of the mentioned user.', ' <@mention>');
  }

  execute(message, args, bot, db) {
    let profileMention = message.mentions.users.first();
    
    if (profileMention == '' || profileMention === undefined) {
      return message.channel.sendTemp(Tsubaki.Style.unknownUser(), 10000);
    } else {
      let color = Tsubaki.color.gray;
      switch (profileMention.presence.status) {
        case 'online':
          color = Tsubaki.color.green;
          break;
        case 'offline':
          color = Tsubaki.color.red;
          break;
        case 'idle':
          color = Tsubaki.color.yellow;
          break;
      }

      let guildMember = message.guild.member(profileMention.id);
      let roleList = guildMember.roles.array();

      Tsubaki.getPoints(profileMention.id, function (points) {
        let profileEmbed = new Discord.RichEmbed()
          .setDescription(Tsubaki.Style.bold(Tsubaki.Style.underline(guildMember.displayName)))
          .addField('Full Username', profileMention.tag, true)
          .addField('ID', profileMention.id, true)
          .addField('Banana', 'Level ' + Tsubaki.getLevelR(points) + ', with ' + points + ' Bananas', true)
          .addField('Roles', roleList.join(' '), true)
          .setThumbnail(profileMention.displayAvatarURL)
          .setFooter('Member since ' + Profile.formatDate(guildMember.joinedAt) + ', Discorder since ' + Profile.formatDate(profileMention.createdAt))
          .setColor(color);
        message.channel.sendTemp({ embed: profileEmbed }, 20000);
      });
    }
  }

  static formatDate(date) {
    const monthNames = [
      'Jan', 'Feb', 'Mar',
      'Apr', 'May', 'Jun', 'Jul',
      'Aug', 'Sep', 'Oct',
      'Nov', 'Dec'
    ];

    return date.getDate() + ' ' + monthNames[date.getMonth()] + ' ' + date.getFullYear();
  }
}

module.exports = Profile;