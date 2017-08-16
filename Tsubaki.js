// Made by the best baddest bitch in town: Khux, and a little help from david or whatever.//

// Set up, load config
const Discord = require("discord.js");
const music = require("discord.js-music-v11");
const config = require("./config.json");
const chalk = require("chalk");
const webdict = require("webdict");
const fs = require("fs");
const Style = require("./Style.js");

const bot = new Discord.Client();

music(bot);

const logger = "341827696629776396";
const guildLogger = "342832229510021120";
const modLogger = "342837394766168064";
const discordBotGuild = "110373943822540800";
const tsubaiPalaceGuild = "335272347256881154";

const tsubakiTag = "334386617626263553";
const tsubakiReact = "343292881689378816";
const khuxTag = "135529980011610112";
const khuxReact = "343292371749961728";
const davidTag = "142037204548583424";
const davidReact = "";

// Color codes
const color = {
  white: "0xFFFFFF",
  green: "0x42F44E",
  red: "0xFF0000"
}

// Load commands
const Help = require("./commands/information/Help.js");
const Stats = require("./commands/information/Stats.js");
const Avatar = require("./commands/information/Avatar.js");
const Invite = require("./commands/information/Invite.js");
const Support = require("./commands/information/Support.js");
const Info = require("./commands/information/Info.js");
const ChangeLog = require("./commands/information/ChangeLog.js");

const EightBall = require("./commands/fun/EightBall.js");
const Say = require("./commands/fun/Say.js");
const Embed = require("./commands/fun/Embed.js");
const Dice = require("./commands/fun/Dice.js");
const Cat = require("./commands/fun/Cat.js");
const Dog = require("./commands/fun/Dog.js");
const Banana = require("./commands/fun/Banana.js");
const GetBanana = require("./commands/fun/GetBanana.js");
const Tts = require("./commands/fun/Tts.js");
const Coin = require("./commands/fun/Coin.js");

let servers = {};
let commands = [];

/*function listGuilds(message, listOfGuilds) {
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
  listOfGuilds.forEach(function (item) {
    listAll.push(item + "\r\n" + item.id + "\r\n")
  })
  return (listAll.join("\r\n"));
}

/*function chatLogger(message, bot) {
  if (message.guild.id === "335272347256881154" || message.guild.id === "334207577825214465" || message.guild.id === "110373943822540800" || message.guild.id === "337747052878626816" || message.guild.id === "292492405637251072" || message.guild.id === "232236297324855306") {
    return;//ignoring:       flamboyant,                                     galaxy,                                   discordbots,                               tsubaki logger,                            moists server                                eco
  } else {
    bot.channels.get("341835580491169792").send(`**${message.author.tag}** » __${message.guild.name}__ » \`${message.content}\``);
  }
}*/

function cmdLogger(message, bot) {
  if (message.content.startsWith(config.prefix) && message.guild.id !== "") {
    bot.channels.get(logger).send("{0} » {1} » {2}".format(Style.bold(message.author.tag),
      Style.underline(message.guild.name), Style.code(message.content)));
  }
}

bot.on("ready", () => {
  console.log(chalk.green("{0} has started, with {1} users, in {2} channels of {3} guilds."
    .format(config.name, bot.users.size, bot.channels.size, bot.guilds.size)));
  //  bot.user.setGame("t-help | t-invite | Khux#6195");
});

bot.on("guildCreate", guild => {
  let moisty = bot.channels.get(guildLogger);
  moisty.send(":thumbsup: | New guild joined: {0} (id: {1}, owned by {2}). This guild has {3} members!"
    .format(guild.name, guild.id, guild.owner, guild.memberCount));
});
bot.on("guildDelete", guild => {
  let moisty = bot.channels.get(guildLogger);
  moisty.send(":thumbsdown: | I have been removed from: " + guild.name + " (id: " + guild.id + ")");
});

bot.on("guildMemberAdd", (member) => {
  let memberGuild = member.guild;
  if (memberGuild.id == discordBotGuild) return;
  let data = require("./" + memberGuild.name + ".json");
  let guildData = data.GuildID;
  let channelData = data.channelID;

  if (memberGuild.id === tsubakiPalaceGuild) {
    member.addRole(memberGuild.roles.find("name", "Member"));
  }

  if (memberGuild.id !== data.GuildID) return;
  else {
    let welcomeEmbed = new Discord.RichEmbed()
      .setDescription("Welcome to " + Style.bold("{0}, {1}!").format(memberGuild.name, member))
      .setColor(white)
    memberGuild.channels.find("id", channelData).send({ embed: welcomeEmbed });
  }
});

