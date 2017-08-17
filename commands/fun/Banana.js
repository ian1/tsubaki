const Tsubaki = require("../../Tsubaki.js");
const Discord = require("discord.js");

let _super = require("../Command.js").prototype;
let method = Banana.prototype = Object.create(_super);

method.constructor = Banana;

function Banana() {
  _super.constructor.apply(this, ["banana", "Will give the mentioned member a banana.", " <@mention>"]);
}

method.execute = function (message, args, bot, db) {
  let memberMention = message.mentions.users.first();
  if (memberMention == message.author) return message.channel.send(":x: Don't be greedy, sweetie~ :kissing_heart:");

  if (memberMention == '' || memberMention === undefined) return message.channel.send({ embed: Tsubaki.Style.unknownUser() });
  else {
    message.channel.send(":banana: " + message.author.tag + " has given " + memberMention + " a banana!");
    Tsubaki.getPoints(memberMention.id, function (points) {
      Tsubaki.setPoints(memberMention.id, points + 1, message.channel);
    })
  }
}

module.exports = Banana;