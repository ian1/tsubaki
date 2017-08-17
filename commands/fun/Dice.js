const Tsubaki = require("../../Tsubaki.js");
const Discord = require("discord.js");

let _super = require("../Command.js").prototype;
let method = Dice.prototype = Object.create(_super);

method.constructor = Dice;

function Dice() {
  _super.constructor.apply(this, ["dice", Tsubaki.name + " will roll the dice and give you a random number.", ""]);
}

method.execute = function (message, args, bot, db) {
  message.channel.send(":game_die: You rolled a " + (Math.ceil(Math.random() * 6)));
}

module.exports = Dice;