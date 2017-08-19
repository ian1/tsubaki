// Made by the best, Khux and David

// Set up, load config
const Discord = require('discord.js');

const package = require('./package.json');
const config = require('./config.json');

const sqlite = require('sqlite3').verbose();
const chalk = require('chalk');
const music = require('discord.js-music-v11');
const Style = require('./Style.js');

const bot = new Discord.Client();

music(bot, {
  prefix: config.prefix,
});

const adminPermission = 'ADMINISTRATOR';

const logger = '342837394766168064';
const commandLogger = '341827696629776396';
const guildLogger = '342832229510021120';
const discordBotGuild = '110373943822540800';
const tsubakiPalaceGuild = '335272347256881154';

//const tsubakiTag = '334386617626263553';
//const tsubakiReact = '343292881689378816';
const ianId = '135529980011610112';
//const ianReact = '343292371749961728';
const davidId = '142037204548583424';
//const davidReact = '346848029833297920';

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
const Stats = require('./commands/information/Stats.js');
const Profile = require('./commands/information/Profile.js');
const Invite = require('./commands/information/Invite.js');
const Support = require('./commands/information/Support.js');
const Info = require('./commands/information/Info.js');
const ChangeLog = require('./commands/information/ChangeLog.js');

const EightBall = require('./commands/fun/EightBall.js');
const Say = require('./commands/fun/Say.js');
const Embed = require('./commands/fun/Embed.js');
const Dice = require('./commands/fun/Dice.js');
const Cat = require('./commands/fun/Cat.js');
const Dog = require('./commands/fun/Dog.js');
const Banana = require('./commands/fun/Banana.js');
const GetBanana = require('./commands/fun/GetBanana.js');
const Tts = require('./commands/fun/Tts.js');
const Coin = require('./commands/fun/Coin.js');

const Ping = require('./commands/utility/Ping.js');
const Add = require('./commands/utility/Add.js');
const Urban = require('./commands/utility/Urban.js');
const Define = require('./commands/utility/Define.js');

/* const Leave = require('./commands/music/Leave.js');
const Queue = require('./commands/music/Queue.js');
const Play = require('./commands/music/Play.js');
const Pause = require('./commands/music/Pause.js');
const Resume = require('./commands/music/Resume.js');
const Skip = require('./commands/music/Skip.js');
const ClearQueue = require('./commands/music/ClearQueue.js');*/

const Delete = require('./commands/admin/Delete.js');
const Kick = require('./commands/admin/Kick.js');
const Ban = require('./commands/admin/Ban.js');
const UnBan = require('./commands/admin/UnBan.js');
const Welcome = require('./commands/admin/Welcome.js');

const Playing = require('./commands/owner/Playing.js');
const Guilds = require('./commands/owner/Guilds.js');
const LeaveGuild = require('./commands/owner/LeaveGuild.js');
const Eval = require('./commands/owner/Eval.js');

let commands = [];
let cooldowns = [];
let cooldownMsgs = [];

const db = new sqlite.Database('./data.db');

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

    var embed = Style.error(username + ', please wait ' + diff
      + ' before executing your next command!');

    // First iteration of loop: sentCooldownMsg hasn't been created yet
    if (sentCooldownMsg === undefined) {
      message.delete();
      
      message.channel.send({ // Create the cooldown message
        embed: embed
      }).then(sentMsg => {
        setTimeout(function () { // Continue the loop
          cooldownMsg(id, username, sentMsg, message);
        }, 500);
        }).catch(console.error);
    } else {
      sentCooldownMsg.edit({ // Update the cooldown message
        embed: embed
      }).then(sentMsg => {
        setTimeout(function () { // Continue the loop
          cooldownMsg(id, username, sentMsg, message);
        }, 500);
      }).catch(console.error);
    }
  } else if (sentCooldownMsg !== undefined) { // Delete the message if it exists, but cooldown is over
    sentCooldownMsg.delete();
  }
  return true;
}

