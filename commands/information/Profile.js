const Tsubaki = require("../../Tsubaki.js");
const Discord = require("discord.js");

let _super = require("../Command.js").prototype;
let method = Profile.prototype = Object.create(_super);

method.constructor = Profile;

function Profile() {
  _super.constructor.apply(this, ["profile", "Will show you the profile of the mentioned user.", " <@mention>"]);
}

method.execute = function (message, args, bot) {
  this.delete(message);
  let profileMention = message.mentions.users.first();
  
  if (profileMention == "" || profileMention === undefined) {
    return message.channel.send({ embed: Tsubaki.Style.unknownUser });
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
    let userData = points[profileMention.id];
    let profileEmbed = new Discord.RichEmbed()
      .setTitle("Profile of " + profileMention + "#" + profileMention.discriminator)
      .addField("Id", profileMention.id)
      .addField("Tag", profileMention.tag)
      .addField("Banana", "Level " + userData.level + ", with " + userData.points + " Bananas")
      .setImage(profileMention.displayAvatarURL)
      .setColor(color);
    message.channel.send({ embed: profileEmbed });
  }
}

module.exports = Profile;