const Tsubaki = require("../../Tsubaki.js");
const Discord = require("discord.js");

var _super = require("../Command.js").prototype;
var method = Avatar.prototype = Object.create(_super);

method.constructor = Avatar;

function Avatar() {
  _super.constructor.apply(this, ["avatar", "Will show you the profile picture of the mentioned user.", " <@mention>"]);
}

method.execute = function (message) {
  _super.delete(message);

  let profileMention = message.mentions.users.first();
  if (profileMention == "" || profileMention === undefined) return message.channel.send("Mention the person that you want the profile from!");
  else {
    let profileEmbedAuthor = message.mentions.users.first().username
    var profileEmbed = new Discord.RichEmbed()
      .setDescription("Profile of " + profileMention)
      .setImage(profileMention.avatarURL)
      .setColor(Tsubaki.green)
    message.channel.send({ embed: profileEmbed });
  }
}

module.exports = Avatar;