const Tsubaki = require("../../Tsubaki.js");
const Discord = require("discord.js");

let _super = require("../Command.js").prototype;
let method = LeaveGuild.prototype = Object.create(_super);

method.constructor = LeaveGuild;

function LeaveGuild() {
  _super.constructor.apply(this, ["leaveguild", "Remove " + Tsubaki.name + " from a guild.", " <guild id>"]);
}

method.executeAdmin = function (message, args, bot, db) {
  if (args.length > 0) {
    let guild = bot.guilds.get(args[0]);
    guild.leave();
    message.channel.send({ embed: Tsubaki.Style.success('Left server ' + guild.name) });
  }
  else message.channel.send({ embed: Tsubaki.Style.warn("Please provide a guild id") });
}

method.execute = function (message, args, bot, db) {
  if (message.member !== undefined && (message.member.id === Tsubaki.ianId || message.member.id === Tsubaki.davidId)) {
    this.executeAdmin(message, args, bot, db);
  } else {
    return message.channel.send({ embed: Tsubaki.Style.notFound() });
  }
}

module.exports = LeaveGuild;