const Tsubaki = require('../../Tsubaki.js');
const Discord = require('discord.js');
const webdict = require('webdict');

const Command = require('../Command.js');

class Urban extends Command {
  constructor() {
    super('urban', 'Will define any word using urban dictionary.', ' <word>');
  }

  execute(message, args, bot, db) {
    let toDefine = message.content.split(' ')[1];
    if (toDefine == '' || toDefine === undefined) return message.channel.send(Tsubaki.Style.warn('Provide a word to urban define! :book:'));
    else {
      webdict('urbandictionary', toDefine).then(resp => {
        let result = resp.definition[0];

        let embed = new Discord.RichEmbed()
          .setDescription(Tsubaki.Style.bold('Word:') + ' ' + Tsubaki.Style.code(toDefine) + '\n' + Tsubaki.Style.bold('Urban Definition:') + ' ' + Tsubaki.Style.code(result))
          .setColor(Tsubaki.color.green)
          .setFooter(Tsubaki.name + ' Dictionary');
        message.channel.send({ embed: embed });
      }).catch(function () {
        message.channel.send(Tsubaki.Style.error('Hmm... I can\'t find that word. Please check your spelling!'));
      });
    }
  }
}

module.exports = Urban;