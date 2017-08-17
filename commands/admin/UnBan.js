const Tsubaki = require("../../Tsubaki.js");
const Discord = require("discord.js");

let _super = require("../Command.js").prototype;
let method = UnBan.prototype = Object.create(_super);

method.constructor = UnBan;

function UnBan() {
  _super.constructor.apply(this, ["unban", "Unban the specified user.", " <@mention> [reason]"]);
}

method.executeAdmin = function (message, args, bot) {
  let reason = args.slice(1).join(" ");
  userToUnBan.send("You have been {0} by {1} {2}"
    .format(Tsubaki.Style.bold("unbanned")), Tsubaki.Style.bold(message.author), (reason.length > 0 ? " for: " + Tsubaki.Style.bold(reason) : "!"));

  message.guild.unban(userToUnban);

  message.channel.send("{0} has been {1} by {2} {3}"
    .format(userToUnBan.username, Tsubaki.Style.bold("unbanned"), Tsubaki.Style.bold(message.author.tag),
    (reason.length > 0 ? "for: " + Tsubaki.Style.bold(reason) : "!")));
}

method.execute = function (message, args, bot) {
  this.delete(message);
  if (message.member !== undefined && message.member.hasPermission(Tsubaki.adminPermission)) {
    this.executeAdmin(message, args, bot);
  } else {
    return message.channel.send({ embed: Tsubaki.Style.error("You don't have permission for that!") });
  }
}

module.exports = UnBan;