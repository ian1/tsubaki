const Tsubaki = require("../../Tsubaki.js");
const Discord = require("discord.js");

let _super = require("../Command.js").prototype;
let method = Invite.prototype = Object.create(_super);

method.constructor = Invite;

function Invite() {
  _super.constructor.apply(this, ["invite", Tsubaki.name + " will private message you information about her, including her invite link.", ""]);
}

method.execute = function (message, args, bot) {
  this.delete(message);
  let embed = new Discord.RichEmbed()
    .setDescription(Tsubaki.Style.codeBlock("Invite " + Tsubaki.name + " to your server!", "css") + "\n\n" + this.getInformation())
    .addField(config.name + "'s Help Server",
      Tsubaki.Style.url("Click Here to join", "https://discord.gg/Gf7hb33"))
    .addField(config.name + "'s Invitation Link",
      Tsubaki.Style.url("Click Here to invite", "https://discordapp.com/oauth2/authorize?"
      + "client_id=334386617626263553&scope=bot&permissions=305196094"))
    .setColor(Tsubaki.color.green);
  message.author.sendEmbed(embed);
}

module.exports = Invite;