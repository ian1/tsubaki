const Tsubaki = require('../../Tsubaki.js');
const Discord = require('discord.js');

const Command = require('../Command.js');

class Banana extends Command {
  constructor() {
    super('banana', 'Will give the mentioned member a banana.', ' <@mention>');
  }

  execute(message, args, bot, db) {
    let memberMention = message.mentions.users.first();
    if (memberMention == message.author) return message.channel.sendTemp(Tsubaki.Style.embed(':x: Don\'t be greedy, sweetie~ :kissing_heart:'), 10000);

    if (memberMention == '' || memberMention === undefined) return message.channel.sendTemp(Tsubaki.Style.unknownUser(), 10000);
    else {
      message.channel.sendTemp(':banana: ' + message.author.tag + ' has given ' + memberMention + ' a banana!', 20000);
      Tsubaki.getPoints(memberMention.id, function (points) {
        Tsubaki.setPoints(memberMention.id, points + 1, message.channel);
      });
    }
  }
}

module.exports = Banana;
