const Tsubaki = require('../../Tsubaki.js');
const Discord = require('discord.js');
const os = require('os');
const Command = require('../Command.js');

/** The sysinfo command  */
class SysInfo extends Command {
  /** Create the command */
  constructor() {
    super('sysinfo', 'Displays information about the system.');
  }

  /**
   * @param {Discord.Message} message The sent command
   * @param {string[]} args The arguments in the command
   * @param {Discord.Client} bot The instance of the discord client
   * @param {sqlite.Database} db The instance of the database
   */
  execute(message, args, bot, db) {
    SysInfo.cores = [];
    message.channel.sendType({embed: SysInfo.getInfo('')}).then((msg) => {
      SysInfo.sendEmbeds(msg, 1);
    });
  }

  /**
   * Send the embeds, editing every second
   * @param {Discord.Message} msg The previous message
   * @param {number} iter The number of times this has executed
   */
  static sendEmbeds(msg, iter) {
    setTimeout(() => {
      if (iter < 600) {
        msg.edit({embed: SysInfo.getInfo(msg.embeds[0].description)})
          .then((edited) => SysInfo.sendEmbeds(edited, iter + 1))
          .catch(() => {
            return;
          });
      } else {
        msg.delete();
      }
    }, 1000);
  }

  /**
   * Get the system info
   * @param {string} prevGraph The previous graph (or blank if new)
   * @return {Discord.RichEmbed} The system info, formatted in an embed
   */
  static getInfo(prevGraph) {
    let embed = new Discord.RichEmbed();

    let cpus = os.cpus();
    let index = 1;
    let total = 0;

    cpus.forEach((cpu) => {
      let load = SysInfo.getCoreLoad(cpu.times, index); // From 0 to 100
      total += load;

      let bar = '`[';
      for (let i = 0; i < 25; i++) {
        if (i < load / 4) {
          bar += '|';
        } else {
          bar += ' ';
        }
      }
      bar += ']` ' + load.toFixed(1) + '%';

      embed.addField(`CPU ${index++}`, bar, true);
    });
    let avgLoad = total / ((index - 1) * 10); // Max load will be 10
    if (prevGraph === '') {
      prevGraph = `**${Tsubaki.name} System Info:**`
        + '\nCPU Load:```';
      for (let i = 0; i < 10; i++) {
        prevGraph += '\n';
        for (let j = 0; j < 60; j++) {
          prevGraph += ' ';
        }
      }
      prevGraph += '\n```';
    }

    let lines = prevGraph.split('\n');
    lines = lines.slice(2, -1);
    for (let i = 0, len = lines.length; i < len; i++) {
      let j = lines.length - i - 1;
      lines[i] = lines[i].substring(1);

      if (j < avgLoad) {
        lines[i] += ':';
      } else if (j - 0.5 < avgLoad) {
        lines[i] += '.';
      } else {
        lines[i] += ' ';
      }
    }

    let newGraph = '**System Info:**'
      + '\nCPU Load:```'
      + '\n' + lines.join('\n') + '\n```';
    embed.setDescription(newGraph);

    let freeMem = os.freemem();
    let totalMem = os.totalmem();
    let memUsage = freeMem * 25 / totalMem; // From 0 to 25

    let bar = '`[';
    for (let i = 0; i < 25; i++) {
      if (i < memUsage) {
        bar += '|';
      } else {
        bar += ' ';
      }
    }
    bar += ']` ';
    freeMem = (freeMem / Math.pow(1024, 3)).toFixed(2);
    totalMem = (totalMem / Math.pow(1024, 3)).toFixed(2);
    bar += `${freeMem}G/${totalMem}G`;

    embed.addField('Mem', bar, true);

    let uptime = os.uptime();
    let days = Math.floor(uptime / 86400);
    uptime -= days * 86400;

    let hours = Math.floor(uptime / 3600) % 24;
    uptime -= hours * 3600;

    let minutes = Math.floor(uptime / 60) % 60;
    uptime -= minutes * 60;

    let seconds = Math.round(uptime % 60);

    embed.addField('Uptime', `${days}:${hours}:${minutes}:${seconds}`, true);
    return embed;
  }

  /**
   * Calculate the core load percentage from timings
   * @param {Object} times The number of milliseconds the CPU has spent in...
   * @param {number} times.user user mode
   * @param {number} times.nice nice mode
   * @param {number} times.sys sys mode
   * @param {number} times.idle idle mode
   * @param {number} times.irq irq mode
   * @param {number} core The core number (starting from 1)
   * @return {number} The load percentage, as a decimal between 0 and 100
   */
  static getCoreLoad(times, core) {
    core = core - 1;
    if (SysInfo.cores.length <= core) {
      SysInfo.cores[core] = {};
      SysInfo.cores[core].load = 0;
      SysInfo.cores[core].idle = 0;
    }

    let load = times.user + times.nice + times.sys + times.irq;
    let loadRaw = load;
    load = load - SysInfo.cores[core].load;
    SysInfo.cores[core].load = loadRaw;

    let idle = times.idle;
    let idleRaw = idle;
    idle = idle - SysInfo.cores[core].idle;
    SysInfo.cores[core].idle = idleRaw;

    let total = load + idle;
    return Math.round(load * 1000.0 / total) / 10; // Round to 1 decimal place
  }
}

module.exports = SysInfo;
