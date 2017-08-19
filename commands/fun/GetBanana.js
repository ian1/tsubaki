const Tsubaki = require('../../Tsubaki.js');
const Discord = require('discord.js');

const Command = require('../Command.js');

class GetBanana extends Command {
  constructor() {
    super('getbanana', 'Will give you a banana, and list your current points.', '');
  }

  execute(message, args, bot, db) {
    Tsubaki.getPoints(message.author.id, function (points) {
      message.reply(':banana: ' + Tsubaki.Style.italicize('You are currently Banana level')
        + ' ' + Tsubaki.Style.code(Tsubaki.getLevelR(points)) + Tsubaki.Style.italicize(', with')
        + ' ' + Tsubaki.Style.code(points) + ' Bananas!');
    });
  }
}

module.exports = GetBanana;