const Tsubaki = require("../../Tsubaki.js");
const Discord = require("discord.js");

let _super = require("../Command.js").prototype;
let method = Info.prototype = Object.create(_super);

method.constructor = Info;

function Info() {
  _super.constructor.apply(this, ["info", "Shows " + Tsubaki.name + "'s information.", ""]);
}

method.execute = function (message, args, bot, points) {
  this.delete(message);
  let embed = new Discord.RichEmbed()
    .setDescription(Tsubaki.Style.bold("Information About " + Tsubaki.name) + "\n\n     "
      + Tsubaki.name + " is a " + Tsubaki.Style.bold("Discord.js") + " bot. She can be used for moderation, "
      + "administration, utility, and just for fun. She has a wide range of commands everyone will enjoy, "
      + "and she is constantly being updated and added to." + "\n"
      + Tsubaki.name + " was created by Khux and PantherMan594.")
    .setColor(Tsubaki.color.white)
  message.channel.send({ embed: embed });
}

module.exports = Info;