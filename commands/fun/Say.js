const Tsubaki = require("../../Tsubaki.js");
const Discord = require("discord.js");

let _super = require("../Command.js").prototype;
let method = Say.prototype = Object.create(_super);

method.constructor = Say;

function Say() {
  _super.constructor.apply(this, ["say", Tsubaki.name + " will say any message given.", " <message>"]);
}

method.execute = function (message, args, bot, db) {
  if (args.length == 0) {
    message.channel.send({ embed: Tsubaki.Style.warn("Please tell me what to say!") });
  } else {
    message.channel.send(args.join(" "), { tts: false });
  }  
}

module.exports = Say;