const Tsubaki = require('../../Tsubaki.js');
const Discord = require('discord.js');

const Command = require('../Command.js');

class Help extends Command {
  constructor() {
    super('help', 'Displays the command list.', ' [command]');
  }

  execute(message, args, bot, db) {
    let cmds = Tsubaki.commands();

    if (args.length == 0) {
      let title = Tsubaki.Style.bold('Tsubaki Command List') + '\n\n'
        + 'Do ' + Tsubaki.Style.bold(this.getUsage()) + ' and replace ' + Tsubaki.Style.bold('[command]')
        + ' with any command you want to learn more about.' + '\n';

      let embed = new Discord.RichEmbed()
        .setDescription(title)
        .setColor(Tsubaki.color.green);
      message.channel.sendTemp({ embed: embed }, 60000);
      
      for (let i = 0, lenI = cmds.length; i < lenI; i++) {
        if ((!cmds[i][0].startsWith('_') || message.member.hasPermission(Tsubaki.adminPermission))
          && (!cmds[i][0].startsWith('__') || message.member.id === Tsubaki.ianId || message.member.id === Tsubaki.davidId)) {
          let description = '\n' + Tsubaki.Style.bold(cmds[i][0] + ': ');

          for (let j = 1, lenJ = cmds[i].length; j < lenJ; j++) {
            let cmd = cmds[i][j];
            description += Tsubaki.Style.url(cmd.getCommand(), Tsubaki.createTokenCmd(() => {
              let helpEmbed = new Discord.RichEmbed()
                .setDescription(Tsubaki.Style.bold('Command: ') + cmd.getCommand() + '\n'
                + Tsubaki.Style.bold('Description: ') + cmd.getDescription() + '\n'
                + Tsubaki.Style.bold('Category: ') + cmds[i][0] + '\n\n'
                + Tsubaki.Style.bold('Usage: ') + cmd.getUsage())
                .setColor(Tsubaki.color.green);
              message.channel.sendTemp({ embed: helpEmbed }, 20000);
            })) + ' ';
          }

          let embed = new Discord.RichEmbed()
            .setDescription(description)
            .setColor(Tsubaki.color.green);
          message.channel.sendTemp({ embed: embed }, 60000);
        }  
      }
    } else {    
      for (let i = 0, lenI = cmds.length; i < lenI; i++) {
        for (let j = 1, lenJ = cmds[i].length; j < lenJ; j++) {
          if (args[0] === cmds[i][j].getCommand()) {
            if ((!cmds[i][0].startsWith('_') || message.member.hasPermission(Tsubaki.adminPermission))
              && (!cmds[i][0].startsWith('__') || message.member.id === Tsubaki.ianId || message.member.id === Tsubaki.davidId)) {
              let cmd = cmds[i][j];
              let embed = new Discord.RichEmbed()
                .setDescription(Tsubaki.Style.bold('Command: ') + cmd.getCommand() + '\n'
                + Tsubaki.Style.bold('Description: ') + cmd.getDescription() + '\n'
                + Tsubaki.Style.bold('Category: ') + cmds[i][0] + '\n\n'
                + Tsubaki.Style.bold('Usage: ') + cmd.getUsage())
                .setColor(Tsubaki.color.green);
              message.channel.sendTemp({ embed: embed }, 20000);
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
}

module.exports = Help;