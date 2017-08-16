const Tsubaki = require("../../Tsubaki.js");
const Discord = require("discord.js");

let _super = require("../Command.js").prototype;
let method = Avatar.prototype = Object.create(_super);

method.constructor = Avatar;

function Avatar() {
  _super.constructor.apply(this, ["avatar", "Will show you the profile picture of the mentioned user.",
    " <@mention>"]);
}

method.execute = function (message, args, bot, points) {
  this.delete(message);
  let profileMention = message.mentions.users.first();
  
  if (profileMention == "" || profileMention === undefined) {
    return message.channel.send({
      embed: Tsubaki.Style.warn(":thinking: Sorry... I don't know who that is. "
        + "Please try again, make sure you used @ to mention the player!")
    });
  } else {
    let profileEmbedAuthor = profileMention.username
    let profileEmbed = new Discord.RichEmbed()
      .setDescription("Profile of " + profileMention)
      .setImage(profileMention.avatarURL)
      .setColor(Tsubaki.color.green);
    message.channel.send({ embed: profileEmbed });
  }
}

module.exports = Avatar;