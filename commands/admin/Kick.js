const Tsubaki = require("../../Tsubaki.js");
const Discord = require("discord.js");

let _super = require("../Command.js").prototype;
let method = Kick.prototype = Object.create(_super);

method.constructor = Kick;

function Kick() {
  _super.constructor.apply(this, ["kick", "Will kick the specified user.", " <@mention> [reason]"]);
}

method.executeAdmin = function (message, args, bot, points) {
  let userToKick = message.mentions.users.first();
  if (userToKick == "" || userToKick === undefined) return message.channel.send({ embed: Tsubaki.Style.unknownUser() });
  let userID = userToKick.id;

  let isKickable = message.guild.member(userToKick).kickable;

  let reason = args.slice(1).join(" ");

  if (isKickable || userID.kickable) {
    message.guild.member(userToKick.id).send(":boot: You have been {0} by {1} {2}"
      .format(Tsubaki.Style.bold("kicked")), Tsubaki.Style.bold(message.author), (reason.length > 0 ? " for: " + Tsubaki.Style.bold(reason) : "!"));

    if (reason.length > 0) {
      message.guild.member(userToKick).kick(reason);
    } else {
      message.guild.member(userToKick).kick();
    }

    message.channel.send(":boot: {0} has been {1} by {2} {3}"
      .format(userToKick.username, Tsubaki.Style.bold("kicked"), Tsubaki.Style.bold(message.author.tag),
      (reason.length > 0 ? "for: " + Tsubaki.Style.bold(reason) : "!")));
  } else if (!isKickable || !(userID.kickable)) {
    message.channel.send({ embed: Tsubaki.Style.error("You can't kick that user!") });
  } else {
    message.channel.send("Bigger Problem Inside")
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

module.exports = Kick;