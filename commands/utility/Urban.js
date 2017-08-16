const Tsubaki = require("../../Tsubaki.js");
const Discord = require("discord.js");
const webdict = require("webdict");

let _super = require("../Command.js").prototype;
let method = Urban.prototype = Object.create(_super);

method.constructor = Urban;

function Urban() {
  _super.constructor.apply(this, ["urban", "Will define any word using urban dictionary.", " <word>"]);
}

method.execute = function (message, args, bot, points) {
  this.delete(message);
  this.delete(message);
  let toDefine = message.content.split(' ')[1];
  if (toDefine == "" || toDefine === undefined) return message.channel.send({ embed: Tsubaki.Style.error("Provide a word to urban define! :book:") });
  else {
    webdict("urbandictionary", toDefine).then(resp => {
      let result = resp.definition[0];
      if (result == "" || result === undefined) {
        message.channel.send({ embed: Tsubaki.Style.error("Hmm... I can't find that word. Try another one!") });
      } else {
        let embed = new Discord.RichEmbed()
          .setDescription(Tsubaki.Style.bold("Word:") + " " + Tsubaki.Style.code(toDefine) + "\n" + Tsubaki.Style.bold("Urban Definition:") + " " + Tsubaki.Style.code(result))
          .setColor(Tsubaki.color.green)
          .setFooter(Tsubaki.name + " Dictionary");
        message.channel.send({ embed: embed });
      }
    }).catch(err => {
      console.log(err.message);
      message.channel.send({ embed: Tsubaki.Style.errorGeneric() });
    });
  }
}

module.exports = Urban;