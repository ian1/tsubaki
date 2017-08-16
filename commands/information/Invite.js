const Tsubaki = require("../../Tsubaki.js");

var _super = require("../Command.js").prototype;
var method = Help.prototype = Object.create(_super);

method.constructor = Help;

function Invite() {
  _super.constructor.apply(this, "invite", Tsubaki.config.name + " will private message you information about her, including her invite link.", "");
}

method.execute = function (message) {
  _super.delete();
  var embed = new Discord.RichEmbed()
    .setDescription(Tsubaki.Style.codeBlock("Invite " + Tsubaki.config.name + " to your server!", "css") + "\n\n"
      + Tsubaki.Style.bold(Tsubaki.config.name + " Information:") + "\n"
      + Tsubaki.config.name + " is a Discord.js bot that you can have fun with _and_ moderate with. In your server do " + Tsubaki.Style.code(t - help) + " and a list of all my command will pop up.")
    .addField(config.name + "'s Help Server" + Tsubaki.Style.url("Click Here to join", "https://discord.gg/Gf7hb33")
    .addField(config.name + "'s Invitation Link", Tsubaki.Style.url("Click Here to invite", "https://discordapp.com/oauth2/authorize?client_id=334386617626263553&scope=bot&permissions=305196094", true)
    .setColor(Tsubaki.green);
  message.author.sendEmbed(embed);
}

module.exports = Avatar;