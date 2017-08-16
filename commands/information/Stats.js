const Tsubaki = require("../../Tsubaki.js");
const Discord = require("../../discord.js");

var _super = require("../Command.js").prototype;
var method = Stats.prototype = Object.create(_super);

method.constructor = Stats;

function Stats() {
  _super.constructor.apply(this, ["stats", "Will show guilds, users, and channels " + Tsubaki.name + " is in.", ""]);
}

method.execute = function (message) {
  _super.delete(message);
  var guildEmbed = new Discord.RichEmbed()
    .setDescription(Tsubaki.Style.bold(Tsubaki.name) + " Guild Stats:")
    .addField("Guilds", bot.guilds.size)
    .addField("Users", bot.users.size)
    .addField("Channels", bot.channels.size)
    .setColor(Tsubaki.green)
    .setFooter(Tsubaki.name + " Stats");
  message.channel.send({ embed: guildEmbed });
}

module.exports = Stats;