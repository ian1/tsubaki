const Tsubaki = require('../../Tsubaki.js');
const Discord = require('discord.js');
const OwnerCommand = require('./OwnerCommand.js');

/** The guilds command */
class Guilds extends OwnerCommand {
  /** Create the command */
  constructor() {
    super('guilds', `Print a list of the guilds using ${Tsubaki.name}.`);
  }

  /**
   * @param {Discord.Message} message The sent command
   * @param {string[]} args The arguments in the command
   * @param {Discord.Client} bot The instance of the discord client
   * @param {sqlite.Database} db The instance of the database
   */
  executeOwner(message, args, bot, db) {
    let cutOff = 1950; // Allow a 50 char buffer

    let listAll = [];
    bot.guilds.array().forEach((item) => {
      listAll.push(item + ' (' + item.id + ')');
    });

    let guilds = listAll.join('\n');
    let guildsList = [];

    /**
     * Do-while loop: runs the 'do' once, then repeats more until the while
     * statement is false. This ensures that guildsList has at least one item,
     * if guilds is shorter than the cut off.
     */
    do {
      // Splits the list at the cut off
      let guildsTail = guilds.substring(cutOff);

      // Finds the first instance of '\n' (guilds separator) after cut off
      let loc = guildsTail.indexOf('\n');

      // Add the guilds from the start (0) to the first '\n' after cut off
      guildsList.push(guilds.substring(0, cutOff + loc));

      // Set guilds to the guilds after the first '\n' after cut off
      guilds = guilds.substring(cutOff + loc + 2);
    } while (guilds.length > cutOff); // Repeat until length is within th cutoff

    for (let i = 0; i < guildsList.length; i++) {
      let title = 'Guilds';
      if (guildsList.length > 1) {
        title += ' (' + (i + 1) + '/' + guildsList.length + ')';
      }

      let embed = new Discord.RichEmbed()
        .setTitle(title)
        .setDescription(guildsList[i])
        .setColor(Tsubaki.color.green);
      message.channel.sendTemp({embed: embed}, 60000);
    }
  }
}

module.exports = Guilds;
