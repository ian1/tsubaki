const Tsubaki = require("../../Tsubaki.js");
const Discord = require("discord.js");

let _super = require("../Command.js").prototype;
let method = Coin.prototype = Object.create(_super);

method.constructor = Coin;

function Coin() {
  _super.constructor.apply(this, ["coin", Tsubaki.name + " will flip a coin for you.", ""]);
}

method.execute = function (message, args, bot) {
  this.delete(message);
  let coins = [
    'Heads',
    'Tails',
  ]
  message.channel.send(":fingers_crossed: You flipped a coin and it landed on...  " + Tsubaki.Style.bold(coins[Math.floor(Math.random() * coins.length)] + "!"));
}

module.exports = Coin;