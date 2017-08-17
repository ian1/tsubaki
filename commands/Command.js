const Tsubaki = require("../Tsubaki.js");
const Discord = require("discord.js");

let method = Command.prototype;

function Command(command, description, usage) {
  this._command = command;
  this._description = description;
  this._usage = Tsubaki.prefix + command + usage;
}

method.execute = function () {
  throw new Error("Abstract method!");
};

method.executeAdmin = function () {
  throw new Error("Abstract method!");
};

method.getCommand = function () {
  return this._command;
};

method.getDescription = function () {
  return this._description;
};

method.getUsage = function () {
  return this._usage;
};

method.getInformation = function () {
  return Tsubaki.Style.bold(Tsubaki.name + " Information:") + "\n"
    + Tsubaki.name + " is a Discord.js bot that you can have fun with "
    + Tsubaki.Style.italicize("and") + " moderate with. In your server do "
    + Tsubaki.Style.code(Tsubaki.help().getUsage()) + " and a list of all my command will pop up.";
};

method.delete = function (message) {
  message.delete(message, { wait: 10 }, function (error) { });
}

module.exports = Command;

/*
// TEMPLATE

const Tsubaki = require("../../Tsubaki.js");
const Discord = require("discord.js");

let _super = require("../Command.js").prototype;
let method = NAME.prototype = Object.create(_super);

method.constructor = NAME;

function NAME() {
  _super.constructor.apply(this, ["COMMAND", "DESCRIPTION", "USAGE"]);
}

method.execute = function (message, args, bot) {
  this.delete(message);
  // ACTION
}

module.exports = NAME;

*/