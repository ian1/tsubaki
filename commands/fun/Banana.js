const Tsubaki = require("../../Tsubaki.js");
const Discord = require("discord.js");

let _super = require("../Command.js").prototype;
let method = Banana.prototype = Object.create(_super);

method.constructor = Banana;

function Banana() {
  _super.constructor.apply(this, ["banana", "Will give the mentioned member a banana.", " <@mention>"]);
}

method.execute = function (message, args, bot, points) {
  this.delete(message);
  let memberMention = message.mentions.users.first();
  if (memberMention == message.author) return message.channel.send(":x: Don't be greedy, sweetie~ :kissing_heart:");

  if (memberMention == '' || memberMention === undefined) return message.channel.send("Mention a player to give a banana!");
  else {
    message.channel.send(":banana: " + message.author.tag + " has given " + memberMention + " a banana!");
    points[memberMention.id].points++
  }
}

module.exports = Banana;