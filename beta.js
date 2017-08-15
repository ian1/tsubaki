
// Made by the baddest bitch in town: Khux.//

const Discord = require("discord.js");
const random = require("random-animal");
const YTDL = require("ytdl-core");
const bconfig = require("./bconfig.json");
const chalk = require('chalk');
const webdict = require("webdict");
const fs = require("fs");
const client = new Discord.Client();

var bot = new Discord.Client();
var servers = {};
//~~~~~~~~~~~~~~~~~~~~~~~~
  function listGuilds(message, listOfGuilds) {
      let i = 0;
      while (i != listOfGuilds.length + 1) {
          return `${listOfGuilds[i]}`+"\r\n";
          i++;
        }
        return "\nend";
}
//~~~~~~~~~~~~~~~~~~~~~~~~
function guildInfo(message, listOfGuilds) {
   let i = 0;
   let listyAll = [];
   listOfGuilds.forEach(function(item) {
       listyAll.push(item + "\r\n" + item.id + "\r\n")
   })
       return (`${listyAll.join("\r\n")}`);
}
//~~~~~~~~~~~~~~~~~~~~~~~~
bot.on('ready', () => {
  console.log(chalk.cyan(`Tsubaki Beta has started, with ${bot.users.size} users, in ${bot.channels.size} channels of ${bot.guilds.size} guilds.`));
  bot.user.setGame("tb-help | BETA");
});
//~~~~~~~~~~~~~~~~~~~~~~~~
bot.on("message", message => {
    if (message.author.bot) return;

    if (message.content.toLowerCase() === "help tsubaki beta") {
        message.channel.send("Hi there, if you need help do  ``tb-help``!");
    }
    if (message.content.toLowerCase() === "hi tsubaki beta") {
        message.channel.send("Hi there!");
    }
    if (message.content.toLowerCase() === "tsubaki beta") {
        message.channel.send("I hear you talking about me :smirk:");
    }
//~~~~~~~~~~~~~~~~~~~~~~~~
    if (!message.content.startsWith(bconfig.prefix)) {return;}
//~~~~~~~~~~~~~~~~~~~~~~~~
    let command = message.content.split(" ")[0];
    command = command.slice(bconfig.prefix.length).toLowerCase();
    commandM = command.slice(bconfig.prefixMusic.length).toLowerCase();
    let args = message.content.split(" ").slice(1);
//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-//
    if (command === "add") {
        let numArray = args.map(n=> parseInt(n));
        let total = numArray.reduce( (p, c) => p+c);

        message.channel.send(total);
      }
//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-//
    else if (command === "say") {
          message.delete(message, {wait : 10}, function(error) {});
          message.channel.send(args.join(" "), {tts: false});
    }
//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-//
    else if (command === "playing") {
      if (message.author.id != '135529980011610112') return;
        else {
          let gamemsg = args.join(" ");
          message.delete(message, {wait : 10}, function(error) {});
          bot.user.setGame(gamemsg);
        }
}
//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-//
else if (command === "embed") {
      var embed = new Discord.RichEmbed()
      .setDescription(args.join(" "))
      .setColor(0xfc67dc)
      message.channel.send({embed: embed});
      message.delete(message, {wait : 10}, function(error) {});
}
//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-//
else if (command === "ping") {
  message.delete(message, {wait : 10}, function(error) {});
    message.channel.send(":ping_pong: | Pong! ``" + Math.round(bot.ping) + " ms``");
}
 //-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-//
 else if (command == "delete") {
    let hasAdmin = message.member.hasPermission('ADMINISTRATOR');
    if (hasAdmin) {
      if (args.length >= 2){
          message.channel.send(":exclamation: | You're asking too much for what I can handle!");}
      else {
          var msg;
              if (!args[0]){
                  message.channel.send(":x: | How many?");
              }
              else if (args[0] > 99) {
                  message.channel.send(":exclamation: | Cannot delete `100` messages or more");
              }
              else {
                  if (args[0] < 100) {
                      msg = (parseInt(args[0]) + 1);
                      message.channel.fetchMessages({limit: msg}).then(messages => message.channel.bulkDelete(messages)).catch(console.error);
                  }
                  else return message.channel.send(":exclamation: | Nummber of messages to delete cannot go over 100! Use " + bconfig.prefix + "reset instead!");
                          }
                        }
                      } else return message.channel.send(':no_entry: | You do not have permission, silly!');
                    }
//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-//
else if (command === "help") {
  try {
      message.delete(message, {wait : 10}, function(error) {});
    var guildEmbed = new Discord.RichEmbed ()
        .setDescription("**Tsubaki Command List\n\nDo " + "`" + "tb-cmds [command]" + "`" + " and replace " + "`" + "[command]" + "`" + " with any command you want to learn more about.\n\n**Core-** " + "`" + "help" + "`" + " " + "`" + "ping" + "`" + "\n**Fun-** " + "`" + "8ball" + "`" + " " + "`" + "say" + "`" + " " + "`" + "embed" + "`" + " " + "`" + "dice" + "`" + " " + "`" + "cat" + "`" + " " + "`" + "dog" + "`" + " " + "`" + "banana" + "`" + " " + "`" + "tts" + "`" + " " + "`" + "getbanana" + "`" + "\n**Utility-** " + "`" + "add" + "`" + " " + "`" + "urban" + "`" + " " + "`" + "dictionary" + "`" + "\n**Admin-** " + "`" + "delete" + "`" + " " + "`" + "kick" + "`" + " " + "`" + "ban" + "`" + " " + "`" + "unban" + "`" + " " + "`" + "id" + "`" + "\n**Information-** " + "`" + "stats" + "`" + " " + "`" + "profile" + "`" + " " + "`" + "invite" + "`" + " " + "`" + "support" + "`" + "\n**Disabled-** " + "`" + "No commands are currently disabled." + "`" + "\n\nYou can also talk to Tsubaki by saying " + "`" + "Hi Tsubaki Beta" + "`" + ", " + "`" + "Help Tsubaki Beta" + "`" + ", or " + "`" + "Tsubaki Beta" + "`" + ".\n")
        .setColor(0xfc67dc)
        message.channel.send({embed: guildEmbed});
      }
      catch(err) {
        crashlogs(message, bot);
      }
    finally {}
}
//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-//
else if (command === "kick") {
    let hasAdmin = message.member.hasPermission('ADMINISTRATOR');
    if (hasAdmin) {
        if (!args[0]) return message.channel.send(":exclamation: | Mention the player to kick!");
        let userToKick = message.mentions.users.first();
        if (userToKick == "" || userToKick === undefined) return message.channel.send(":exclamation: | Mention someone to kick!");

        let isKickable = message.guild.member(userToKick).Kickable;

        let reason = args.slice(1).join(" ");
        if (reason.length < 1) return message.channel.send(":boot: | You must supply a reason for the kick!");

        if(isKickable || userID.Kickable) {
            message.guild.member(userToKick.id).send(`:boot: | You have been **kick** by ${message.author} for ${reason}`);
            message.guild.member(userToKick).kick(7, args.join(" "));
            message.channel.send(`:boot: | ${userToBan.username} has been **banned** by ${message.author}`);
        }
        else if(!isKickable || !(userID.kickable)) {
            message.channel.send(`:exclamtion: |${userToBan.username} cannot be kicked by ${message.author}`);

        }
        else {
            message.channel.send("Bigger Problem Inside")
        }
    }
    else if (!hasAdmin){
        message.channel.send(':no_entry: | No permission silly!');
    }
    else {
        message.channel.send("Bigger Problem outside")
    }
}
//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-//
else if (command === "ban") {
    let hasAdmin = message.member.hasPermission('ADMINISTRATOR');
    if (hasAdmin) {
        if (!args[0]) return message.channel.send(":exclamation: | Mention the player to ban!");
        let userToBan = message.mentions.users.first();
        if (userToBan == "" || userToBan === undefined) return message.channel.send(":exclamation: | Mention someone to ban!");

        let isBannable = message.guild.member(userToBan).bannable;

        let reason = args.slice(1).join(" ");
        if (reason.length < 1) return message.channel.send(":hammer: | You must supply a reason for the ban!");

        if(isBannable || userID.bannable) {
            message.guild.member(userToBan.id).send(`:hammer: | You have been **banned** by ${message.author} for ${reason}`);
            message.guild.member(userToBan).ban(7, args.join(" "));
            message.channel.send(`:hammer: | ${userToBan.username} has been **banned** by ${message.author}`);
        }
        else if(!isBannable || !(userID.bannable)) {
            message.channel.send(`:exclamtion: |${userToBan.username} cannot be banned by ${message.author}`);

        }
        else {
            message.channel.send("Bigger Problem Inside")
        }
    }
    else if (!hasAdmin){
        message.channel.send(':no_entry: | No permission silly!');
    }
    else {
        message.channel.send("Bigger Problem outside")
    }
}
//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-//
    else if (command === "invite") {
          message.delete(message, {wait : 10}, function(error) {});
            var embed = new Discord.RichEmbed()
              .setDescription('```js\n"Tsubaki Beta"\n```' + `${'\r\n'}` + '' + `${'\r\n'}` + '**Tsubaki Information:**' + `${'\r\n'}` + 'Tsubaki beta is a beta bot for `Tsubaki`. Beta is used for testing purposes.')
              .addField(`**Tsubaki Beta's Help Server**`, `[Click Here to join](https://discord.gg/f7jgFR9)`)
              .setColor(0xfc67dc)
      message.author.sendEmbed(embed);
}
//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-//
    else if (command === "unban") {
        let hasAdmin = message.member.hasPermission('ADMINISTRATOR');
        if (hasAdmin) {
            message.channel.guild.unban(args[0]);
            message.channel.send("```Player Unbanned```");
        }
        else {
          message.channel.send(':no_entry: | No permission silly!');
        }
    }
//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-//
else if (command === "id") {
  let hasAdmin = message.member.hasPermission('ADMINISTRATOR');
  if (hasAdmin) {
        if (!args[0]) {
            message.channel.send("Mention the person to return the ID of!")
    }
    let memberID = (message.guild.member(message.mentions.users.first()).id);
        message.channel.send(memberID);
}
else {
    message.channel.send(':no_entry: | No permission silly!');
  }
}
//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-//
else if (command === '8ball') {
        let msg = message
		let ball = msg.content.split(' ')[1];
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
				msg.channel.send(balls[Math.floor(Math.random() * balls.length)]);
		}
	}
//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-//
else if (command === 'profile') {
  message.delete(message, {wait : 10}, function(error) {});
        let msg = message
		let profileMention = msg.mentions.users.first();
		if (profileMention == '' || profileMention === undefined) return msg.channel.send("Mention the person that you want the profile from!");
			else {
				let profileEmbedAuthor = msg.mentions.users.first().username
				var profileEmbed = new Discord.RichEmbed()
					.setDescription(`Profile of ${profileMention}`)
				  	.setImage(`${profileMention.avatarURL}`)
				  	.setColor(0xfc67dc)
				  	msg.channel.send({embed: profileEmbed});
			}
}
//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-//
else if (command === "guilds") {
  if(message.author.id == "135529980011610112") {
   var guildsListing = bot.guilds.array()
   embed = new Discord.RichEmbed()
           .setColor(0xfc67dc)
           .addField("Stats for: `Tsubaki`", `${guildInfo(message, guildsListing)}`)
   message.channel.sendEmbed(embed);
}
}
//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-//
  else if (command === "cmds") {
    if (!args[0]) {
      message.channel.send("Which command do you need help on?" + "\n**Example:** `t-cmds ping`");
    }
    else if (args[0] == "ping") {
      message.channel.send("**Command**: Ping\n**Function**: Returns ping.");
    }
    else if (args[0] == "invite") {
      message.channel.send("**Command**: invite\n**Function**: Tsubaki will message you the invite link and more helpful information.");
    }
    else if (args[0] == "help") {
      message.channel.send("**Command**: help\n**Function**: Shows command list.");
    }
    else if (args[0] == "8ball") {
      message.channel.send("**Command**: 8ball\n**Function**: Will give you a fortune if you ask a question.");
    }
    else if (args[0] == "add") {
      message.channel.send("**Command**: add\n**Function**: add 2 numbers for more.");
    }
    else if (args[0] == "say") {
      message.channel.send("**Command**: say\n**Function**: Tsubaki will say whatever you want.");
    }
    else if (args[0] == "embed") {
      message.channel.send("**Command**: emded\n**Function**: Embed a message.");
    }
    else if (args[0] == "dice") {
      message.channel.send("**Command**: dice\n**Function**: Will roll the dice and give you a random number.");
    }
    else if (args[0] == "delete") {
      message.channel.send("**Command**: delete\n**Function**: Deletes messages.");
    }
    else if (args[0] == "kick") {
      message.channel.send("**Command**: kick\n**Function**: Kicks specified player.");
    }
    else if (args[0] == "ban") {
      message.channel.send("**Command**: ban\n**Function**: Bans specified player.");
    }
    else if (args[0] == "unban") {
      message.channel.send("**Command**: unban\n**Function**: Unbans specified player.");
    }
    else if (args[0] == "id") {
      message.channel.send("**Command**: id\n**Function**: Gets id of speficied player.");
    }
    else if (args[0] == "stats") {
      message.channel.send("**Command**: stats\n**Function**: Shows Tsubaki's stats.");
    }
    else if (args[0] == "profile") {
      message.channel.send("**Command**: profile\n**Function**: Shows profile picture of specified player.");
    }
    else if (args[0] == "dog") {
      message.channel.send("**Command**: dog\n**Function**: Puts random dog picture in chat.");
    }
    else if (args[0] == "cat") {
      message.channel.send("**Command**: cat\n**Function**: Puts random cat picture in chat.");
    }
    else if (args[0] == "banana") {
      message.channel.send("**Command**: banana\n**Function**: Gives mentioned person banana.");
    }
    else if (args[0] == "urban") {
      message.channel.send("**Command**: urban\n**Function**: Uses Urban Dictionary to define word given.");
    }
    else if (args[0] == "dictionary") {
      message.channel.send("**Command**: dictionary\n**Function**: Uses a dictionary to define word given.");
    }
    else if (args[0] == "support") {
      message.channel.send("**Command**: support\n**Function**: Tsubaki will PM you with some helpful information.");
    }
    else if (args[0] == "tts") {
      message.channel.send("**Command**: tts\n**Function**: Tsubaki will say the message given out loud.");
    }
    else if (args[0] == "getbanana") {
      message.channel.send("**Command**: getbanana\n**Function**: Display current bananas and will give a banana.");
    }
    else {
      message.channel.send(":exclamation: | I'm sorry, I did not quite understand you. Please try again.")
    }
  }
//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-//
  else if (command === 'dice') {
    message.delete(message, {wait : 10}, function(error) {});
        let msg = message
    let number = msg.content.split(' ')[1];
    var numbers = [
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
      ]
        msg.channel.send(":game_die: | You rolled a " + (numbers[Math.floor(Math.random() * numbers.length)]));
    }
//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-//
else if (command === 'cat') {
  message.delete(message, {wait : 10}, function(error) {});
  random.cat().then(url => message.channel.send(url)).catch(err => console.log(err.message));
  }
//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-//
  else if (command === 'dog') {
    message.delete(message, {wait : 10}, function(error) {});
    random.dog().then(url => message.channel.send(url)).catch(err => console.log(err.message));
    }
//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-//
else if (command === "banana") {
      message.delete(message, {wait : 10}, function(error) {});
      let memberMention = message.mentions.users.first();
            if (memberMention == message.author) return message.channel.send(":x: | Don't be greedy, sweetie~ :kissing_heart:");
            if (memberMention == '' || memberMention === undefined) return message.channel.send("Mention a player to give a banana!");

            else message.channel.send(":banana: | " + `${message.author}` + " has given " + `${memberMention}` + " a banana!");
    }
//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-//
  else if (command === "urban") {
    message.delete(message, {wait : 10}, function(error) {});
      let toDefine = message.content.split(' ')[1];
      if (toDefine == "" || toDefine === undefined) return message.channel.send(":book: | Provide a word to urban define fam!");
      else {
        webdict("urbandictionary", toDefine).then(resp => {
          let result = resp.definition[0];
          message.channel.send(`**Word:**` + ' `' + `${toDefine}` + '` ' + `${'\r\n'}**Urban Definition:**` + ' `' + `${result}` + '`');
        });
      }
}
//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-//
else if (command === "dictionary") {
  message.delete(message, {wait : 10}, function(error) {});
    let toDefine = message.content.split(' ')[1];
    if (toDefine == "" || toDefine === undefined) return message.channel.send(":book: | Provide a word to urban define fam!");
    else {
      webdict("dictionary", toDefine).then(resp => {
        let result = resp.definition[0];
        message.channel.send(`**Word:**` + ' `' + `${toDefine}` + '` ' + `${'\r\n'}**Urban Definition:**` + ' `' + `${result}` + '`');
      });
    }
}
//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-//
else if (command === "support") {
      message.delete(message, {wait : 10}, function(error) {});
        var embed = new Discord.RichEmbed()
          .setDescription('```js\n"Have Questions or need help?"\n```' + `${'\r\n'}` + '' + `${'\r\n'}` + '**Tsubaki Beta Information:**' + `${'\r\n'}` + 'Tsubaki Beta is a beta bot for the main bot `Tsubaki` its used for testing purposes.')
          .addField(`**Tsubaki Beta's Help Server**`, `[Click Here to join](https://discord.gg/f7jgFR9)`)
          .setColor(0xfc67dc)
  message.author.sendEmbed(embed);
}
//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-//
else if (command === "leaveserver") {
  if(message.author.id == "135529980011610112") {
    if (args[0]) {
        let guildz = bot.guilds.get(args[0])
        message.channel.send(`Leaving server ${guildz.name}...`);
        guildz.leave();
        message.channel.send(`Left server.`);
        }
    else {message.channel.send("Please put a server id")}
  }
}
//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-//
else if (command === "tts") {
    message.delete(message, {wait : 10}, function(error) {});
    message.channel.send(args.join(" "), {tts: true});
}
//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-//
});
bot.login('***REMOVED***');
