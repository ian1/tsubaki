const Tsubaki = require("../../Tsubaki.js");
const Discord = require("discord.js");

let _super = require("../Command.js").prototype;
let method = Profile.prototype = Object.create(_super);

method.constructor = Profile;

function Profile() {
  _super.constructor.apply(this, ["profile", "Will show you the profile of the mentioned user.", " <@mention>"]);
}

method.execute = function (message, args, bot, db) {
  let profileMention = message.mentions.users.first();
  
  if (profileMention == "" || profileMention === undefined) {
    return message.channel.send({ embed: Tsubaki.Style.unknownUser() });
  } else {
    let color = Tsubaki.color.gray;
    switch (profileMention.presence.status) {
      case "online":
        color = Tsubaki.color.green;
        break;
      case "offline":
        color = Tsubaki.color.red;
        break;
      case "idle":
        color = Tsubaki.color.yellow;
        break;
    }

    let guildMember = message.guild.member(profileMention.id);
    let roleList = guildMember.roles.array();

    Tsubaki.getPoints(profileMention.id, function (points) {
      let profileEmbed = new Discord.RichEmbed()
        .setDescription(Tsubaki.Style.bold(Tsubaki.Style.underline(guildMember.displayName)))
        .addField("Full Username", profileMention.tag, true)
        .addField("ID", profileMention.id, true)
        .addField("Banana", "Level " + Tsubaki.getLevelR(points) + ", with " + points + " Bananas", true)
        .addField('Roles', roleList.join(' '), true)
        .setThumbnail(profileMention.displayAvatarURL)
        .setFooter('Member since ' + formatDate(guildMember.joinedAt) + ', Discorder since ' + formatDate(profileMention.createdAt))
        .setColor(color);
      message.channel.send({ embed: profileEmbed });
    });  
  }
}

function formatDate(date) {
  const monthNames = [
    "Jan", "Feb", "Mar",
    "Apr", "May", "Jun", "Jul",
    "Aug", "Sep", "Oct",
    "Nov", "Dec"
  ];

  return date.getDate() + ' ' + monthNames[date.getMonth()] + ' ' + date.getFullYear();
}

module.exports = Profile;