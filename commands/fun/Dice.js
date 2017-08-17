const Tsubaki = require("../../Tsubaki.js");
const Discord = require("discord.js");

let _super = require("../Command.js").prototype;
let method = Dice.prototype = Object.create(_super);

method.constructor = Dice;

function Dice() {
  _super.constructor.apply(this, ["dice", Tsubaki.name + " will roll the dice and give you a random number.", ""]);
}

method.execute = function (message, args, bot) {
  this.delete(message);
  let numbers = [
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
  ]
  message.channel.send(":game_die: You rolled a " + (numbers[Math.floor(Math.random() * numbers.length)]));
}

module.exports = Dice;