function getPoints(id, callback) {
  let points = -2;
  db.get('SELECT points FROM members WHERE member_id = ' + id, function (err, row) {
    if (row !== undefined) {
      points = row.points;
    }
    
    if (points < 0) {
      points = 0;
      db.run('INSERT INTO members (member_id) VALUES (' + id + ')', function () {
        callback(points);
      });
    } else {
      callback(points);
    }
  });
}

function setPoints(id, points, channel) {
  db.run('UPDATE members SET points = ' + points + ' WHERE member_id = ' + id, function () {
    if (getLevel(points) === getLevelR(points)) {
      channel.send({ embed: Style.success(' :arrow_up: ' + Style.italicize('<@' + id + '> just leveled up to level ' + getLevelR(points) + '!')) });
    }
  });
}

function getLevel(points) {
  return 0.1 * Math.sqrt(points);
}

function getLevelR(points) {
  return Math.floor(getLevel(points));
}

function cmdLogger(message, bot) {
  if (message.content.startsWith(config.prefix) && message.guild.id !== '') {
    bot.channels.get(commandLogger).send('{0} » {1} » {2}'.format(Style.bold(message.author.tag),
      Style.underline(message.guild.name), Style.code(message.content)));
  }
}

function setPlaying(message) {
  if (message == ' ' || message === undefined || message.length == 0) message = config.name + ' v' + package.version;
  let gameData = {
    'name': message,
    'url': 'https://discordapp.com'
  }
  bot.user.setPresence({ 'status': 'online', 'game': gameData });
}

bot.on('ready', () => {
  console.log(chalk.green('{0} has started, with {1} users, in {2} channels of {3} guilds.'
    .format(config.name, bot.users.size, bot.channels.size, bot.guilds.size)));

  setTimeout(function () {
    let embed = new Discord.RichEmbed()
      .setDescription(':wave: Hello! I\'m ' + Style.bold(config.name) + ', version ' + package.version + '.\n\nDo ' + Style.code(new Help().getUsage()) + ' to see my commands!')
      .setFooter('Created by ' + package.author)
      .setColor(color.green);
    bot.channels.get(logger).send({ embed: embed });
  }, 3000);  
  
  db.serialize(function() {
    db.run('CREATE TABLE IF NOT EXISTS guild_join (member_id TEXT, guild_id TEXT)');
    db.run('CREATE TABLE IF NOT EXISTS guilds (guild_id TEXT, channel_id TEXT)');
    db.run('CREATE TABLE IF NOT EXISTS members (member_id TEXT, points INTEGER DEFAULT 0, is_muted INTEGER DEFAULT 0)');
  });

  setTimeout(function () { setPlaying() }, 3000);

  commands = [
    ['Information', new Help(), new Stats(), new Profile(), new Invite(), new Support(), new Info(), new ChangeLog()],
    ['Fun', new EightBall(), new Say(), new Embed(), new Dice(), new Cat(), new Dog(), new Banana(), new GetBanana(), new Tts(), new Coin()],
    ['Utility', new Ping(), new Add(), new Urban(), new Define()],
    /* ['Music', new Leave(), new Queue(), new Play(), new Pause(), new Resume(), new Skip(), new ClearQueue()],*/
    ['_Admin_', new Delete(), new Kick(), new Ban(), new UnBan(), new Welcome()],
    ['__Owner__', new Playing(), new Guilds(), new LeaveGuild(), new Eval()],
  ];
});

// Log guild create and delete
bot.on('guildCreate', (guild) => {
  let log = bot.channels.get(guildLogger);
  log.send(':thumbsup: New guild joined: {0} (id: {1}, owned by {2}). This guild has {3} members!'
    .format(guild.name, guild.id, guild.owner, guild.memberCount));
});
bot.on('guildDelete', (guild) => {
  let log = bot.channels.get(guildLogger);
  log.send(':thumbsdown: I have been removed from: ' + guild.name + ' (id: ' + guild.id + ')');
});

