// Made by the best, Khux and David

// Set up, load config
const Discord = require('discord.js');
const http = require('http');

const info = require('./package.json');
const config = require('./config.json');

const sqlite = require('sqlite3').verbose();
const chalk = require('chalk');
const Style = require('./Style.js');

const bot = new Discord.Client();

const adminPermission = 'ADMINISTRATOR';

const logger = '342837394766168064';
const commandLogger = '341827696629776396';
const guildLogger = '342832229510021120';
const discordBotGuild = '110373943822540800';
const tsubakiPalaceGuild = '337747052878626816';

// const tsubakiTag = config.botID;
// const tsubakiReact = '343292881689378816';
const ianId = '135529980011610112';
// const ianReact = '343292371749961728';
const davidId = '142037204548583424';
// const davidReact = '346848029833297920';

// Color codes
const color = {
  white: '0xFFFFFF',
  gray: '0x4F545C',
  green: '0x42F44E',
  yellow: '0xFFBF00',
  red: '0xFF0000',
};

// Load commands
const Help = require('./commands/information/Help.js');
const Info = require('./commands/information/Info.js');
const Stats = require('./commands/information/Stats.js');
const SysInfo = require('./commands/information/SysInfo.js');
const Profile = require('./commands/information/Profile.js');
const Invite = require('./commands/information/Invite.js');
const Support = require('./commands/information/Support.js');
const ChangeLog = require('./commands/information/ChangeLog.js');

const Embed = require('./commands/fun/Embed.js');
const Tts = require('./commands/fun/Tts.js');
const Say = require('./commands/fun/Say.js');
const Coin = require('./commands/fun/Coin.js');
const Dice = require('./commands/fun/Dice.js');
const EightBall = require('./commands/fun/EightBall.js');
const Cat = require('./commands/fun/Cat.js');
const Dog = require('./commands/fun/Dog.js');
const Banana = require('./commands/fun/Banana.js');
const GetBanana = require('./commands/fun/GetBanana.js');

const Ping = require('./commands/utility/Ping.js');
const Define = require('./commands/utility/Define.js');
const Urban = require('./commands/utility/Urban.js');
const Add = require('./commands/utility/Add.js');

const Queue = require('./commands/music/Queue.js');
const Play = require('./commands/music/Play.js');
const Pause = require('./commands/music/Pause.js');
const Skip = require('./commands/music/Skip.js');
const Leave = require('./commands/music/Leave.js');

const Welcome = require('./commands/admin/Welcome.js');
const Delete = require('./commands/admin/Delete.js');
const Kick = require('./commands/admin/Kick.js');
const Ban = require('./commands/admin/Ban.js');
const UnBan = require('./commands/admin/UnBan.js');

const Playing = require('./commands/owner/Playing.js');
const Guilds = require('./commands/owner/Guilds.js');
const LeaveGuild = require('./commands/owner/LeaveGuild.js');
const Eval = require('./commands/owner/Eval.js');

let commands = [];
let cooldowns = [];

const db = new sqlite.Database('./data.db');

let tokenCmds = {};

// Setup server for token commands
const server = http.createServer((req, res) => {
  console.dir(req.param);

  if (req.method == 'POST') {
    let body = '';
    req.on('data', function(data) {
      body += data;
    });
    req.on('end', function() {
      if (body.startsWith('token=')) {
        let token = body.substring('token='.length);
        if (token in tokenCmds) {
          tokenCmds[token]();
        }
      }
    });
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end('post received');
  }
});

let port = 23346;
if (config.nameIn === 'tsubaki-beta') ++port;
host = '127.0.0.1';
server.listen(port, host);
console.log('Listening at http://' + host + ':' + port);

/**
 * A generic callback
 * @callback callback
 */

/**
 * Generates a token and stores it for execution when received
 * @param {callback} callback The command to execute with the token
 * @return {string} The generated token
 */
function createTokenCmd(callback) {
  let token;
  let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    + 'abcdefghijklmnopqrstuvwxyz0123456789';

  do {
    token = '';
    for (let i = 0; i < 4; i++) {
      token += possible.charAt(Math.floor(Math.random() * possible.length));
    }
  } while (token in tokenCmds); // don't allow token repeats

  tokenCmds[token] = callback;
  setTimeout(() => {
    delete tokenCmds[token];
  }, 120000); // delete token after 2 minutes

  return 'http://iandomme.com/t?n='
    + config.prefix.substring(0, config.prefix.length - 1)
    + '&t=' + token;
}

