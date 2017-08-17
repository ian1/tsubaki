const Tsubaki = require("../../Tsubaki.js");
const Discord = require("discord.js");

let _super = require("../Command.js").prototype;
let method = EightBall.prototype = Object.create(_super);

method.constructor = EightBall;

function EightBall() {
  _super.constructor.apply(this, ["8ball", "Will answer your burning (yes or no) questions.", " <question>"]);
}

method.execute = function (message, args, bot) {
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
    "Better not tell you now!",
    "Cannot predict now.",
    "Concentrate and ask again!",
    "Don't count on it!",
    "My reply is no.",
    "My sources say no.",
    "Outlook not so good.",
    "Very doubful."
  ]
  let thinking = [
    "I'm thinking...",
    "Hmm this is a tough question...",
    "Huh. I'm not sure I know this one. Let me think...",
    "I'm not sure about this one...",
    "Oh, this one's easy!"
  ]
  if (question == '' || question === undefined) return message.channel.send({ embed: Tsubaki.Style.warn(":eye_in_speech_bubble: _Give me a question!_") });
  else {
    message.channel.send(":thinking: " + Tsubaki.Style.italicize(thinking[Math.floor(Math.random() * thinking.length)]));

    // Wait for 2 seconds before sending response.
    setTimeout(function () {
      message.channel.send(Tsubaki.Style.bold(balls[Math.floor(Math.random() * balls.length)]));
    }, 2000);  
  }
}

module.exports = EightBall;