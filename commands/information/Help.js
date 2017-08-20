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
      let description = Tsubaki.Style.bold('Tsubaki Command List') + '\n\n'
        + 'Do ' + Tsubaki.Style.bold(this.getUsage()) + ' and replace ' + Tsubaki.Style.bold('[command]')
        + ' with any command you want to learn more about.' + '\n';
      for (let i = 0, lenI = cmds.length; i < lenI; i++) {
        if ((!cmds[i][0].startsWith('_') || message.member.hasPermission(Tsubaki.adminPermission))
          && (!cmds[i][0].startsWith('__') || message.member.id === Tsubaki.ianId || message.member.id === Tsubaki.davidId)) {
          description += '\n' + Tsubaki.Style.bold(cmds[i][0] + ': ');

          for (let j = 1, lenJ = cmds[i].length; j < lenJ; j++) {
            description += Tsubaki.Style.code(cmds[i][j].getCommand()) + ' ';
          }
        }  
      }

      let embed = new Discord.RichEmbed()
        .setDescription(description)
        .setColor(Tsubaki.color.green);
      message.channel.send({ embed: embed });
    } else {    
      for (let i = 0, lenI = cmds.length; i < lenI; i++) {
        for (let j = 1, lenJ = cmds[i].length; j < lenJ; j++) {
          if (args[0] === cmds[i][j].getCommand()) {
            if ((!cmds[i][0].startsWith('_') || message.member.hasPermission(Tsubaki.adminPermission))
              && (!cmds[i][0].startsWith('__') || message.member.id === Tsubaki.ianId || message.member.id === Tsubaki.davidId)) {
              var cmd = cmds[i][j];
              var embed = new Discord.RichEmbed()
                .setDescription(Tsubaki.Style.bold('Command: ') + cmd.getCommand() + '\n'
                + Tsubaki.Style.bold('Description: ') + cmd.getDescription() + '\n'
                + Tsubaki.Style.bold('Category: ') + cmds[i][0] + '\n\n'
                + Tsubaki.Style.bold('Usage: ') + cmd.getUsage())
                .setColor(Tsubaki.color.green);
              message.channel.send({ embed: embed });
            } else {
              message.channel.send(Tsubaki.Style.notFound());
            }
            return;
          }
        }
      }
      message.channel.send(Tsubaki.Style.notFound());
    }
  }
}

module.exports = Help;