/**
 * Sends a cooldown message and deletes the user's message if in array
 * @param {number} id The user's id 
 * @param {string} username The user's name (for the message) 
 * @param {Discord.Message} sentCooldownMsg The message sent (to edit later)
 * @param {Discord.Message} message The message sent by the user (to delete)
 * @return {boolean} Whether the message should be allowed to send
 */
function cooldownMsg(id, username, sentCooldownMsg, message) {
  let time = new Date().getTime();

  if (!(id in cooldowns)) return false;
  if (time - cooldowns[id] < 3000) {
    let diff = 3 - (time - cooldowns[id]) / 1000.0; // 3 second cooldown
    diff = Math.ceil(diff);
    if (diff == 1) {
      diff = diff + ' second'; // Because aesthetics.
    } else {
      diff = diff + ' seconds';
    }

    let embed = Style.error(
      `${username}, please wait ${diff} before executing your next command!`
    );

    // First iteration of loop: sentCooldownMsg hasn't been created yet
    if (sentCooldownMsg === undefined) {
      message.delete();

      message.channel.sendType({ // Create the cooldown message
        embed: embed,
      }).then((sentMsg) => {
        setTimeout(function() { // Continue the loop
          cooldownMsg(id, username, sentMsg, message);
        }, 500);
      }).catch(console.error);
    } else {
      sentCooldownMsg.edit({ // Update the cooldown message
        embed: embed,
      }).then((sentMsg) => {
        setTimeout(function() { // Continue the loop
          cooldownMsg(id, username, sentMsg, message);
        }, 500);
      }).catch(console.error);
    }
  } else {
    if (sentCooldownMsg !== undefined) { // Delete the message if it exists,
      sentCooldownMsg.delete(); // but cooldown is over
    }
    return false;
  }
  return true;
}

/**
 * Get the points of a user
 * @param {number} id The id of the user to get points from
 * @return {Promise.<number, Error>} Returns a promise of the points
 */
function getPoints(id) {
  return new Promise((resolve, reject) => {
    let points = -2;
    db.get(`SELECT points FROM members WHERE member_id = ${id}`, (err, row) => {
      if (row !== undefined) {
        points = row.points;
      }

      if (points < 0) {
        points = 0;
        db.run(`INSERT INTO members (member_id) VALUES (${id})`, () => {
          resolve(points);
        });
      } else {
        resolve(points);
      }
    });
  });
}

/**
 * Set the points of a user
 * @param {number} id The id of the user to set points of
 * @param {number} points The number of points to set to
 * @param {Discord.TextChannel} channel The channel to send level up messages
 */
function setPoints(id, points, channel) {
  db.run(`UPDATE members SET points = ${points} WHERE member_id = ${id}`
    , () => {
      if (getLevel(points) === getLevelR(points)) {
        channel.sendTemp(
          Style.success(
            ` :arrow_up: *<@${id}> just leveled up to level`
            + ` ${getLevelR(points)}!*`
          ), 10000);
      }
  });
}

/**
 * Calculates the level from points
 * @param {number} points The number of points
 * @return {number} The level
 */
function getLevel(points) {
  return 0.1 * Math.sqrt(points);
}

/**
 * Gets the level from points, then rounds it
 * @see Tsubaki#getLevel
 * @param {number} points The number of points
 * @return {number} The level, rounded down to an int
 */
function getLevelR(points) {
  return Math.floor(getLevel(points));
}

/**
 * Calculates the points needed for a certain level
 * @param {number} level The level to calculate
 * @return {number} The points needed
 */
function getPointsFor(level) {
  return Math.pow(level * 10, 2);
}

/**
 * Logs a command to the cmd logger channel
 * @param {Discord.Message} message The message sent
 * @param {Discord.Client} bot This instance of the discord client
 */
function cmdLogger(message, bot) {
  if (message.content.startsWith(config.prefix) && message.guild.id !== '') {
    bot.channels.get(commandLogger).sendType(
      `**${message.author.tag}** » __${message.guild.name}__`
      + ` » \`${message.content}\``
    );
  }
}

/**
 * Set the `playing` status to a message
 * @param {string} message The text to set the message to
 */
function setPlaying(message) {
  if (message == ' ' || message === undefined || message.length == 0) {
    message = `${config.name} v${info.version}`;
  }
  let gameData = {
    'name': message,
    'url': 'https://discordapp.com',
  };
  bot.user.setPresence({'status': 'online', 'game': gameData});
}

