const Tsubaki = require("../../Tsubaki.js");
const Discord = require("discord.js");

let _super = require("../Command.js").prototype;
let method = ChangeLog.prototype = Object.create(_super);

method.constructor = ChangeLog;

function ChangeLog() {
  _super.constructor.apply(this, ["changelog", "Will show " + Tsubaki.name + "'s change log.", ""]);
}

method.execute = function (message, args) {
  this.delete(message);
  let embed = new Discord.RichEmbed()
    .setDescription("not done ;)")
    .setColor(Tsubaki.color.white)
  message.channel.send({ embed: embed });
}

module.exports = ChangeLog;