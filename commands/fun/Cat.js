const Tsubaki = require("../../Tsubaki.js");
const Discord = require("discord.js");
const random = require("random-animal");

let _super = require("../Command.js").prototype;
let method = Cat.prototype = Object.create(_super);

method.constructor = Cat;

function Cat() {
  _super.constructor.apply(this, ["cat", "Will give a random picture of a cat.", ""]);
}

method.execute = function (message, args, bot, points) {
  this.delete(message);
  random.cat().then(url => message.channel.send(url)).catch(err => {
    console.log(err.message);
    message.channel.send({ embed: Tsubaki.Style.errorGeneric() });
  });
}

module.exports = Cat;