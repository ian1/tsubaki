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

const logger = '341827696629776396';
const guildLogger = '342832229510021120';
const discordBotGuild = '110373943822540800';
const tsubakiPalaceGuild = '335272347256881154';

const tsubakiTag = '334386617626263553';
const tsubakiReact = '343292881689378816';
const khuxTag = '135529980011610112';
const khuxReact = '343292371749961728';
const davidTag = '142037204548583424';
const davidReact = '346848029833297920';

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
const Dictionary = require('./commands/utility/Dictionary.js');

/* const Leave = require("./commands/music/Leave.js");
const Queue = require("./commands/music/Queue.js");
const Play = require("./commands/music/Play.js");
const Pause = require("./commands/music/Pause.js");
const Resume = require("./commands/music/Resume.js");
const Skip = require("./commands/music/Skip.js");
const ClearQueue = require("./commands/music/ClearQueue.js");*/

const Delete = require('./commands/admin/Delete.js');
const Kick = require('./commands/admin/Kick.js');
const Ban = require('./commands/admin/Ban.js');
const UnBan = require('./commands/admin/UnBan.js');
const Welcome = require('./commands/admin/Welcome.js');

let commands = [];

function getDb() {
  return new sqlite.Database('./data.db');
}

function getPoints(id) {
  let points = -2;
  let db = getDb();
  db.serialize(function () {
    console.log('SELECT points FROM points WHERE member_id = ' + id);
    db.each('SELECT points FROM points WHERE member_id = ' + id, function (err, row) {
      if (row !== undefined) {
        points = row.points;
        console.log('points: ' + points);
      }
    });
  });

  console.log('123: ' + points);
  if (points < 0) {
    points = 0;
    db.serialize(function () {
      console.log('INSERT INTO points VALUES (' + id + ', 0)');
      db.run('INSERT INTO points VALUES (' + id + ', 0)');
    });
  }
  console.log('456: ' + points);

  db.close(function () {
    console.log('789: ' + points);
    return points;
  });
}

function setPoints(id, points) {
  let db = getDb();
  db.serialize(function () {
    console.log('UPDATE points SET points = ' + points + ' WHERE member_id = ' + id);
    db.run('UPDATE points SET points = ' + points + ' WHERE member_id = ' + id);
  });
  db.close(function () {
    if (getLevel(points) === getLevelR(points)) {
      bot.users.get(id).send(':arrow_up: ' + Style.italicize('<@' + id + '> just leveled up to level ' + getLevelR(points) + '!'));
    }
  });
}

function getLevel(points) {
  return 0.1 * Math.sqrt(points);
}

function getLevelR(points) {
  return Math.floor(getLevel(points));
}

/* function listGuilds(message, listOfGuilds) {
  let i = 0;
  while (i != listOfGuilds.length + 1) {
    return listOfGuilds[i] + "\r\n";
    i++;
  }
  return "\nend";
}*/

function guildInfo(message, listOfGuilds) {
  let i = 0;
  let listAll = [];
  listOfGuilds.forEach(function(item) {
    listAll.push(item + '\r\n' + item.id + '\r\n');
  });
  return (listAll.join('\r\n'));
}

function cmdLogger(message, bot) {
  if (message.content.startsWith(config.prefix) && message.guild.id !== '') {
    bot.channels.get(logger).send('{0} » {1} » {2}'.format(Style.bold(message.author.tag),
      Style.underline(message.guild.name), Style.code(message.content)));
  }
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

  let db = getDb();
  db.serialize(function() {
    db.run('CREATE TABLE IF NOT EXISTS guild_join (member_id INTEGER, guild_id INTEGER)');
    db.run('CREATE TABLE IF NOT EXISTS points (member_id INTEGER, points INTEGER)');
  });
  db.close();
  //  bot.user.setGame("t-help | t-invite | Khux#6195");
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
  let memberGuild = member.guild;
  if (memberGuild.id == discordBotGuild) return;

  let db = getDb();

  let found = false;
  db.serialize(function () {
    db.each('SELECT * from guild_join WHERE member_id = ' + member.id
      + ' AND guild_id = ' + memberGuild.id, function (err, row) {
        if (row !== undefined) found = true;
      });
  })

  if (!found) {
    let welcomeEmbed = new Discord.RichEmbed()
      .setDescription('Welcome to ' + Style.bold('{0}, {1}!').format(memberGuild.name, member))
      .setColor(white);
    memberGuild.channels.find('id', channelData).send({ embed: welcomeEmbed });
    db.serialize(function () {
      db.run('INSERT INTO guild_join VALUES (' + member.id + ', ' + memberGuild.id + ')');
    })
  }
  
  db.close();
});

