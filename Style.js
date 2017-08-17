const Discord = require("discord.js");
const Tsubaki = require("./Tsubaki.js");

module.exports = {
  bold: function(text) {
    return "**" + text + "**";
  },

  italicize: function(text) {
    return "*" + text + "*";
  },

  underline: function(text) {
    return "__" + text + "__";
  },

  strike: function(text) {
    return "~~" + text + "~~";
  },

  url: function (text, url) {
    if (text == "") text = url;
    return "[" + text + "](" + url + ")";
  },

  code: function(text) {
    return "`" + text + "`";
  },

  codeBlock: function(text, lang) {
    return "```" + lang + "\n" + text + "\n```";
  },

  success: function (text) {
    var embed = new Discord.RichEmbed()
      .setDescription(":thumbsup: " + text)
      .setColor(Tsubaki.color.green);
    return embed;
  },

  error: function (text) {
    var embed = new Discord.RichEmbed()
      .setDescription(":exclamation: " + text)
      .setColor(Tsubaki.color.red);
    return embed;
  },

  errorGeneric: function () {
    return module.exports.error("Whoops, I got an error! Please try again later.");
  },

  warn: function (text) {
    var embed = new Discord.RichEmbed()
      .setDescription(text)
      .setColor(Tsubaki.color.yellow);
    return embed;
  },

  unknownUser: function () {
    return module.exports.warn(":thinking: Sorry... I don't know who that is. "
      + "Please try again, make sure you use @ to mention the user!");
  }
}