// Made by the best baddest bitch in town: Khux, and a little help from david or whatever.//

// Set up, load config
const Discord = require("discord.js");
const random = require("random-animal");
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
const white = "0xFFFFFF";
const green = "0x42F44E";

// Load commands
const Help = require("./commands/information/Help.js");
const Stats = require("./commands/information/Help.js");
const Avatar = require("./commands/information/Avatar.js");
const Invite = require("./commands/information/Invite.js");
const Support = require("./commands/information/Support.js");
const Info = require("./commands/information/Info.js");
const Changelog = require("./commands/information/Changelog.js");

var servers = {};
var commands = [
  ["Information", new Help(), new Stats(), new Avatar(), new Invite(), new Support(), new Info(), new Changelog()],
  ["Fun", new 8ball(), new Say(), new Embed(), new Dice(), new Cat(), new Dog(), new Banana(), new GetBanana(), new Tts(), new Coin()],
  ["Utility", new Ping(), new Add(), new Urban(), new Dictionary(), new Cmds()],
  ["Admin", new Delete(), new Kick(), new Ban(), new Unban(), new Id(), new Welcome()],
  ["Music", new Leave(), new Queue(), new Play(), new Pause(), new Resume(), new Skip(), new ClearQueue()],
  ["Disabled", new Cid(), new Gid(), new Music()]
];

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
    bot.channels.get(logger).send("{0} » {1} » {2}".format(Style.bold(message.author.tag), Style.underline(message.guild.name), Style.code(message.content)));
  }
}

bot.on("ready", () => {
  console.log(chalk.Tsubaki.green("{0} has started, with {1} users, in {2} channels of {3} guilds.".format(config.name, bot.users.size, bot.channels.size, bot.guilds.size)));
  //  bot.user.setGame("t-help | t-invite | Khux#6195");
});

bot.on("guildCreate", guild => {
  var moisty = bot.channels.get(guildLogger);
  moisty.send(":thumbsup: | New guild joined: {0} (id: {1}, owned by {2}). This guild has {3} members!".format(guild.name, guild.id, guild.owner, guild.memberCount));
});
bot.on("guildDelete", guild => {
  var moisty = bot.channels.get(guildLogger);
  moisty.send(":thumbsdown: | I have been removed from: " + guild.name + " (id: " + guild.id + ")");
});

bot.on("guildMemberAdd", (member) => {
  var memberGuild = member.guild;
  if (memberGuild.id == discordBotGuild) return;
  let data = require("./" + memberGuild.name + ".json");
  let guildData = data.GuildID;
  let channelData = data.channelID;

  if (memberGuild.id === tsubakiPalaceGuild) {
    member.addRole(memberGuild.roles.find("name", "Member"));
  }

  if (memberGuild.id !== data.GuildID) return;
  else {
    var welcomeEmbed = new Discord.RichEmbed()
      .setDescription("Welcome to " + Style.bold("{0}, {1}!").format(memberGuild.name, member))
      .setColor(white)
    memberGuild.channels.find("id", channelData).send({ embed: welcomeEmbed });
  }
});

bot.on('guildBanAdd', (guild, user) => {
  bot.channels.get(modLogger).send("{0} (id: {1}) was banned from: {2} (id: {3})".format(user.tag, user.id, guild.name, guild.id));
});