bot.on('message', (message) => {
  if (commands.length == 0) {
    commands = [
      ['Information', new Help(), new Stats(), new Profile(), new Invite(), new Support(), new Info(), new ChangeLog()],
      ['Fun', new EightBall(), new Say(), new Embed(), new Dice(), new Cat(), new Dog(), new Banana(), new GetBanana(), new Tts(), new Coin()],
      ['Utility', new Ping(), new Add(), new Urban(), new Dictionary()],
      /* ["Music", new Leave(), new Queue(), new Play(), new Pause(), new Resume(), new Skip(), new ClearQueue()],*/
      ['Admin', new Delete(), new Kick(), new Ban(), new UnBan(), new Welcome()/* , new Playing(), new Guild() */],/* ,
      ["Owner", new Playing(), new Guilds()]*/
    ];
  }

  if (message.author.bot) return;
  if (message.channel.type === 'dm') return;

  // chatlogger(message, bot);
  cmdLogger(message, bot);

  let lowerMsg = message.content.toLowerCase();

  /* if (lowerMsg.toLowerCase() === "help tsubaki") {
    message.channel.send("Hi there, if you need help do  ``t-help``!");
  }*/

  // Reacts
  if (lowerMsg.includesIgnoreCase(config.nameIn) || lowerMsg.includesIgnoreCase(config.name) ||
    lowerMsg.includesIgnoreCase('<@' + tsubakiTag + '>')) message.react(tsubakiReact);

  if (lowerMsg.includesIgnoreCase('khux') || lowerMsg.includesIgnoreCase('<@' + khuxTag + '>'))
    {message.react(khuxReact);}

  if (lowerMsg.includesIgnoreCase('pan') || lowerMsg.includesIgnoreCase('david') ||
    lowerMsg.includesIgnoreCase('<@' + davidTag + '>')) message.react(davidReact);

  // Correct user for old prefix
  if (lowerMsg.startsWith('t-') || lowerMsg.startsWith('tb-')) {
    message.channel.send(':exclamation: Hey, the prefix is now ' + Style.code(config.prefix) + '!');
    message.content = message.content.replace('t-', config.prefix).replace('tb-', config.prefix);
  }

  if (!message.content.startsWith(config.prefix) || message.author.id == '') return;

  let command = message.content.split(' ')[0].slice(config.prefix.length).toLowerCase();
  let args = message.content.split(' ').slice(1);

  let newPoints = getPoints(message.author.id) + 1;
  console.log('new: ' + newPoints);
  setPoints(message.author.id, newPoints);

  let found = false;

  for (let i = 0, lenI = commands.length; i < lenI && !found; i++) {
    for (let j = 1, lenJ = commands[i].length; j < lenJ && !found; j++) {
      if (command === commands[i][j].getCommand()) {
        commands[i][j].execute(message, args, bot);
        found = true;
        break;
      }
    }
  }
  if (!found) {
    message.channel.send({embed: Style.warn('Uh oh, I didn\'t find that command! Try ' + Style.code(config.prefix + new Help().getCommand()) + '.')});
  }

  /* 
  else if (command === "playing") {
    if (message.author.id != '135529980011610112') return;
    else {
      let gamemessage = args.join(" ");
      this.delete(message);
      bot.user.setGame(gamemessage);
    }
  }
  else if (command === "guilds") {
    this.delete(message);
    let guildsListing = bot.guilds.array()
    message.channel.send(`${guildInfo(message, guildsListing)}`)
  }
  else if (command === "leaveserver") {
    if (message.author.id == "135529980011610112") {
      if (args[0]) {
        let guildz = bot.guilds.get(args[0])
        message.channel.send(`Leaving server ${guildz.name}...`);
        guildz.leave();
        message.channel.send(`Left server.`);
      }
      else { message.channel.send("Please put a server id") }
    }
  }*/
});

if (!String.prototype.format) {
  String.prototype.format = function() {
    let args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) {
      return typeof args[number] != 'undefined' ? args[number] : match;
    });
  };
}

if (!String.prototype.includesIgnoreCase) {
  String.prototype.includesIgnoreCase = function(compare) {
    return this.toLowerCase().includes(compare.toLowerCase);
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
module.exports.commands = function() {
  return commands;
}
module.exports.help = function() {
  return new Help();
}
module.exports.getDb = function() {
  return getDb();
}
module.exports.getPoints = function(id) {
  return getPoints(id)
}
module.exports.setPoints = function(id, points) {
  setPoints(id, points);
}
module.exports.getLevel = function(points) {
  return getLevel(points);
}
module.exports.getLevelR = function(points) {
  return getLevelR(points);
}