bot.on('ready', () => {
  console.log(chalk.green(
    `${config.name} has started, with ${bot.users.size} users`
    + `, in ${bot.channels.size} channels of ${bot.guilds.size} guilds.`
  ));

  setTimeout(function() {
    let embed = new Discord.RichEmbed()
      .setDescription(`:wave: Hello! I'm **${config.name}** v${info.version}.`
      + `\n\nDo \`${new Help().getUsage()}\` to see my commands!`)
      .setFooter(`Created by ${info.author}`)
      .setColor(color.green);
    bot.channels.get(logger).sendType({embed: embed});
  }, 3000);

  db.serialize(function() {
    db.run(
      'CREATE TABLE IF NOT EXISTS guild_join (member_id TEXT, guild_id TEXT)'
    );
    db.run(
      'CREATE TABLE IF NOT EXISTS guilds (guild_id TEXT, channel_id TEXT)'
    );
    db.run(
      'CREATE TABLE IF NOT EXISTS members'
      + ' (member_id TEXT, points INTEGER DEFAULT 0'
      + ', is_muted INTEGER DEFAULT 0)'
    );
  });

  setTimeout(function() {
setPlaying();
}, 3000);

  commands = [
    ['Information',
      new Help(),
      new Info(),
      new Stats(),
      new SysInfo(),
      new Profile(),
      new Invite(),
      new Support(),
      new ChangeLog(),
    ], ['Fun',
      new Embed(),
      new Say(),
      new Tts(),
      new Coin(),
      new Dice(),
      new EightBall(),
      new Cat(),
      new Dog(),
      new Banana(),
      new GetBanana(),
    ], ['Utility',
      new Ping(),
      new Define(),
      new Urban(),
      new Add(),
    ], ['Music',
      new Queue(),
      new Play(),
      new Pause(),
      new Skip(),
      new Leave(),
    ], ['_Admin_',
      new Welcome(),
      new Delete(),
      new Kick(),
      new Ban(),
      new UnBan(),
    ], ['__Owner__',
      new Playing(),
      new Guilds(),
      new LeaveGuild(),
      new Eval(),
    ],
  ];
});

// Log guild create and delete
bot.on('guildCreate', (guild) => {
  let log = bot.channels.get(guildLogger);
  log.sendType(
    `:thumbsup: New guild joined: ${guild.name} (id: ${guild.id}, owned by`
    + ` ${guild.owner}). This guild has ${guild.memberCount} members!`
  );
});

bot.on('guildDelete', (guild) => {
  let log = bot.channels.get(guildLogger);
  log.sendType(
    `:thumbsdown: I have been removed from ${guild.name} (id: ${guild.id})`
  );
});

bot.on('guildMemberAdd', (member) => {
  let guild = member.guild;
  if (guild.id == discordBotGuild) return;

  if (guild.id === tsubakiPalaceGuild) {
    member.addRole(member.guild.roles.find('name', 'Member'));
  }

  db.get(`SELECT * from guilds WHERE guild_id = ${guild.id}`, (err, row) => {
    if (row === undefined) return;
    let channelId = row.channel_id;

    db.get(`SELECT * from guild_join WHERE member_id = ${member.id}`
      + ` AND guild_id = ${guild.id}`, function(err, row) {
        if (row === undefined) {
          let welcomeEmbed = new Discord.RichEmbed()
            .setDescription(`Welcome to **${guild.name}**, **${member}**!`)
            .setColor(color.white);
          bot.channels.get(channelId).sendTemp({embed: welcomeEmbed}, 60000);
          db.run(`INSERT INTO guild_join VALUES (${member.id}, ${guild.id})`);
        } else {
          let welcomeEmbed = new Discord.RichEmbed()
            .setDescription(`Welcome back to **${guild.name}**, **${member}**!`)
            .setColor(color.white);
          bot.channels.get(channelId).sendTemp({embed: welcomeEmbed}, 60000);
        }
    });
  });
});

