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
      let description = `**${Tsubaki.name} Command List**`
        + `\n\nDo \`${this.getUsage()}\` and replace \`[command]\``
        + ' with any command you want to learn more about. \n';

      for (let i = 0, lenI = cmds.length; i < lenI; i++) {
        if (cmds[i][0].startsWith('_')) continue;
        description += `\n**${cmds[i][0]}:** `;

        for (let j = 1, lenJ = cmds[i].length; j < lenJ; j++) {
          let cmd = cmds[i][j];
          description += `[${cmd.getCommand()}](${
            Tsubaki.createTokenCmd(() => {
              message.channel.sendType({embed: this.helpEmbed(cmd, cmds[i][0])} );
            })
          })` + ' ';
        }
      }

      let embed = new Discord.RichEmbed()
        .setDescription(description)
        .setColor(Tsubaki.color.green);
      message.channel.sendType({embed: embed} );

      description = '';

      for (let i = 0, lenI = cmds.length; i < lenI; i++) {
        if (!cmds[i][0].startsWith('_')
          || !message.member.hasPermission(Tsubaki.adminPermission)) {
          continue;
        }

        if (!cmds[i][0].startsWith('__') || (message.member.id === Tsubaki.ianId
          || message.member.id === Tsubaki.davidId)) {
          description += `\n**${cmds[i][0]}**: `;

          for (let j = 1, lenJ = cmds[i].length; j < lenJ; j++) {
            let cmd = cmds[i][j];
            description += `[${cmd.getCommand()}](${
              Tsubaki.createTokenCmd(() => {
                message.channel.sendType({embed: this.helpEmbed(cmd, cmds[i][0])} );
              })
            })` + ' ';
          }
        }
      }

      embed = new Discord.RichEmbed()
        .setDescription(description)
        .setColor(Tsubaki.color.green);
      message.channel.sendType({embed: embed} );
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
              message.channel.sendType(
                {embed: this.helpEmbed(cmds[i][j], cmds[i][0])}
                , );
            } else {
              message.channel.sendType(Tsubaki.Style.notFound(), );
            }
            return;
          }
        }
      }
      message.channel.sendType(Tsubaki.Style.notFound(), );
    }
  }

  /**
   * Get the help info for a command
   * @param {Command} cmd The command
   * @param {string} category The command's category
   * @return {Discord.RichEmbed} The help info in an embed
   */
  helpEmbed(cmd, category) {
    let helpEmbed = new Discord.RichEmbed()
      .setDescription(`**Command:** ${cmd.getCommand()}`
      + `\n**Description:** ${cmd.getDescription()}`
      + `\n**Category:** ${category}`
      + `\n\n**Usage:** \`${cmd.getUsage()}\``)
      .setColor(Tsubaki.color.green);
    return helpEmbed;
  }
}

module.exports = Help;
