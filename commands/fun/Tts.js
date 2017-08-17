const Tsubaki = require("../../Tsubaki.js");
const Discord = require("discord.js");

let _super = require("../Command.js").prototype;
let method = Tts.prototype = Object.create(_super);

method.constructor = Tts;

function Tts() {
  _super.constructor.apply(this, ["tts", "Will say given message out loud.", " <message>"]);
}

method.execute = function (message, args, bot) {
  this.delete(message);
  message.channel.send(args.join(" "), { tts: true });
}

module.exports = Tts;