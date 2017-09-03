const Discord = require('discord.js');
const Tsubaki = require('./Tsubaki.js');

module.exports = {
  codeBlock: function(text, lang = '') {
    return '```' + lang + '\n' + text + '\n```';
  },

  embed: function(title, description, color, footer) {
    let embed = new Discord.RichEmbed()
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

    return {embed: embed};
  },

  success: function(text, footer = undefined) {
    return this.embed(
      undefined, `:thumbsup: ${text}`, Tsubaki.color.green, footer
    );
  },

  error: function(text, footer = undefined) {
    return this.embed(
      undefined, `:exclamation: ${text}`, Tsubaki.color.red, footer
    );
  },

  errorGeneric: function() {
    return this.error('Whoops, I got an error! Please try again.', undefined);
  },

  warn: function(text, footer = undefined) {
    return this.embed(undefined, text, Tsubaki.color.yellow, footer);
  },

  unknownUser: function() {
    return this.warn(':thinking: Sorry... I don\'t know who that is. '
      + 'Please try again, make sure you use @ to mention the user!');
  },

  notFound: function() {
    return this.warn('Uh oh, I didn\'t find that command! Try '
      + `\`${Tsubaki.prefix + Tsubaki.help().getCommand()}\`.`);
  },
};
