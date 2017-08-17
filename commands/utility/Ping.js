const Tsubaki = require("../../Tsubaki.js");
const Discord = require("discord.js");

let _super = require("../Command.js").prototype;
let method = Ping.prototype = Object.create(_super);

method.constructor = Ping;

function Ping() {
  _super.constructor.apply(this, ["ping", "Returns " + Tsubaki.name + "'s ping (useful for testing connection).", ""]);
}

method.execute = function (message, args, bot) {
  this.delete(message);
  let ping = bot.ping;
  let color = Tsubaki.color.green;
  if (ping > 150) {
    color = Tsubaki.color.red;
  } else if (ping > 100) {
    color = Tsubaki.color.yellow;
  }

  let embed = new Discord.RichEmbed()
    .setDescription("Pong! " + Tsubaki.Style.code(Math.round(ping, -2) + " ms") + ".")
    .setColor(color);
  message.channel.send({ embed: embed });
}

module.exports = Ping;