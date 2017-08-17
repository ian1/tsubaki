const Tsubaki = require("../../Tsubaki.js");
const Discord = require("discord.js");

let _super = require("../Command.js").prototype;
let method = Delete.prototype = Object.create(_super);

method.constructor = Delete;

function Delete() {
  _super.constructor.apply(this, ["delete", "Delete the specified number of messages.", " <number between 1 and 100>"]);
}

method.executeAdmin = function (message, args, bot, db) {
  if (args.length == 0 || parseInt(args[0]) < 1) {
    message.channel.send({ embed: Tsubaki.Style.warn(":grey_question: How many messages do you want to delete?") });
  } else if (parseInt(args[0]) > 100) {
    message.channel.send({ embed: Tsubaki.Style.warn("I can't delete more than 100 messages!") });
  } else {
    message.channel.fetchMessages({ limit: parseInt(args[0]) + 1 }).then(messages => message.channel.bulkDelete(messages)).catch(function () {
      message.channel.send({ embed: Tsubaki.Style.errorGeneric() });
      console.error;
    });
  }
}

method.execute = function (message, args, bot, db) {
  this.delete(message);
  if (message.member !== undefined && message.member.hasPermission(Tsubaki.adminPermission)) {
    this.executeAdmin(message, args, bot, db);
  } else {
    return message.channel.send({ embed: Tsubaki.Style.error("You don't have permission for that!") });
  }  
}

module.exports = Delete;