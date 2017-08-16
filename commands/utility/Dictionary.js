const Tsubaki = require("../../Tsubaki.js");
const Discord = require("discord.js");
const webdict = require("webdict");

let _super = require("../Command.js").prototype;
let method = Dictionary.prototype = Object.create(_super);

method.constructor = Dictionary;

function Dictionary() {
  _super.constructor.apply(this, ["dictionary", "Will define any word using a traditional dictionary.", " <word>"]);
}

method.execute = function (message, args, bot, points) {
  this.delete(message);
  this.delete(message);
  let toDefine = message.content.split(' ')[1];
  if (toDefine == "" || toDefine === undefined) return message.channel.send(":book:  Provide a word to urban define!");
  else {
    webdict("dictionary", toDefine).then(resp => {
      let result = resp.definition[0];
      if (result == "" || result === undefined) {
        message.channel.send({ embed: Tsubaki.Style.error("Hmm... I can't find that word. Try another one!") });
      } else {
        let embed = new Discord.RichEmbed()
          .setDescription(Tsubaki.Style.bold("Word:") + " " + Tsubaki.Style.code(toDefine) + "\n" + Tsubaki.Style.bold("Definition:") + " " + Tsubaki.Style.code(result))
          .setColor(Tsubaki.color.green)
          .setFooter(Tsubaki.name + "Dictionary");
        message.channel.send({ embed: embed });
      }  
    });
  }
}

module.exports = Dictionary;