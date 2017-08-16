const Tsubaki = require("../../Tsubaki.js");
const Discord = require("discord.js");

let _super = require("../Command.js").prototype;
let method = EightBall.prototype = Object.create(_super);

method.constructor = EightBall;

function EightBall() {
  _super.constructor.apply(this, ["8ball", "Will answer your burning (yes or no) questions.", " <question>"]);
}

method.execute = function (message, args, bot, points) {
  let question = message.content.split(' ')[1];
  let balls = [
    "It is certain!",
    "It is decidedly so!",
    "Without a doubt!",
    "Yes, definitely!",
    "As I see it, yes.",
    "You may rely on it.",
    "Most likely.",
    "Outlook good!",
    "Yes.",
    "Signs point to yes.",
    "Reply hazy, try again.",
    "Ask again later.",
    "Better now tell you now!",
    "Cannot predict now.",
    "Concentrate and ask again!",
    "Don't count on it!",
    "My reply is no.",
    "My sources say no.",
    "Outlook not so good.",
    "Very doubful."
  ]
  if (question == '' || question === undefined) return message.channel.send(":eye_in_speech_bubble: | _Give me a question!_");
  else {
    message.channel.send(Tsubaki.Style.bold(balls[Math.floor(Math.random() * balls.length)]));
  }
}

module.exports = EightBall;