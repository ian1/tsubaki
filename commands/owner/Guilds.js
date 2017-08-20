const Tsubaki = require('../../Tsubaki.js');
const Discord = require('discord.js');

const Command = require('../Command.js');

class Guilds extends Command {
  constructor() {
    super('guilds', 'Print a list of the guilds using ' + Tsubaki.name + '.', '');
  }

  executeAdmin(message, args, bot, db) {
    let cutOff = 1950; // Allow a 50 char buffer
    
    let listAll = [];
    bot.guilds.array().forEach(function (item) {
      listAll.push(item + ' (' + item.id + ')');
    });
    
    let guilds = listAll.join('\n');
    let guildsList = [];
    
    // Do-while loop: runs the 'do' once, then repeats more until the while statement is false.
    // This ensures that guildsList has at least one item, if guilds is shorter than the cut off.
    do {
      let guildsTail = guilds.substring(cutOff); // Splits the list at the cut off
      let loc = guildsTail.indexOf('\n'); // Finds the first instance of '\n' (separator between guilds) after cut off
      guildsList.push(guilds.substring(0, cutOff + loc)); // Add the guilds from the start (0) to the first '\n' after cut off
      guilds = guilds.substring(cutOff + loc + 2); // Set guilds to the guilds after the first '\n' after cut off
    } while (guilds.length > cutOff); // Repeat until length is within th cutoff

    for (let i = 0; i < guildsList.length; i++) {
      let title = 'Guilds';
      if (guildsList.length > 1) title += ' (' + (i + 1) + '/' + guildsList.length + ')';

      let embed = new Discord.RichEmbed()
        .setTitle(title)
        .setDescription(guildsList[i])
        .setColor(Tsubaki.color.green);
      message.channel.send({embed: embed});
    }
  }

  execute(message, args, bot, db) {
    if (message.member !== undefined && (message.member.id === Tsubaki.ianId || message.member.id === Tsubaki.davidId)) {
      this.executeAdmin(message, args, bot, db);
    } else {
      return message.channel.send(Tsubaki.Style.notFound());
    }
  }
}

module.exports = Guilds;