const Tsubaki = require("../../Tsubaki.js");
const Discord = require("discord.js");

let _super = require("../Command.js").prototype;
let method = Support.prototype = Object.create(_super);

method.constructor = Support;

function Support() {
  _super.constructor.apply(this, ["support", Tsubaki.name + " will private message you the support server link.", ""]);
}

method.execute = function (message, args, bot, db) {
  let embed = new Discord.RichEmbed()
    .setDescription(Tsubaki.Style.codeBlock("Have Questions or need help?", "js") + "\n\n" + this.getInformation())
    .addField(Tsubaki.Style.bold(Tsubaki.name + "'s Help Server"), Tsubaki.Style.url("Click Here to join",
      "https://discord.gg/Gf7hb33"))
    .setColor(Tsubaki.color.green);
  message.author.send({ embed: embed });
}

module.exports = Support;