bot.on('guildBanAdd', (guild, user) => {
  bot.channels.get(modLogger).send("{0} (id: {1}) was banned from: {2} (id: {3})"
    .format(user.tag, user.id, guild.name, guild.id));
});

bot.on("message", message => {
  if (commands.length == 0) {
    commands = [
      ["Information", new Help(), new Stats(), new Avatar(), new Invite(), new Support(), new Info(), new ChangeLog()] ,
      ["Fun", new EightBall(), new Say(), new Embed(), new Dice(), new Cat(), new Dog(), new Banana(), new GetBanana(), new Tts(), new Coin()]/*,
      ["Utility", new Ping(), new Add(), new Urban(), new Dictionary()],
      ["Music", new Leave(), new Queue(), new Play(), new Pause(), new Resume(), new Skip(), new ClearQueue()],
      ["Admin", new Delete(), new Kick(), new Ban(), new UnBan(), new Id(), new Welcome()],
      ["Owner", new Playing(), new Guilds()]*/
    ];
  }

  if (message.author.bot) return;
  if (message.channel.type === "dm") return;

  // chatlogger(message, bot);
  cmdLogger(message, bot);

  let lowerMsg = message.content.toLowerCase();  

  /*if (lowerMsg.toLowerCase() === "help tsubaki") {
    message.channel.send("Hi there, if you need help do  ``t-help``!");
  }*/

  // Reacts
  if (lowerMsg.includesIgnoreCase(config.nameIn) || lowerMsg.includesIgnoreCase(config.name) ||
    lowerMsg.includesIgnoreCase("<@" + tsubakiTag + ">")) message.react(tsubakiReact);

  if (lowerMsg.includesIgnoreCase("khux") || lowerMsg.includesIgnoreCase("<@" + khuxTag + ">"))
    message.react(khuxReact);

  if (lowerMsg.includesIgnoreCase("pan") || lowerMsg.includesIgnoreCase("david") ||
    lowerMsg.includesIgnoreCase("<@" + davidTag + ">")) message.react('346848029833297920');

  // Correct user for old prefix
  if (lowerMsg.startsWith("t-") || lowerMsg.startsWith("tb-")) {
    message.channel.send(":exclamation: Hey, the prefix is now " + Style.code(config.prefix) + "!");
    message.content = message.content.replace("t-", config.prefix).replace("tb-", config.prefix);
  }

  if (!message.content.startsWith(config.prefix) || message.author.id == "") return;
  
  let command = message.content.split(" ")[0].slice(config.prefix.length).toLowerCase();
  let args = message.content.split(" ").slice(1);
  
  let points = JSON.parse(fs.readFileSync("./points.json", "utf8"));
  if (!points[message.author.id]) points[message.author.id] = {
    points: 0,
    level: 0
  };
  let userData = points[message.author.id];
  userData.points++;
  let curLevel = Math.floor(0.1 * Math.sqrt(userData.points));
  if (curLevel > userData.level) {
    userData.level = curLevel;
    message.reply(":arrow_up: | " + Style.italicize("You've just leveled up to level " + curLevel + "!"));
  }

  let found = false;

  for (let i = 0, lenI = commands.length; i < lenI && !found; i++) {
    for (let j = 1, lenJ = commands[i].length; j < lenJ && !found; j++) {
      if (command === commands[i][j].getCommand()) {
        commands[i][j].execute(message, args, bot, points);
        found = true;
        break;
      }
    }
  }
  if (!found) {
    var embed = new Discord.RichEmbed()
      .setDescription(":exclamation: Uh oh, I didn't find that command! Try " + config.prefix + new Help().getCommand() + ".")
      .setColor(color.red)
    message.channel.send({ embed: embed });
  }  
  
  /* if (command === "welcome") {
    let hasAdmin = message.member.hasPermission('ADMINISTRATOR');
    let suffix = message.content.split(' ').slice(1)[1];

    if (message.content == `${config.prefix}welcome`) return message.channel.send('t-welcome `<enable | disable> (Channel ID)`');
    if (hasAdmin) {
      if (message.content.toLowerCase().startsWith(`${config.prefix}welcome enable`)) {
        if (!suffix || suffix == '' || suffix === undefined) return message.channel.send(':exclamation: | Provide a `channel ID` to send the welcome message to.');
        if (!message.guild.channels.find('id', suffix)) return message.channel.send(`:x: | I couldn't find a channel with the ID of \`${suffix}\`.`);
        else {
          message.channel.send(`:thumbsup: | Welcome messages will now be sent to channel <#${suffix}>`);
          let guildID = message.guild.id;
          let WCData = {
            'GuildID': `${message.guild.id}`,
            'channelID': suffix
          }
          fs.writeFile(`${message.guild.name}.json`, JSON.stringify(WCData), (err) => {
            if (err) console.error(err)
          });
        }
      }
    }
    else {
      let welcomeEmbed = new Discord.RichEmbed()
        .setDescription(`You don't have the permission 'ADMINISTRATOR'!");`)
        .setColor("Tsubaki.color.red")
      message.channel.send({ embed: embed });
    }
    if (message.content.toLowerCase().startsWith(`${config.prefix}welcome disable`)) {
      if (hasAdmin) {

        fs.stat(`./${message.guild.name}.json`, function (err) {
          if (err) {
            console.log(err);
          }
        });
        fs.unlink(`./${message.guild.name}.json`, function (err) {
          if (err) return console.log(err);
          else {
            message.channel.send('Welcome messages now `disabled` for this guild.');
          }
        });
      }
      else {
        let welcomeEmbed = new Discord.RichEmbed()
          .setDescription(`You don't have the permission 'ADMINISTRATOR'!");`)
          .setColor("Tsubaki.color.red")
        message.channel.send({ embed: embed });
      }
    }
  }
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  else if (command === "add") {
    let numArray = args.map(n => parseInt(n));
    let total = numArray.reduce((p, c) => p + c);

    message.channel.send(total);
  }
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  else if (command === "say") {
    this.delete(message);
    message.channel.send(args.join(" "), { tts: false });
  }
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  else if (command === "playing") {
    if (message.author.id != '135529980011610112') return;
    else {
      let gamemessage = args.join(" ");
      this.delete(message);
      bot.user.setGame(gamemessage);
    }
  }
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  else if (command === "embed") {
    let embed = new Discord.RichEmbed()
      .setDescription(args.join(" "))
      .setColor(Tsubaki.color.green)
    message.channel.send({ embed: embed });
    this.delete(message);
  }
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  else if (command === "ping") {
    this.delete(message);
    message.channel.send(":ping_pong: | Pong! ``" + (bot.ping) + " ms``");
  }
  //Math.round in from of (bot.ping) if u want the number rounded
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  else if (command === "delete") {
    let msg;
    if (!args[0]) {
      message.channel.sendMessage(":grey_question: | How many?");
    }
    else if (args[0] > 99) {
      message.channel.sendMessage(":exclamation: | Cannot delete 100 messages or more");
    }
    else {
      if (args[0] < 100) {
        msg = (parseInt(args[0]) + 1);
        message.channel.fetchMessages({ limit: msg }).then(messages => message.channel.bulkDelete(messages)).catch(console.error);
      }
      else {
        message.channel.sendMesage(":exclamation: | Nummber of messages to delete cannot go over 100! Use " + config.prefix + "reset instead!");
      }
    }
  }
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  else if (command === "kick") {
    let hasAdmin = message.member.hasPermission('ADMINISTRATOR');
    if (hasAdmin) {
      if (!args[0]) return message.channel.send(":exclamation: | Mention the player to kick!");
      let userToKick = message.mentions.users.first();
      let userID = userToKick.id;
      if (userToKick == "" || userToKick === undefined) return message.channel.send(":exclamation: | Mention someone to kick!");

      let isKickable = message.guild.member(userToKick).kickable;

      let reason = args.slice(1).join(" ");
      if (reason.length < 1) return message.channel.send(":boot: | You must supply a reason for the kick!");

      if (isKickable || userID.Kickable) {
        message.guild.member(userToKick.id).send(`:boot: | You have been **kick** by **${message.author}** for: **${reason}**`);
        message.guild.member(userToKick).kick(7, args.join(" "));
        message.channel.send(`:boot: | ${userToKick.username} has been **kicked** by **${message.author.tag}** for: **${reason}**`);
      }
      else if (!isKickable || !(userID.kickable)) {
        message.channel.send(`:exclamation: | User cannot be kicked by **${message.author.tag}**`);

      }
      else {
        message.channel.send("Bigger Problem Inside")
      }
    }
    else if (!hasAdmin) {
      message.channel.send(':no_entry: | No permission silly!');
    }
    else {
      message.channel.send("Bigger Problem outside")
    }
  }
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  else if (command === "ban") {
    let hasAdmin = message.member.hasPermission('ADMINISTRATOR');
    if (hasAdmin) {
      if (!args[0]) return message.channel.send(":exclamation: | Mention the player to ban!");
      let userToBan = message.mentions.users.first();
      let userID = userToBan.id;
      if (userToBan == "" || userToBan === undefined) return message.channel.send(":exclamation: | Mention someone to ban!");

      let isBannable = message.guild.member(userToBan).bannable;

      let reason = args.slice(1).join(" ");
      if (reason.length < 1) return message.channel.send(":hammer: | You must supply a reason for the ban!");

      if (isBannable || userID.bannable) {
        message.guild.member(userToBan.id).send(`:hammer: | You have been **banned** by **${message.author}** for: **${reason}**`);
        message.guild.member(userToBan).ban(7, args.join(" "));
        message.channel.send(`:hammer: | ${userToBan.username} has been **banned** by **${message.author.tag}** for: **${reason}**`);
      }
      else if (!isBannable || !(userID.bannable)) {
        message.channel.send(`:exclamation: | User cannot be banned by **${message.author.tag}**`);

      }
      else {
        message.channel.send("Bigger Problem Inside")
      }
    }
    else if (!hasAdmin) {
      message.channel.send(':no_entry: | No permission silly!');
    }
    else {
      message.channel.send("Bigger Problem outside")
    }
  }
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  else if (command === "invite") {
    this.delete(message);
    let embed = new Discord.RichEmbed()
      .setDescription('```css\nInvite ' + `${config.name}` + ' to your server!\n```' + `${'\r\n'}` + '' + `${'\r\n'}` + '**' + `${config.name}` + ' Information:**' + `${'\r\n'}` + `${config.name}` + ' is a Discord.js bot that you can have fun with _and_ moderate with. In your server do `t-help` and a list of all my command will pop up.')
      .addField(`**${config.name}'s Help Server**`, `[Click Here to join](https://discord.gg/Gf7hb33)`)
      .addField(`${config.name} Invitation Link`, `[Click Here to Invite](https://discordapp.com/oauth2/authorize?client_id=334386617626263553&scope=bot&permissions=305196094)`, true)
      .setColor(Tsubaki.color.green)
    message.author.sendEmbed(embed);
  }
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  else if (command === "unban") {
    let hasAdmin = message.member.hasPermission('ADMINISTRATOR');
    if (hasAdmin) {
      let reason = args.slice(1).join(" ");
      let userToUnban = args[0];
      let userPM = message.mentions.users.first();
      if (reason.length < 1) return message.channel.send("You must supply a reason for the unban after you supply the user id.\nt-ban `userID` Reason");
      message.guild.unban(userToUnban);
      message.channel.send("User Pardoned");
      //DobbyID.channel.send(`You have been **Pardoned** by ${message.author} for ${reason}`);
    }
  }
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  else if (command === "id") {
    let memberID = message.mentions.users.first();
    if (!args[0]) {
      message.channel.send(":exclamation: | Mention the person to return the ID of!")
    }
    else if (args[0] === undefined || args[0] == "") {
      message.channel.send(":exclamation: | Please mention a valid user");
    }
    else {
      let embed = new Discord.RichEmbed()
        .setDescription(`${memberID.id}`)
        .setColor(Tsubaki.color.green)
      message.channel.send({ embed: embed });
    }
  }
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  else if (command === '8ball') {
    let ball = message.content.split(' ')[1];
    let balls = [
      ':crystal_ball: | **It is certain!**',
      ':crystal_ball: | **It is decidedly so!**',
      ':crystal_ball: | **Without a doubt!**',
      ':crystal_ball: | **Yes, definitely!**',
      ':crystal_ball: | **As I see it, yes.**',
      ':crystal_ball: | **You may rely on it.**',
      ':crystal_ball: | **Most likely.**',
      ':crystal_ball: | **Outlook good!**',
      ':crystal_ball: | **Yes.**',
      ':crystal_ball: | **Signs point to yes.**',
      ':crystal_ball: | **Reply hazy, try again.**',
      ':crystal_ball: | **Ask again later.**',
      ':crystal_ball: | **Better now tell you now!**',
      ':crystal_ball: | **Cannot predict now.**',
      ':crystal_ball: | **Concentrate and ask again!**',
      ":crystal_ball: | **Don't count on it!**",
      ':crystal_ball: | **My reply is no.**',
      ':crystal_ball: | **My sources say no.**',
      ':crystal_ball: | **Outlook not so good.**',
      ':crystal_ball: | **Very doubful.**'
    ]
    if (ball == '' || ball === undefined) return message.channel.send(":eye_in_speech_bubble: | _Give me a question!_");
    else {
      message.channel.send(balls[Math.floor(Math.random() * balls.length)]);
    }
  }
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  else if (command === 'profile') {
    this.delete(message);
    let profileMention = message.mentions.users.first();
    if (profileMention == '' || profileMention === undefined) return message.channel.send("Mention the person that you want the profile from!");
    else {
      let profileEmbedAuthor = message.mentions.users.first().username
      let profileEmbed = new Discord.RichEmbed()
        .setDescription(`Profile of ${profileMention}`)
        .setImage(`${profileMention.avatarURL}`)
        .setColor(Tsubaki.color.green)
      message.channel.send({ embed: profileEmbed });
    }
  }
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  else if (command === "guilds") {
    this.delete(message);
    let guildsListing = bot.guilds.array()
    message.channel.send(`${guildInfo(message, guildsListing)}`)
  }
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  else if (command === "cmds") {
    this.delete(message);
    if (!args[0]) {
      let embed = new Discord.RichEmbed()
        .setDescription("Which command would you like to see more of? **Example:** `t-cmds help`")
        .setColor('eef442')
      message.channel.send({ embed: embed });
    }
    else if (args[0] == "ping") {
      let embed = new Discord.RichEmbed()
        .setDescription("**Command:** `ping`\n**Description:** Returns " + `${config.name}` + "'s ping.\n\n**Usage:** `t-ping`")
        .setColor(Tsubaki.color.green)
      message.channel.send({ embed: embed });
    }
    else if (args[0] == "invite") {
      let embed = new Discord.RichEmbed()
        .setDescription("**Command:** `invite`\n**Description:** " + `${config.name}` + " will private message you information about her, including her invite link.\n\n**Usage:** `t-invite`")
        .setColor(Tsubaki.color.green)
      message.channel.send({ embed: embed });
    }
    else if (args[0] == "help") {
      let embed = new Discord.RichEmbed()
        .setDescription("**Command:** `help`\n**Description:** Displays help list.\n\n**Usage:** `t-help`")
        .setColor(Tsubaki.color.green)
      message.channel.send({ embed: embed });
    }
    else if (args[0] == "8ball") {
      let embed = new Discord.RichEmbed()
        .setDescription("**Command:** `8ball`\n**Description:** " + `${config.name}` + " will give you answers to yes or no questions.\n\n**Usage:** `t-8ball <Question>`")
        .setColor(Tsubaki.color.green)
      message.channel.send({ embed: embed });
    }
    else if (args[0] == "add") {
      let embed = new Discord.RichEmbed()
        .setDescription("**Command:** `add`\n**Description:** Will add numbers given.\n\n**Usage:** `t-add <1 & 5|2 & 4 & 6>`")
        .setColor(Tsubaki.color.green)
      message.channel.send({ embed: embed });
    }
    else if (args[0] == "say") {
      let embed = new Discord.RichEmbed()
        .setDescription("**Command:** `say`\n**Description:** " + `${config.name}` + " will say any message given.\n\n**Usage:** `t-say <Any sentence or words>`")
        .setColor(Tsubaki.color.green)
      message.channel.send({ embed: embed });
    }
    else if (args[0] == "embed") {
      let embed = new Discord.RichEmbed()
        .setDescription("**Command:** `embed`\n**Description:** Will embed any message given.\n\n**Usage:** `t-embed <Any sentence or word>`")
        .setColor(Tsubaki.color.green)
      message.channel.send({ embed: embed });
    }
    else if (args[0] == "dice") {
      let embed = new Discord.RichEmbed()
        .setDescription("**Command:** `dice`\n**Description:** " + `${config.name}` + " will roll the dice and give you a random number.\n\n**Usage:** `t-dice`")
        .setColor(Tsubaki.color.green)
      message.channel.send({ embed: embed });
    }
    else if (args[0] == "delete") {
      let embed = new Discord.RichEmbed()
        .setDescription("**Command:** `delete`\n**Description:** Will delete given number of messages.\n\n**Usage:** `t-delete <Greater than 1, less that 100>`")
        .setColor(Tsubaki.color.green)
      message.channel.send({ embed: embed });
    }
    else if (args[0] == "kick") {
      let embed = new Discord.RichEmbed()
        .setDescription("**Command:** `kick`\n**Description:** Will kick mentioned player.\n\n**Usage:** `t-kick <@mention>`")
        .setColor(Tsubaki.color.green)
      message.channel.send({ embed: embed });
    }
    else if (args[0] == "ban") {
      let embed = new Discord.RichEmbed()
        .setDescription("**Command:** `ban`\n**Description:** Will ban mentioned player.\n\n**Usage:** `t-ban <@mention>`")
        .setColor(Tsubaki.color.green)
      message.channel.send({ embed: embed });
    }
    else if (args[0] == "unban") {
      let embed = new Discord.RichEmbed()
        .setDescription("**Command:** `unban`\n**Description:** Will unban the user you give the id for.\n\n**Usage:** `t-unban <player id>`")
        .setColor(Tsubaki.color.green)
      message.channel.send({ embed: embed });
    }
    else if (args[0] == "id") {
      let embed = new Discord.RichEmbed()
        .setDescription("**Command:** `id`\n**Description:** Will show id of mentioned player.\n\n**Usage:** `t-id <@mention>`")
        .setColor(Tsubaki.color.green)
      message.channel.send({ embed: embed });
    }
    else if (args[0] == "stats") {
      let embed = new Discord.RichEmbed()
        .setDescription("**Command:** `stats`\n**Description:** Will show guilds, users, and channels " + `${config.name}` + " is in.\n\n**Usage:** `t-stats`")
        .setColor(Tsubaki.color.green)
      message.channel.send({ embed: embed });
    }
    else if (args[0] == "profile") {
      let embed = new Discord.RichEmbed()
        .setDescription("**Command:** `profile`\n**Description:** Will show you profile picture of mentioned user.\n\n**Usage:** `t-profile <@mention>`")
        .setColor(Tsubaki.color.green)
      message.channel.send({ embed: embed });
    }
    else if (args[0] == "dog") {
      let embed = new Discord.RichEmbed()
        .setDescription("**Command:** `dog`\n**Description:** Will give random picture of a dog.\n\n**Usage:** `t-dog`")
        .setColor(Tsubaki.color.green)
      message.channel.send({ embed: embed });
    }
    else if (args[0] == "cat") {
      let embed = new Discord.RichEmbed()
        .setDescription("**Command:** `cat`\n**Description:** Will give random picture of a cat.\n\n**Usage:** `t-cat`")
        .setColor(Tsubaki.color.green)
      message.channel.send({ embed: embed });
    }
    else if (args[0] == "banana") {
      let embed = new Discord.RichEmbed()
        .setDescription("**Command:** `banana`\n**Description:** Will give mentioned player banana.\n\n**Usage:** `t-banana <@mention>`")
        .setColor(Tsubaki.color.green)
      message.channel.send({ embed: embed });
    }
    else if (args[0] == "urban") {
      let embed = new Discord.RichEmbed()
        .setDescription("**Command:** `urban`\n**Description:** Will define any word using Urban Dictionary.\n\n**Usage:** `t-urban <word>`")
        .setColor(Tsubaki.color.green)
      message.channel.send({ embed: embed });
    }
    else if (args[0] == "dictionary") {
      let embed = new Discord.RichEmbed()
        .setDescription("**Command:** `dictionary`\n**Description:** Will define any word using traditonal dictionary.\n\n**Usage:** `t-dictionary <word>`")
        .setColor(Tsubaki.color.green)
      message.channel.send({ embed: embed });
    }
    else if (args[0] == "support") {
      let embed = new Discord.RichEmbed()
        .setDescription("**Command:** `support`\n**Description:** " + `${config.name}` + " will private message you the support server link.\n\n**Usage:** `t-support`")
        .setColor(Tsubaki.color.green)
      message.channel.send({ embed: embed });
    }
    else if (args[0] == "tts") {
      let embed = new Discord.RichEmbed()
        .setDescription("**Command:** `tts`\n**Description:** Will say any message aloud.\n\n**Usage:** `t-tts <Any sentence or word>`")
        .setColor(Tsubaki.color.green)
      message.channel.send({ embed: embed });
    }
    else if (args[0] == "getbanana") {
      let embed = new Discord.RichEmbed()
        .setDescription("**Command:** `getbanana`\n**Description:** Will give you a banana, and list your current bananas.\n\n**Usage:** `t-getbanana`")
        .setColor(Tsubaki.color.green)
      message.channel.send({ embed: embed });
    }
    else if (args[0] == "cmds") {
      let embed = new Discord.RichEmbed()
        .setDescription("**Command:** `cmds`\n**Description:** Will show you information about commands.\n\n**Usage:** `t-cmds <command>`")
        .setColor(Tsubaki.color.green)
      message.channel.send({ embed: embed });
    }
    else if (args[0] == "coin") {
      let embed = new Discord.RichEmbed()
        .setDescription("**Command:** `coin`\n**Description:** " + `${config.name}` + " will flip a coin for you.\n\n**Usage:** `t-coin`")
        .setColor(Tsubaki.color.green)
      message.channel.send({ embed: embed });
    }
    else if (args[0] == "welcome") {
      let embed = new Discord.RichEmbed()
        .setDescription("**Command:** `welcome`\n**Description:** Toggle welcome messages.\n\n**Usage:** `t-welcome <enable | disable> (Channel ID)`")
        .setColor(Tsubaki.color.green)
      message.channel.send({ embed: embed });
    }
    else if (args[0] == "info") {
      let embed = new Discord.RichEmbed()
        .setDescription("**Command:** `info`\n**Description:** Shows " + `${config.name}` + "'s information.\n\n**Usage:** `t-info`")
        .setColor(Tsubaki.color.green)
      message.channel.send({ embed: embed });
    }
    else if (args[0] == "changelog") {
      let embed = new Discord.RichEmbed()
        .setDescription("**Command:** `changelog`\n**Description:** Shows " + `${config.name}` + "'s change logs.\n\n**Usage:** `t-changelog`")
        .setColor(Tsubaki.color.green)
      message.channel.send({ embed: embed });
    }
    else {
      let embed = new Discord.RichEmbed()
        .setDescription(":exclamation: | I am sorry, I did not understand what you said. Please try again!")
        .setColor('ff0000')
      message.channel.send({ embed: embed });
    }
  }
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  else if (command === 'dice') {
    this.delete(message);
    let number = message.content.split(' ')[1];
    let numbers = [
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
    ]
    message.channel.send(":game_die: | You rolled a " + (numbers[Math.floor(Math.random() * numbers.length)]));
  }
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  else if (command === 'cat') {
    this.delete(message);
    random.cat().then(url => message.channel.send(url)).catch(err => console.log(err.message));
  }
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  else if (command === 'dog') {
    this.delete(message);
    random.dog().then(url => message.channel.send(url)).catch(err => console.log(err.message));
  }
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  else if (command === "banana") {
    this.delete(message);
    let memberMention = message.mentions.users.first();
    if (memberMention == message.author) return message.channel.send(":x: | Don't be greedy, sweetie~ :kissing_heart:");
    if (memberMention == '' || memberMention === undefined) return message.channel.send("Mention a player to give a banana!");

    else message.channel.send(":banana: | " + `${message.author.tag}` + " has given " + `${memberMention}` + " a banana!");
  }
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  else if (command === "urban") {
    this.delete(message);
    let toDefine = message.content.split(' ')[1];
    if (toDefine == "" || toDefine === undefined) return message.channel.send(":book: | Provide a word to urban define!");
    else {
      webdict("urbandictionary", toDefine).then(resp => {
        let result = resp.definition[0];
        let guildEmbed = new Discord.RichEmbed()
          .setDescription("**Word:** " + '`' + `${toDefine}` + '` ' + `${'\r\n'}**Urban Definition:**` + ' ' + `${result}` + '')
          .setColor(Tsubaki.color.green)
          .setFooter(`${config.name} Dictionary`)
        message.channel.send({ embed: guildEmbed });
      });
    }
  }
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  else if (command === "dictionary") {
    this.delete(message);
    let toDefine = message.content.split(' ')[1];
    if (toDefine == "" || toDefine === undefined) return message.channel.send(":book: | Provide a word to urban define!");
    else {
      webdict("dictionary", toDefine).then(resp => {
        let result = resp.definition[0];
        let guildEmbed = new Discord.RichEmbed()
          .setDescription("**Word:** " + '`' + `${toDefine}` + '` ' + `${'\r\n'}**Definition:**` + ' ' + `${result}` + '')
          .setColor(Tsubaki.color.green)
          .setFooter(`${config.name} Dictionary`)
        message.channel.send({ embed: guildEmbed });
      });
    }
  }
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  else if (command === "support") {
    this.delete(message);
    let embed = new Discord.RichEmbed()
      .setDescription('```js\n"Have Questions or need help?"\n```' + `${'\r\n'}` + '' + `${'\r\n'}` + '**' + `${config.name}` + ' Information:**' + `${'\r\n'}` + `${config.name}` + ' is a Discord.js bot that you can have fun with _and_ moderate with. In your do `t-help` and a list of all my command will pop up.')
      .addField(`**${config.name}'s Help Server**`, `[Click Here to join](https://discord.gg/Gf7hb33)`)
      .setColor(Tsubaki.color.green)
    message.author.sendEmbed(embed);
  }
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  else if (command === "tts") {
    this.delete(message);
    message.channel.send(args.join(" "), { tts: true });
  }
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  else if (command === "getbanana") {
    this.delete(message);
    message.reply(' | _You are currently Banana level_' + ' `' + `${userData.level}` + '` ' + '_, with_' + ' `' + `${userData.points}` + '` ' + 'Bananas!');
  }
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  else if (command === "stats") {
    this.delete(message);
    let guildEmbed = new Discord.RichEmbed()
      .setDescription('`' + `${config.name}` + '` Guild Stats:')
      .addField('Guilds', `${bot.guilds.size}`)//${bot.guilds.size} //old: `48`
      .addField('Users', `${bot.users.size}`)
      .addField('Channels', `${bot.channels.size}`)
      .setColor(Tsubaki.color.green)
      .setFooter(`${config.name}` + ' Stats')
    message.channel.send({ embed: guildEmbed });
  }
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  else if (command === "info") {
    this.delete(message);
    let guildEmbed = new Discord.RichEmbed()
      .setDescription("**Information About " + `${config.name}` + "**\n\n     " + `${config.name}` + " is a **Discord.js** bot. She can be used for moderation, administration, utility, and just for fun. She has a wide range of commands everyone will enjoy, and she is constantly being updated and added to.")
      .setColor(0xFFFFFF)
    message.channel.send({ embed: guildEmbed });
  }
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  else if (command === "changelog") {
    this.delete(message);
    let guildEmbed = new Discord.RichEmbed()
      .setDescription("not done ;)")
      .setColor(0xFFFFFF)
    message.channel.send({ embed: guildEmbed });
  }
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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
  }
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  else if (command === 'coin') {
    this.delete(message);
    let coin = message.content.split(' ')[1];
    let coins = [
      '**Heads!**',
      '**Tails!**',
    ]
    message.channel.send(":fingers_crossed: | You flipped a coin and it landed on...  " + (coins[Math.floor(Math.random() * coins.length)]));
  }
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  else if (command === "help") {
    this.delete(message);
    let guildEmbed = new Discord.RichEmbed()
      .setDescription("**" + `${config.name}` + " Command List**\n\nDo **t-cmds [command]** and replace **[command]** with any command you want to learn more about.\n\n**Core-** " + "`" + "help" + "`" + " " + "`" + "ping" + "`" + "\n**Fun-** " + "`" + "8ball" + "`" + " " + "`" + "say" + "`" + " " + "`" + "embed" + "`" + " " + "`" + "dice" + "`" + " " + "`" + "cat" + "`" + " " + "`" + "dog" + "`" + " " + "`" + "banana" + "`" + " " + "`" + "tts" + "`" + " " + "`" + "getbanana" + "`" + " " + "`" + "coin" + "`" + "\n**Utility-** " + "`" + "add" + "`" + " " + "`" + "urban" + "`" + " " + "`" + "dictionary" + "`" + " " + "`" + "cmds" + "`" + "" + "\n**Admin-** " + "`" + "delete" + "`" + " " + "`" + "kick" + "`" + " " + "`" + "ban" + "`" + " " + "`" + "unban" + "`" + " " + "`" + "id" + "`" + " " + "`" + "welcome" + "`" + "\n**Information-** " + "`" + "stats" + "`" + " " + "`" + "profile" + "`" + " " + "`" + "invite" + "`" + " " + "`" + "support" + "`" + " " + "`" + "info" + "`" + " " + "`" + "changelog" + "`" + "\n**Music-** `leave` `queue` `play` `pause` `resume` `skip` `clearqueue`\n**Disabled-** `cid` `gid` `music`" + "\n\nYou can also talk to " + `${config.name}` + " by saying **Hi " + `${config.name}` + "**, **Help " + `${config.name}` + "**, or **" + `${config.name}` + "**.\n")
      .setColor(Tsubaki.color.green)
    message.channel.send({ embed: guildEmbed });
  } */
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  fs.writeFile("./points.json", JSON.stringify(points), (err) => {
    if (err) console.error(err)
  });
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
});

if (!String.prototype.format) {
  String.prototype.format = function () {
    let args = arguments;
    return this.replace(/{(\d+)}/g, function (match, number) {
      return typeof args[number] != 'undefined' ? args[number] : match;
    });
  };
}

if (!String.prototype.includesIgnoreCase) {
  String.prototype.includesIgnoreCase = function (compare) {
    return this.toLowerCase().includes(compare.toLowerCase);
  };
}

bot.login(config.token);

module.exports.prefix = config.prefix,
module.exports.name = config.name;
module.exports.nameIn = config.nameIn;
module.exports.color = color;
module.exports.commands = function () {
  return commands;
};
module.exports.Style = Style;