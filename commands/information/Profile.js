const Tsubaki = require('../../Tsubaki.js');
const Discord = require('discord.js');

const Command = require('../Command.js');

/** The profile command */
class Profile extends Command {
  /** Create the command */
  constructor() {
    super(
      'profile', 'Will show your profile or the mentioned profile.'
      , ' [@mention]'
    );
  }

  /**
   * @param {Discord.Message} message The sent command
   * @param {string[]} args The arguments in the command
   * @param {Discord.Client} bot The instance of the discord client
   * @param {sqlite.Database} db The instance of the database
   */
  execute(message, args, bot, db) {
    let profileMention = message.mentions.users.first();
    if (profileMention == '' || profileMention === undefined) {
      profileMention = mmessage.author;
    }

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

    Tsubaki.getPoints(profileMention.id, (points) => {
      let profileEmbed = new Discord.RichEmbed()
        .setDescription(`**__${guildMember.displayName}__**`)
        .addField('Full Username', profileMention.tag, true)
        .addField('ID', profileMention.id, true)
        .addField(
          'Banana'
          , `Level ${Tsubaki.getLevelR(points)}, with ${points} Bananas`
          , true
        )
        .addField('Roles', roleList.join(' '), true)
        .setThumbnail(profileMention.displayAvatarURL)
        .setFooter(`Member since ${Profile.formatDate(guildMember.joinedAt)}`
          + `, Discorder since ${Profile.formatDate(profileMention.createdAt)}`)
        .setColor(color);
      message.channel.sendTemp({embed: profileEmbed}, 20000);
    });
  }

  /**
   * Formats the provided date
   * @param {Date} date The date object
   * @return {string} The formated date
   */
  static formatDate(date) {
    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
    ];

    return `${date.getDate()} ${monthNames[date.getMonth()]}`
      + ` ${date.getFullYear()}`;
  }
}

module.exports = Profile;