bot.on('message', (message) => {
  if (message.author.bot) return;
  if (message.channel.type === 'dm') return;

  // chatlogger(message, bot);
  cmdLogger(message, bot);

  /* let lowerMsg = message.content.toLowerCase();

   if (lowerMsg.toLowerCase() === 'help tsubaki') {
    message.channel.sendType('Hi there, if you need help do  ``t-help``!');
  }

  // Reacts
  if (lowerMsg.includes(config.nameIn.toLowerCase())
    || lowerMsg.includes(config.name.toLowerCase())
    || lowerMsg.includes(tsubakiTag)) {
    message.react(tsubakiReact);
  }

  if (lowerMsg.includes('khux') || lowerMsg.includes('ian')
    || lowerMsg.includes(ianId)) {
    message.react(ianReact);
  }

  if (lowerMsg.includes('pan') || lowerMsg.includes('david')
    || lowerMsg.includes(davidId)) {
    message.react(davidReact);
  } */

  if (!message.content.startsWith(config.prefix) || message.author.id == '') {
    return;
  }

  let time = new Date().getTime();

  if (cooldownMsg(message.author.id, message.author.username
    , undefined, message)) return;

  if (message.author.id !== ianId && message.author.id !== davidId) {
    cooldowns[message.author.id] = time;
  }

  let command = message.content.split(' ')[0]
    .slice(config.prefix.length).toLowerCase();
  let args = message.content.split(' ').slice(1);

  getPoints(message.author.id).then((points) => {
    setPoints(message.author.id, points + 1, message.channel);
  });

  let found = false;

  for (let i = 0, lenI = commands.length; i < lenI && !found; i++) {
    for (let j = 1, lenJ = commands[i].length; j < lenJ && !found; j++) {
      if (command === commands[i][j].getCommand()) {
        commands[i][j].executeInternal(message, args, bot, db);
        found = true;
        break;
      }
    }
  }
  if (!found) {
    message.channel.sendTemp(Style.notFound(), 10000);
  }
});

if (!Discord.TextChannel.prototype.sendTemp) {
  Discord.TextChannel.prototype.sendTemp = function(...args) {
    let duration = args.pop();
    let promise = new Promise((resolve, reject) => {
      this.sendType(...args).then((msg) => {
        resolve(msg);
        msg.delete(duration);
      }).catch((err) => {
        reject(err);
      });
    });

    return promise;
  };
}

if (!Discord.Message.prototype.editTemp) {
  Discord.Message.prototype.editTemp = function(...args) {
    let duration = args.pop();
    let promise = new Promise((resolve, reject) => {
      this.edit(...args).then((msg) => {
        resolve(msg);
        msg.delete(duration);
      }).catch((err) => {
        reject(err);
      });
    });

    return promise;
  };
}

if (!Discord.TextChannel.prototype.sendType) {
  Discord.TextChannel.prototype.sendType = function(...args) {
    let channel = this;
    channel.startTyping();

    let promise = new Promise((resolve, reject) => {
      setTimeout(() => {
        channel.send.apply(this, args).then((msg) => {
          channel.stopTyping();
          resolve(msg);
        }).catch((err) => {
          reject(err);
        });
      }, 500);
    });

    return promise;
  };
}

bot.login(config.token);

module.exports.prefix = config.prefix;
module.exports.name = config.name;
module.exports.nameIn = config.nameIn;
module.exports.botId = config.botID;
module.exports.author = info.author;
module.exports.version = info.version;
module.exports.adminPermission = adminPermission;
module.exports.color = color;
module.exports.Style = Style;
module.exports.ianId = ianId;
module.exports.davidId = davidId;
module.exports.commands = commands;
module.exports.createTokenCmd = createTokenCmd;
module.exports.getPoints = getPoints;
module.exports.setPoints = setPoints;
module.exports.getLevel = getLevel;
module.exports.getLevelR = getLevelR;
module.exports.getPointsFor = getPointsFor;
module.exports.setPlaying = setPlaying;
module.exports.commands = function() {
  return commands;
};
module.exports.help = function() {
  return new Help();
};

process.stdin.resume();

/**
 * Clean up before shutting down
 * @param {*} options 
 * @param {*} err 
 */
function exitHandler(options, err) {
  if (options.cleanup) {
    const bot = new Discord.Client();
    bot.login(config.token);
    console.log(chalk.yellow('Shutting down gracefully...'));

    const {execSync} = require('child_process');
    let options = {stdio: 'pipe'};
    execSync(`curl -v`
      + ` -H "Authorization: Bot ${config.token}"`
      + ` -H "User-Agent: ${config.nameIn} (https://iandomme.com, v${info.version})"`
      + ` -H "Content-Type: application/json"`
      + ` -d '{"content": ":wave: Goodbye! Shutting down..."}'`
      + ` https://discordapp.com/api/channels/${logger}/messages > /dev/null`
      , options);

    db.close();
    console.log('Closed db');
  }
  if (err) console.log(err.stack);
  if (options.exit) {
    process.exit();
  }
}

// do something when app is closing
process.on('exit', exitHandler.bind(null, {cleanup: true}));

// catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, {exit: true}));

// catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, {exit: true}));
