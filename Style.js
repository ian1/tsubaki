const Discord = require('discord.js');
const Tsubaki = require('./Tsubaki.js');

module.exports = {
  bold: function(text) {
    return '**' + text + '**';
  },

  italicize: function(text) {
    return '*' + text + '*';
  },

  underline: function(text) {
    return '__' + text + '__';
  },

  strike: function(text) {
    return '~~' + text + '~~';
  },

  url: function (text, url) {
    if (text == '') text = url;
    return '[' + text + '](' + url + ')';
  },

  code: function(text) {
    return '`' + text + '`';
  },

  codeBlock: function(text, lang) {
    return '```' + lang + '\n' + text + '\n```';
  },

  embed: function (title, description, color, footer) {
    var embed = new Discord.RichEmbed()
      .setDescription(description);

    if (title !== undefined) {
      embed.setTitle(title);
    }
    if (color !== undefined) {
      embed.setColor(color);
    }
    if (footer !== undefined) {
      embed.setFooter(footer);
    }

    return { embed: embed };
  },

  success: function (text, footer = undefined) {
    return this.embed(undefined, ':thumbsup: ' + text, Tsubaki.color.green, footer);
  },

  error: function (text, footer = undefined) {
    return this.embed(undefined, ':exclamation: ' + text, Tsubaki.color.red, footer)
  },

  errorGeneric: function () {
    return this.error('Whoops, I got an error! Please try again.', undefined);
  },

  warn: function (text, footer = undefined) {
    return this.embed(undefined, text, Tsubaki.color.yellow, footer);
  },

  unknownUser: function () {
    return this.warn(':thinking: Sorry... I don\'t know who that is. '
      + 'Please try again, make sure you use @ to mention the user!');
  },

  notFound: function () {
    return module.exports.warn('Uh oh, I didn\'t find that command! Try '
      + this.code(Tsubaki.prefix + Tsubaki.help().getCommand()) + '.')
  }
}