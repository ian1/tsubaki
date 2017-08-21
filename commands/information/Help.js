const Tsubaki = require('../../Tsubaki.js');
const Discord = require('discord.js');
const Command = require('../Command.js');

/** The help command */
class Help extends Command {
  /** Create the command */
  constructor() {
    super('help', 'Displays the command list.', ' [command]');
  }

  /**
   * @param {Discord.Message} message The sent command
   * @param {string[]} args The arguments in the command
   * @param {Discord.Client} bot The instance of the discord client
   * @param {sqlite.Database} db The instance of the database
   */
  execute(message, args, bot, db) {
    let cmds = Tsubaki.commands();

    if (args.length == 0) {
      let description = '**Tsubaki Command List**'
        + `\n\n Do \`${this.getUsage}\` and replace \`[command]\``
        + ' with any command you want to learn more about. \n';

      for (let i = 0, lenI = cmds.length; i < lenI; i++) {
        if (cmds[i][0].startsWith('_')) continue;
        description += `\n **${cmds[i][0]}:**`;

        for (let j = 1, lenJ = cmds[i].length; j < lenJ; j++) {
          let cmd = cmds[i][j];
          description += `[${cmd.getCommand()}](${
            Tsubaki.createTokenCmd(() => {
              message.channel.sendTemp({embed: this.helpEmbed(cmd)}, 20000);
            })
          })` + ' ';
        }
      }

      let embed = new Discord.RichEmbed()
        .setDescription(description)
        .setColor(Tsubaki.color.green);
      message.channel.sendTemp({embed: embed}, 60000);

      description = '';

      for (let i = 0, lenI = cmds.length; i < lenI; i++) {
        if (!cmds[i][0].startsWith('_')
          || !message.member.hasPermission(Tsubaki.adminPermission)) {
          continue;
        }

        if (!cmds[i][0].startsWith('__') || (message.member.id === Tsubaki.ianId
          || message.member.id === Tsubaki.davidId)) {
          description += `\n **${cmds[i][0]}**: `;

          for (let j = 1, lenJ = cmds[i].length; j < lenJ; j++) {
            let cmd = cmds[i][j];
            description += `[${cmd.getCommand()}](${
              Tsubaki.createTokenCmd(() => {
                message.channel.sendTemp({embed: this.helpEmbed(cmd)}, 20000);
              })
            })` + ' ';
          }
        }
      }

      embed = new Discord.RichEmbed()
        .setDescription(description)
        .setColor(Tsubaki.color.green);
      message.channel.sendTemp({embed: embed}, 20000);
    } else {
      for (let i = 0, lenI = cmds.length; i < lenI; i++) {
        for (let j = 1, lenJ = cmds[i].length; j < lenJ; j++) {
          if (args[0] === cmds[i][j].getCommand()) {
            if ((
                !cmds[i][0].startsWith('_')
                || message.member.hasPermission(Tsubaki.adminPermission
              )) && (
                !cmds[i][0].startsWith('__')
                || message.member.id === Tsubaki.ianId
                || message.member.id === Tsubaki.davidId
              )) {
              message.channel.sendTemp({embed: helpEmbed(cmds[i][j])}, 20000);
            } else {
              message.channel.sendTemp(Tsubaki.Style.notFound(), 10000);
            }
            return;
          }
        }
      }
      message.channel.sendTemp(Tsubaki.Style.notFound(), 10000);
    }
  }

  /**
   * Get the help info for a command
   * @param {Command} cmd The command
   * @return {Discord.RichEmbed} The help info in an embed
   */
  helpEmbed(cmd) {
    let helpEmbed = new Discord.RichEmbed()
      .setDescription(/* Style.bold*/('Command: ') + cmd.getCommand() + '\n'
      + /* Style.bold*/('Description: ') + cmd.getDescription() + '\n'
      + /* Style.bold*/('Category: ') + cmds[i][0] + '\n\n'
      + /* Style.bold*/('Usage: ') + cmd.getUsage())
      .setColor(Tsubaki.color.green);
    return helpEmbed;
  }
}

module.exports = Help;
