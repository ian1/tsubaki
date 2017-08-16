const Tsubaki = require("../../Tsubaki.js");
const Discord = require("discord.js");

let _super = require("../Command.js").prototype;
let method = Add.prototype = Object.create(_super);

method.constructor = Add;

function Add() {
  _super.constructor.apply(this, ["add", "Will add the numbers given.", " <number 1> <num2> [num3] [num4]..."]);
}

method.execute = function (message, args, bot, points) {
  this.delete(message);
  if (args.length < 2) {
    return message.channel.send({ embed: Tsubaki.Style.error("Hey, you must provide the numbers first!") });
  }
  let numArray = args.map(n => parseInt(n));
  let total = numArray.reduce((p, c) => p + c);

  message.channel.send(total);
}

module.exports = Add;