bot.on("message", message => {

  if (message.author.bot) return;
  if (message.channel.type === "dm") return;

  // chatlogger(message, bot);
  cmdLogger(message, bot);

  let lowerMsg = message.content.toLowerCase();  

  /*if (lowerMsg.toLowerCase() === "help tsubaki") {
    message.channel.send("Hi there, if you need help do  ``t-help``!");
  }*/

  if (lowerMsg.includesIgnoreCase(config.nameIn) || lowerMsg.includesIgnoreCase(config.name) || lowerMsg.includesIgnoreCase("<@" + tsubakiTag + ">")) message.react(tsubakiReact);
  if (lowerMsg.includesIgnoreCase("khux") || lowerMsg.includesIgnoreCase("<@" + khuxTag + ">")) message.react(khuxReact);
  if (lowerMsg.includesIgnoreCase("pan") || lowerMsg.includesIgnoreCase("david") || lowerMsg.includesIgnoreCase("<@" + davidTag + ">")) message.react('346848029833297920');
  if (lowerMsg.startsWith("t-")) {
    message.channel.send(":exclamation: Hey, the prefix is now " + Style.code("t:") + "!");
    message.content = message.content.replace("t-", "t:");
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
      var welcomeEmbed = new Discord.RichEmbed()
        .setDescription(`You don't have the permission 'ADMINISTRATOR'!");`)
        .setColor("0xFF0000")
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
        var welcomeEmbed = new Discord.RichEmbed()
          .setDescription(`You don't have the permission 'ADMINISTRATOR'!");`)
          .setColor("0xFF0000")
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
    _super.delete();
    message.channel.send(args.join(" "), { tts: false });
  }
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  else if (command === "playing") {
    if (message.author.id != '135529980011610112') return;
    else {
      let gamemessage = args.join(" ");
      _super.delete();
      bot.user.setGame(gamemessage);
    }
  }
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  else if (command === "embed") {
    var embed = new Discord.RichEmbed()
      .setDescription(args.join(" "))
      .setColor(Tsubaki.green)
    message.channel.send({ embed: embed });
    _super.delete();
  }
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  else if (command === "ping") {
    _super.delete();
    message.channel.send(":ping_pong: | Pong! ``" + (bot.ping) + " ms``");
  }
  //Math.round in from of (bot.ping) if u want the number rounded
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  else if (command === "delete") {
    var msg;
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
    _super.delete();
    var embed = new Discord.RichEmbed()
      .setDescription('```css\nInvite ' + `${config.name}` + ' to your server!\n```' + `${'\r\n'}` + '' + `${'\r\n'}` + '**' + `${config.name}` + ' Information:**' + `${'\r\n'}` + `${config.name}` + ' is a Discord.js bot that you can have fun with _and_ moderate with. In your server do `t-help` and a list of all my command will pop up.')
      .addField(`**${config.name}'s Help Server**`, `[Click Here to join](https://discord.gg/Gf7hb33)`)
      .addField(`${config.name} Invitation Link`, `[Click Here to Invite](https://discordapp.com/oauth2/authorize?client_id=334386617626263553&scope=bot&permissions=305196094)`, true)
      .setColor(Tsubaki.green)
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
      var embed = new Discord.RichEmbed()
        .setDescription(`${memberID.id}`)
        .setColor('Tsubaki.green')
      message.channel.send({ embed: embed });
    }
  }
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  else if (command === '8ball') {
    let ball = message.content.split(' ')[1];
    var balls = [
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
    _super.delete();
    let profileMention = message.mentions.users.first();
    if (profileMention == '' || profileMention === undefined) return message.channel.send("Mention the person that you want the profile from!");
    else {
      let profileEmbedAuthor = message.mentions.users.first().username
      var profileEmbed = new Discord.RichEmbed()
        .setDescription(`Profile of ${profileMention}`)
        .setImage(`${profileMention.avatarURL}`)
        .setColor(Tsubaki.green)
      message.channel.send({ embed: profileEmbed });
    }
  }
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  else if (command === "guilds") {
    _super.delete();
    var guildsListing = bot.guilds.array()
    message.channel.send(`${guildInfo(message, guildsListing)}`)
  }
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  else if (command === "cmds") {
    _super.delete();
    if (!args[0]) {
      var embed = new Discord.RichEmbed()
        .setDescription("Which command would you like to see more of? **Example:** `t-cmds help`")
        .setColor('eef442')
      message.channel.send({ embed: embed });
    }
    else if (args[0] == "ping") {
      var embed = new Discord.RichEmbed()
        .setDescription("**Command:** `ping`\n**Description:** Returns " + `${config.name}` + "'s ping.\n\n**Usage:** `t-ping`")
        .setColor('Tsubaki.green')
      message.channel.send({ embed: embed });
    }
    else if (args[0] == "invite") {
      var embed = new Discord.RichEmbed()
        .setDescription("**Command:** `invite`\n**Description:** " + `${config.name}` + " will private message you information about her, including her invite link.\n\n**Usage:** `t-invite`")
        .setColor('Tsubaki.green')
      message.channel.send({ embed: embed });
    }
    else if (args[0] == "help") {
      var embed = new Discord.RichEmbed()
        .setDescription("**Command:** `help`\n**Description:** Displays help list.\n\n**Usage:** `t-help`")
        .setColor('Tsubaki.green')
      message.channel.send({ embed: embed });
    }
    else if (args[0] == "8ball") {
      var embed = new Discord.RichEmbed()
        .setDescription("**Command:** `8ball`\n**Description:** " + `${config.name}` + " will give you answers to yes or no questions.\n\n**Usage:** `t-8ball <Question>`")
        .setColor('Tsubaki.green')
      message.channel.send({ embed: embed });
    }
    else if (args[0] == "add") {
      var embed = new Discord.RichEmbed()
        .setDescription("**Command:** `add`\n**Description:** Will add numbers given.\n\n**Usage:** `t-add <1 & 5|2 & 4 & 6>`")
        .setColor('Tsubaki.green')
      message.channel.send({ embed: embed });
    }
    else if (args[0] == "say") {
      var embed = new Discord.RichEmbed()
        .setDescription("**Command:** `say`\n**Description:** " + `${config.name}` + " will say any message given.\n\n**Usage:** `t-say <Any sentence or words>`")
        .setColor('Tsubaki.green')
      message.channel.send({ embed: embed });
    }
    else if (args[0] == "embed") {
      var embed = new Discord.RichEmbed()
        .setDescription("**Command:** `embed`\n**Description:** Will embed any message given.\n\n**Usage:** `t-embed <Any sentence or word>`")
        .setColor('Tsubaki.green')
      message.channel.send({ embed: embed });
    }
    else if (args[0] == "dice") {
      var embed = new Discord.RichEmbed()
        .setDescription("**Command:** `dice`\n**Description:** " + `${config.name}` + " will roll the dice and give you a random number.\n\n**Usage:** `t-dice`")
        .setColor('Tsubaki.green')
      message.channel.send({ embed: embed });
    }
    else if (args[0] == "delete") {
      var embed = new Discord.RichEmbed()
        .setDescription("**Command:** `delete`\n**Description:** Will delete given number of messages.\n\n**Usage:** `t-delete <Greater than 1, less that 100>`")
        .setColor('Tsubaki.green')
      message.channel.send({ embed: embed });
    }
    else if (args[0] == "kick") {
      var embed = new Discord.RichEmbed()
        .setDescription("**Command:** `kick`\n**Description:** Will kick mentioned player.\n\n**Usage:** `t-kick <@mention>`")
        .setColor('Tsubaki.green')
      message.channel.send({ embed: embed });
    }
    else if (args[0] == "ban") {
      var embed = new Discord.RichEmbed()
        .setDescription("**Command:** `ban`\n**Description:** Will ban mentioned player.\n\n**Usage:** `t-ban <@mention>`")
        .setColor('Tsubaki.green')
      message.channel.send({ embed: embed });
    }
    else if (args[0] == "unban") {
      var embed = new Discord.RichEmbed()
        .setDescription("**Command:** `unban`\n**Description:** Will unban the user you give the id for.\n\n**Usage:** `t-unban <player id>`")
        .setColor('Tsubaki.green')
      message.channel.send({ embed: embed });
    }
    else if (args[0] == "id") {
      var embed = new Discord.RichEmbed()
        .setDescription("**Command:** `id`\n**Description:** Will show id of mentioned player.\n\n**Usage:** `t-id <@mention>`")
        .setColor('Tsubaki.green')
      message.channel.send({ embed: embed });
    }
    else if (args[0] == "stats") {
      var embed = new Discord.RichEmbed()
        .setDescription("**Command:** `stats`\n**Description:** Will show guilds, users, and channels " + `${config.name}` + " is in.\n\n**Usage:** `t-stats`")
        .setColor('Tsubaki.green')
      message.channel.send({ embed: embed });
    }
    else if (args[0] == "profile") {
      var embed = new Discord.RichEmbed()
        .setDescription("**Command:** `profile`\n**Description:** Will show you profile picture of mentioned user.\n\n**Usage:** `t-profile <@mention>`")
        .setColor('Tsubaki.green')
      message.channel.send({ embed: embed });
    }
    else if (args[0] == "dog") {
      var embed = new Discord.RichEmbed()
        .setDescription("**Command:** `dog`\n**Description:** Will give random picture of a dog.\n\n**Usage:** `t-dog`")
        .setColor('Tsubaki.green')
      message.channel.send({ embed: embed });
    }
    else if (args[0] == "cat") {
      var embed = new Discord.RichEmbed()
        .setDescription("**Command:** `cat`\n**Description:** Will give random picture of a cat.\n\n**Usage:** `t-cat`")
        .setColor('Tsubaki.green')
      message.channel.send({ embed: embed });
    }
    else if (args[0] == "banana") {
      var embed = new Discord.RichEmbed()
        .setDescription("**Command:** `banana`\n**Description:** Will give mentioned player banana.\n\n**Usage:** `t-banana <@mention>`")
        .setColor('Tsubaki.green')
      message.channel.send({ embed: embed });
    }
    else if (args[0] == "urban") {
      var embed = new Discord.RichEmbed()
        .setDescription("**Command:** `urban`\n**Description:** Will define any word using Urban Dictionary.\n\n**Usage:** `t-urban <word>`")
        .setColor('Tsubaki.green')
      message.channel.send({ embed: embed });
    }
    else if (args[0] == "dictionary") {
      var embed = new Discord.RichEmbed()
        .setDescription("**Command:** `dictionary`\n**Description:** Will define any word using traditonal dictionary.\n\n**Usage:** `t-dictionary <word>`")
        .setColor('Tsubaki.green')
      message.channel.send({ embed: embed });
    }
    else if (args[0] == "support") {
      var embed = new Discord.RichEmbed()
        .setDescription("**Command:** `support`\n**Description:** " + `${config.name}` + " will private message you the support server link.\n\n**Usage:** `t-support`")
        .setColor('Tsubaki.green')
      message.channel.send({ embed: embed });
    }
    else if (args[0] == "tts") {
      var embed = new Discord.RichEmbed()
        .setDescription("**Command:** `tts`\n**Description:** Will say any message aloud.\n\n**Usage:** `t-tts <Any sentence or word>`")
        .setColor('Tsubaki.green')
      message.channel.send({ embed: embed });
    }
    else if (args[0] == "getbanana") {
      var embed = new Discord.RichEmbed()
        .setDescription("**Command:** `getbanana`\n**Description:** Will give you a banana, and list your current bananas.\n\n**Usage:** `t-getbanana`")
        .setColor('Tsubaki.green')
      message.channel.send({ embed: embed });
    }
    else if (args[0] == "cmds") {
      var embed = new Discord.RichEmbed()
        .setDescription("**Command:** `cmds`\n**Description:** Will show you information about commands.\n\n**Usage:** `t-cmds <command>`")
        .setColor('Tsubaki.green')
      message.channel.send({ embed: embed });
    }
    else if (args[0] == "coin") {
      var embed = new Discord.RichEmbed()
        .setDescription("**Command:** `coin`\n**Description:** " + `${config.name}` + " will flip a coin for you.\n\n**Usage:** `t-coin`")
        .setColor('Tsubaki.green')
      message.channel.send({ embed: embed });
    }
    else if (args[0] == "welcome") {
      var embed = new Discord.RichEmbed()
        .setDescription("**Command:** `welcome`\n**Description:** Toggle welcome messages.\n\n**Usage:** `t-welcome <enable | disable> (Channel ID)`")
        .setColor('Tsubaki.green')
      message.channel.send({ embed: embed });
    }
    else if (args[0] == "info") {
      var embed = new Discord.RichEmbed()
        .setDescription("**Command:** `info`\n**Description:** Shows " + `${config.name}` + "'s information.\n\n**Usage:** `t-info`")
        .setColor('Tsubaki.green')
      message.channel.send({ embed: embed });
    }
    else if (args[0] == "changelog") {
      var embed = new Discord.RichEmbed()
        .setDescription("**Command:** `changelog`\n**Description:** Shows " + `${config.name}` + "'s change logs.\n\n**Usage:** `t-changelog`")
        .setColor('Tsubaki.green')
      message.channel.send({ embed: embed });
    }
    else {
      var embed = new Discord.RichEmbed()
        .setDescription(":exclamation: | I am sorry, I did not understand what you said. Please try again!")
        .setColor('ff0000')
      message.channel.send({ embed: embed });
    }
  }
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  else if (command === 'dice') {
    _super.delete();
    let number = message.content.split(' ')[1];
    var numbers = [
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
    _super.delete();
    random.cat().then(url => message.channel.send(url)).catch(err => console.log(err.message));
  }
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  else if (command === 'dog') {
    _super.delete();
    random.dog().then(url => message.channel.send(url)).catch(err => console.log(err.message));
  }
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  else if (command === "banana") {
    _super.delete();
    let memberMention = message.mentions.users.first();
    if (memberMention == message.author) return message.channel.send(":x: | Don't be greedy, sweetie~ :kissing_heart:");
    if (memberMention == '' || memberMention === undefined) return message.channel.send("Mention a player to give a banana!");

    else message.channel.send(":banana: | " + `${message.author.tag}` + " has given " + `${memberMention}` + " a banana!");
  }
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  else if (command === "urban") {
    _super.delete();
    let toDefine = message.content.split(' ')[1];
    if (toDefine == "" || toDefine === undefined) return message.channel.send(":book: | Provide a word to urban define!");
    else {
      webdict("urbandictionary", toDefine).then(resp => {
        let result = resp.definition[0];
        var guildEmbed = new Discord.RichEmbed()
          .setDescription("**Word:** " + '`' + `${toDefine}` + '` ' + `${'\r\n'}**Urban Definition:**` + ' ' + `${result}` + '')
          .setColor(Tsubaki.green)
          .setFooter(`${config.name} Dictionary`)
        message.channel.send({ embed: guildEmbed });
      });
    }
  }
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  else if (command === "dictionary") {
    _super.delete();
    let toDefine = message.content.split(' ')[1];
    if (toDefine == "" || toDefine === undefined) return message.channel.send(":book: | Provide a word to urban define!");
    else {
      webdict("dictionary", toDefine).then(resp => {
        let result = resp.definition[0];
        var guildEmbed = new Discord.RichEmbed()
          .setDescription("**Word:** " + '`' + `${toDefine}` + '` ' + `${'\r\n'}**Definition:**` + ' ' + `${result}` + '')
          .setColor(Tsubaki.green)
          .setFooter(`${config.name} Dictionary`)
        message.channel.send({ embed: guildEmbed });
      });
    }
  }
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  else if (command === "support") {
    _super.delete();
    var embed = new Discord.RichEmbed()
      .setDescription('```js\n"Have Questions or need help?"\n```' + `${'\r\n'}` + '' + `${'\r\n'}` + '**' + `${config.name}` + ' Information:**' + `${'\r\n'}` + `${config.name}` + ' is a Discord.js bot that you can have fun with _and_ moderate with. In your do `t-help` and a list of all my command will pop up.')
      .addField(`**${config.name}'s Help Server**`, `[Click Here to join](https://discord.gg/Gf7hb33)`)
      .setColor(Tsubaki.green)
    message.author.sendEmbed(embed);
  }
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  else if (command === "tts") {
    _super.delete();
    message.channel.send(args.join(" "), { tts: true });
  }
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  else if (command === "getbanana") {
    _super.delete();
    message.reply(' | _You are currently Banana level_' + ' `' + `${userData.level}` + '` ' + '_, with_' + ' `' + `${userData.points}` + '` ' + 'Bananas!');
  }
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  else if (command === "stats") {
    _super.delete();
    var guildEmbed = new Discord.RichEmbed()
      .setDescription('`' + `${config.name}` + '` Guild Stats:')
      .addField('Guilds', `${bot.guilds.size}`)//${bot.guilds.size} //old: `48`
      .addField('Users', `${bot.users.size}`)
      .addField('Channels', `${bot.channels.size}`)
      .setColor(Tsubaki.green)
      .setFooter(`${config.name}` + ' Stats')
    message.channel.send({ embed: guildEmbed });
  }
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  else if (command === "info") {
    _super.delete();
    var guildEmbed = new Discord.RichEmbed()
      .setDescription("**Information About " + `${config.name}` + "**\n\n     " + `${config.name}` + " is a **Discord.js** bot. She can be used for moderation, administration, utility, and just for fun. She has a wide range of commands everyone will enjoy, and she is constantly being updated and added to.")
      .setColor(0xFFFFFF)
    message.channel.send({ embed: guildEmbed });
  }
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  else if (command === "changelog") {
    _super.delete();
    var guildEmbed = new Discord.RichEmbed()
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
    _super.delete();
    let coin = message.content.split(' ')[1];
    var coins = [
      '**Heads!**',
      '**Tails!**',
    ]
    message.channel.send(":fingers_crossed: | You flipped a coin and it landed on...  " + (coins[Math.floor(Math.random() * coins.length)]));
  }
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  else if (command === "help") {
    _super.delete();
    var guildEmbed = new Discord.RichEmbed()
      .setDescription("**" + `${config.name}` + " Command List**\n\nDo **t-cmds [command]** and replace **[command]** with any command you want to learn more about.\n\n**Core-** " + "`" + "help" + "`" + " " + "`" + "ping" + "`" + "\n**Fun-** " + "`" + "8ball" + "`" + " " + "`" + "say" + "`" + " " + "`" + "embed" + "`" + " " + "`" + "dice" + "`" + " " + "`" + "cat" + "`" + " " + "`" + "dog" + "`" + " " + "`" + "banana" + "`" + " " + "`" + "tts" + "`" + " " + "`" + "getbanana" + "`" + " " + "`" + "coin" + "`" + "\n**Utility-** " + "`" + "add" + "`" + " " + "`" + "urban" + "`" + " " + "`" + "dictionary" + "`" + " " + "`" + "cmds" + "`" + "" + "\n**Admin-** " + "`" + "delete" + "`" + " " + "`" + "kick" + "`" + " " + "`" + "ban" + "`" + " " + "`" + "unban" + "`" + " " + "`" + "id" + "`" + " " + "`" + "welcome" + "`" + "\n**Information-** " + "`" + "stats" + "`" + " " + "`" + "profile" + "`" + " " + "`" + "invite" + "`" + " " + "`" + "support" + "`" + " " + "`" + "info" + "`" + " " + "`" + "changelog" + "`" + "\n**Music-** `leave` `queue` `play` `pause` `resume` `skip` `clearqueue`\n**Disabled-** `cid` `gid` `music`" + "\n\nYou can also talk to " + `${config.name}` + " by saying **Hi " + `${config.name}` + "**, **Help " + `${config.name}` + "**, or **" + `${config.name}` + "**.\n")
      .setColor(Tsubaki.green)
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
    var args = arguments;
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

module.exports.config = config;
module.exports.commands = commands;
module.exports.Style = Style;