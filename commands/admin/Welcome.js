const Tsubaki = require("../../Tsubaki.js");
const Discord = require("discord.js");

let _super = require("../Command.js").prototype;
let method = Welcome.prototype = Object.create(_super);

method.constructor = Welcome;

function Welcome() {
  _super.constructor.apply(this, ["welcome", "Toggle welcome messages on or off for specified channel.", " <enable|disable> <channelId>"]);
}

method.executeAdmin = function (message, args, bot, points) {
  
  if (args.length < 2) return message.channel.send({ embed: Tsubaki.Style.warn("Invalid arguments! Usage: " + this.getUsage()) });
  let status = args[0].toLowerCase();
  let channelId = args[1];// message.content.split(' ').slice(1)[1]

  if (status === "enable") {
    if (!message.guild.channels.find('id', channelId)) 
      return message.channel.send({ embed: Tsubaki.Style.warn("Sorry, I couldn't find a channel with the id " + channelId + ".") });
    message.channel.send({ embed: Tsubaki.Style.success("Welcome messages will now be sent to channel <#" + channelId + ">") });
    let guildID = message.guild.id;
    let WCData = {
      "channelID": channelId
    }
    
    fs.writeFile(message.guild.id + ".json", JSON.stringify(WCData), (err) => {
      if (err) console.error(err)
    });
  } else if (status === "disable") {
    fs.stat(`../../${message.guild.id}.json`, function (err) {
      if (err) {
        console.log(err);
      }
    });
    fs.unlink(`../../${message.guild.id}.json`, function (err) {
      if (err) return console.log(err);
      else {
        message.channel.send('Welcome messages now `disabled` for this guild.');
      }
    });
  } else {
    message.channel.send({ embed: Tsubaki.Style.warn("Invalid arguments! Usage: " + this.getUsage()) });
  }
}

method.execute = function (message, args, bot, points) {
  this.delete(message);
  if (message.member !== undefined && message.member.hasPermission(Tsubaki.adminPermission)) {
    this.executeAdmin(message, args, bot, points);
  } else {
    return message.channel.send({ embed: Tsubaki.Style.error("You don't have permission for that!") });
  }  
}

module.exports = Welcome;