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
  }
}