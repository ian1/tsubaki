const Tsubaki = require("../../Tsubaki.js");
const Discord = require("discord.js");

let _super = require("../Command.js").prototype;
let method = Stats.prototype = Object.create(_super);

method.constructor = Stats;

function Stats() {
  _super.constructor.apply(this, ["stats", "Will show guilds, users, and channels " + Tsubaki.name + " is in.", ""]);
}

method.execute = function (message, args, bot) {
  this.delete(message);
  let embed = new Discord.RichEmbed()
    .setDescription(Tsubaki.Style.bold(Tsubaki.name) + " Guild Stats:")
    .addField("Guilds", bot.guilds.size)
    .addField("Users", bot.users.size)
    .addField("Channels", bot.channels.size)
    .setColor(Tsubaki.color.green)
    .setFooter(Tsubaki.name + " Stats");
  message.channel.send({ embed: embed });
}

module.exports = Stats;