const Tsubaki = require('../../Tsubaki.js');
const Discord = require('discord.js');
const os = require('os');
const disk = require('diskusage');
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
    let time = new Date().getTime();
    message.channel.sendType({
      embed: SysInfo.getInfo('', bot, time),
    }).then((msg) => {
      SysInfo.sendEmbeds(msg, bot, time, 1);
    });
  }

  /**
   * Send the embeds, editing every second
   * @param {Discord.Message} msg The previous message
   * @param {Discord.Client} bot The bot instance
   * @param {number} time The time (in milliseconds) it was last executed
   * @param {number} iter The number of times this has executed
   */
  static sendEmbeds(msg, bot, time, iter) {
    let newTime = new Date().getTime();
    let delay = newTime - time;
    setTimeout(() => {
      if (iter < 600) {
        let newTime = new Date().getTime();
        msg.edit({
          embed: SysInfo.getInfo(msg.embeds[0].description, bot, delay),
        }).then((edited) => SysInfo.sendEmbeds(edited, bot, newTime, iter + 1))
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
   * @param {Discord.Client} bot The bot instance (to get uptime)
   * @param {number} delay The time (in milliseconds) between last 2 executions
   * @return {Discord.RichEmbed} The system info, formatted in an embed
   */
  static getInfo(prevGraph, bot, delay) {
    let spacer = '\u2808';
    let embed = new Discord.RichEmbed();

    // Create cpu bars
    let cpus = os.cpus();
    let index = 1;
    let total = 0;

    cpus.forEach((cpu) => {
      let load = SysInfo.getCoreLoad(cpu.times, index); // From 0 to 100
      total += load;
      let bar = '`' + SysInfo.createBar(load / 100);
      load = load.toFixed(1);
      if (load.length == 5) { // Will only be length 5 if '100.0'
        load = '100';
      }
      while (load.length < 5) {
        load = ' ' + load;
      }
      bar += '|' + load + '%`';

      embed.addField(`CPU ${index++}`, bar, true);
    });

    let avgLoad = total / (index - 1); // Calculate the average
    avgLoad = avgLoad * (10 / 100.0); // Set the range to 0-10

    // Colors!
    if (avgLoad < (1 / 3) * 10) embed.setColor(Tsubaki.color.green);
    else if (avgLoad < (2 / 3) * 10) embed.setColor(Tsubaki.color.yellow);
    else embed.setColor(Tsubaki.color.red);

    // Create a blank canvas if prevGraph doesn't exist
    if (prevGraph === '') {
      prevGraph = `**${Tsubaki.name} System Info:**`
        + '\nCPU Load:```';
      for (let i = 0; i < 9; i++) {
        prevGraph += '\n';
        for (let i = 0; i < 45; i++) {
          prevGraph += spacer;
        }
      }
      prevGraph += '\n```';
    }

    let lines = prevGraph.split('\n');
    lines = lines.slice(2, -1);

    for (let i = 0, len = lines.length; i < len; i++) {
      let line = lines[i];
      let nums = [];

      // Convert the graph to number data
      for (let j = 0, lineLen = line.length; j < lineLen; j++) {
        if (line.charAt(j) === spacer) {
          nums.push(0);
          nums.push(0);
          continue;
        }
        let vals = parseInt(line
          .charCodeAt(j) // Get the char code of that character (base 10 int)
          .toString(16) // Convert it to a base 16 int string
          .substring(2) // Cut out the first 2 chars ('28')
          , 16) // Parse it as base 16 int (without first 2 chars)
          .toString(2); // Convert to base 2 int string
        while (vals.length < 8) {
          vals = '0' + vals; // Add back the leading 0s
        }
        vals = vals.split(''); // Convert to array

        let left = 0;
        let right = 0;

        for (let pos = 0, valLen = vals.length; pos < valLen; pos++) {
          if (vals[pos] === '1') {
            // Values of pos:
            // 74
            // 63
            // 52
            // 10

            if (pos <= 4 && pos !== 1) {
              ++right;
            } else {
              ++left;
            }
          }
        }
        nums.push(left);
        nums.push(right);
      }

      // Remove the first row and add the new data to the array
      nums = nums.slice(1);
      if (lines.length - i - 1 < avgLoad) {
        nums.push(4);
      } else if (lines.length - i - 1.25 < avgLoad) {
        nums.push(3);
      } else if (lines.length - i - 1.5 < avgLoad) {
        nums.push(2);
      } else if (lines.length - i - 1.75 < avgLoad) {
        nums.push(1);
      } else {
        nums.push(0);
      }

      line = '';
      // Recreate the graph, with the shifted and new data
      for (let j = 0, numLen = nums.length; j < numLen; j += 2) {
        let left = nums[j];
        let right = nums[j + 1];
        if (left == 0 && right == 0) {
          line += spacer;
          continue;
        }
        let binary = '00000000'.split('');

        let leftVals = {
          1: 1,
          2: 5,
          3: 6,
          4: 7,
        };
        let rightVals = {
          1: 0,
          2: 2,
          3: 3,
          4: 4,
        };

        for (let key = 1; key <= 4; key++) {
          if (left >= key) {
            binary[leftVals[key]] = 1;
          }
          if (right >= key) {
            binary[rightVals[key]] = 1;
          }
        }
        binary = binary.join('');

        let braille = parseInt(binary, 2).toString(16); // Convert to base 16
        braille = '28' + braille; // Add '28' in front of it
        braille = parseInt(braille, 16); // Convert to base 10
        line += String.fromCharCode(braille); // Convert to symbol
      }

      lines[i] = line;
    }

    /* for (let i = 0, len = lines.length; i < len; i++) {
      let j = lines.length - i - 1;
      lines[i] = lines[i].substring(1);

      if (j < avgLoad) {
        lines[i] += ':';
      } else if (j - 0.5 < avgLoad) {
        lines[i] += '.';
      } else {
        lines[i] += ' ';
      }
    }*/

    let newGraph = '**System Info:**'
      + '\nCPU Load:```'
      + '\n' + lines.join('\n') + '\n```';
    embed.setDescription(newGraph);

    let freeMem = os.freemem();
    let totalMem = os.totalmem();
    let usedMem = totalMem - freeMem;
    let memUsage = usedMem / totalMem;

    usedMem = (usedMem / Math.pow(1024, 3)).toFixed(2);
    totalMem = Math.round(totalMem / Math.pow(1024, 3));

    let memBar = '`' + SysInfo.createBar(memUsage, 20)
      + `| ${usedMem} / ${totalMem} G\``;

    let diskInfo = disk.checkSync('/');
    let freeDisk = diskInfo.available;
    let totalDisk = diskInfo.total;
    let usedDisk = totalDisk - freeDisk;
    let diskUsage = usedDisk / totalDisk;

    usedDisk = (usedDisk / Math.pow(1024, 3)).toFixed(2);
    totalDisk = Math.round(totalDisk / Math.pow(1024, 3));

    let diskBar = '`' + SysInfo.createBar(diskUsage, 20)
      + `| ${usedDisk} / ${totalDisk} G\``;

    embed.addField('Mem', memBar, true)
      .addField('Disk', diskBar, true)
      .addField('System Uptime', SysInfo.toTimeString(os.uptime()), true)
      .addField('Bot Uptime', SysInfo.toTimeString(bot.uptime / 1000), true)
      .addField('Bot Version', `${Tsubaki.name} v${Tsubaki.version}`, true)
      .addField('Guilds', bot.guilds.size, true)
      .addField('Users', bot.users.size, true)
      .addField('Channels', bot.channels.size, true)
      .addField('Ping', `${Math.round(delay * 10) / 10.0}ms`, true);
    return embed;
  }

  /**
   * Formats seconds into a time value
   * @param {number} time The time to format, in milliseconds
   * @return {string} The formatted string
   */
  static toTimeString(time) {
    let days = Math.floor(time / 86400);
    time -= days * 86400;

    let hours = Math.floor(time / 3600) % 24;
    time -= hours * 3600;

    let minutes = Math.floor(time / 60) % 60;
    time -= minutes * 60;

    let seconds = Math.round(time % 60);
    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  }

  /**
   * Create a bar
   * @param {number} percentage Percentage of bar should be filled, 0 to 1
   * @param {number} max The number of spaces the bar should fill
   * @return {string} The generated bar
   */
  static createBar(percentage, max = 25) {
    let fill = '\u2588';
    let fillHalf = '\u258C';
    let bar = '';
    percentage = percentage * max;

    for (let i = 0; i < max; i++) {
      if (i < percentage) {
        bar += fill;
      } else if (i - 0.5 < percentage) {
        bar += fillHalf;
      } else if (i == 0) {
        bar += '.';
      } else {
        bar += ' ';
      }
    }
    return bar;
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
