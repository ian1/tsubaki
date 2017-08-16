const Tsubaki = require("../../Tsubaki.js");
const Discord = require("discord.js");
const random = require("random-animal");

let _super = require("../Command.js").prototype;
let method = Dog.prototype = Object.create(_super);

method.constructor = Dog;

function Dog() {
  _super.constructor.apply(this, ["dog", "Will give a random picture of a dog.", ""]);
}

method.execute = function (message, args, bot, points) {
  this.delete(message);
  random.dog().then(url => message.channel.send(url)).catch(err => console.log(err.message));
}

module.exports = Dog;