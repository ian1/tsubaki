const Tsubaki = require("../../Tsubaki.js");
const Discord = require("discord.js");

let _super = require("../Command.js").prototype;
let method = Embed.prototype = Object.create(_super);

method.constructor = Embed;

function Embed() {
  _super.constructor.apply(this, ["embed", "Will embed any message given.", " [color code] <message>"]);
}

method.execute = function (message, args, bot, db) {
  this.delete(message);
  let embed = new Discord.RichEmbed()
    .setDescription(args.join(" "))
    .setColor(Tsubaki.color.green);
  message.channel.send({ embed: embed });
}

module.exports = Embed;