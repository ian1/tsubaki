const Tsubaki = require("../../Tsubaki.js");
const Discord = require("discord.js");

let _super = require("../Command.js").prototype;
let method = GetBanana.prototype = Object.create(_super);

method.constructor = GetBanana;

function GetBanana() {
  _super.constructor.apply(this, ["getbanana", "Will give you a banana, and list your current points.", ""]);
}

method.execute = function (message, args, bot, points) {
  this.delete(message);
  let userData = points[message.author.id];
  message.reply(":banana: " + Tsubaki.Style.italicize("You are currently Banana level ") + Tsubaki.Style.code(userData.level) + Tsubaki.Style.italicize(", with ")
    + Tsubaki.Style.code(userData.points) + ' Bananas!');
}

module.exports = GetBanana;