bot.on('guildMemberAdd', (member) => {
  let guild = member.guild;
  if (guild.id == discordBotGuild) return;

  db.get('SELECT * from guilds WHERE guild_id = ' + guild.id, function (err, row) {
    if (row === undefined) return; 
    let channelId = row.channel_id;

    db.get('SELECT * from guild_join WHERE member_id = ' + member.id
      + ' AND guild_id = ' + guild.id, function (err, row) {
        if (row === undefined) {
          console.log('welcome');
          let welcomeEmbed = new Discord.RichEmbed()
            .setDescription('Welcome to ' + Style.bold('{0}, {1}!').format(guild.name, member))
            .setColor(color.white);
          bot.channels.get(channelId).send({ embed: welcomeEmbed });
          db.run('INSERT INTO guild_join VALUES (' + member.id + ', ' + guild.id + ')');
        }
    });
  });
});

bot.on('message', (message) => {

  if (message.author.bot) return;
  if (message.channel.type === 'dm') return;

  // chatlogger(message, bot);
  cmdLogger(message, bot);

  let lowerMsg = message.content.toLowerCase();

  /* if (lowerMsg.toLowerCase() === 'help tsubaki') {
    message.channel.send('Hi there, if you need help do  ``t-help``!');
  }*/

  // Reacts
  /*if (lowerMsg.includes(config.nameIn.toLowerCase()) || lowerMsg.includes(config.name.toLowerCase()) || lowerMsg.includes(tsubakiTag)) {
    message.react(tsubakiReact);
  }

  if (lowerMsg.includes('khux') || lowerMsg.includes('ian') || lowerMsg.includes(ianId)) {
    message.react(ianReact);
  }

  if (lowerMsg.includes('pan') || lowerMsg.includes('david') || lowerMsg.includes(davidId)) {
    message.react(davidReact);
  }*/

  if (!message.content.startsWith(config.prefix) || message.author.id == '') return;

  let time = new Date().getTime();

  if (cooldownMsg(message.author.id, message.author.username, undefined, message)) return;

  if (message.author.id !== ianId && message.author.id !== davidId) {
    cooldowns[message.author.id] = time;
  }

  let command = message.content.split(' ')[0].slice(config.prefix.length).toLowerCase();
  let args = message.content.split(' ').slice(1);

  getPoints(message.author.id, function (points) {
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
    message.channel.send({embed: Style.notFound()});
  }
});

if (!String.prototype.format) {
  String.prototype.format = function() {
    let args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) {
      return typeof args[number] != 'undefined' ? args[number] : match;
    });
  };
}

bot.login(config.token);

module.exports.prefix = config.prefix;
module.exports.name = config.name;
module.exports.nameIn = config.nameIn;
module.exports.author = package.author;
module.exports.adminPermission = adminPermission;
module.exports.color = color;
module.exports.Style = Style;
module.exports.ianId = ianId;
module.exports.davidId = davidId;
module.exports.commands = function() {
  return commands;
}
module.exports.help = function() {
  return new Help();
}
module.exports.getPoints = function(id, callback) {
  return getPoints(id, callback)
}
module.exports.setPoints = function(id, points, channel) {
  setPoints(id, points, channel);
}
module.exports.getLevel = function(points) {
  return getLevel(points);
}
module.exports.getLevelR = function(points) {
  return getLevelR(points);
}
module.exports.setPlaying = function(message) {
  return setPlaying(message);
}

process.stdin.resume();

function exitHandler(options, err) {
  if (options.cleanup) {
    const bot = new Discord.Client();
    bot.login(config.token);
    console.log(chalk.yellow('Shutting down gracefully...'));

    const { execSync } = require('child_process');
    let options = { stdio: 'pipe' };
    execSync('curl -v '
      + '-H "Authorization: Bot ' + config.token + '" '
      + '-H "User-Agent: ' + config.nameIn + ' (https://iandomme.com, v' + package.version + ')" '
      + '-H "Content-Type: application/json" '
      + '-d \'{"content": ":wave: Goodbye! Shutting down..." }\' '
      + 'https://discordapp.com/api/channels/' + logger + '/messages > /dev/null'
      , options);
    
    db.close();
    console.log('Closed db');
  }
  if (err) console.log(err.stack);
  if (options.exit) {
    process.exit();
  }
}

//do something when app is closing
process.on('exit', exitHandler.bind(null, { cleanup: true }));

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, { exit: true }));

//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, { exit: true }));
