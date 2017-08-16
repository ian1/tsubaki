const Tsubaki = require("../Tsubaki.js");
const Discord = require("discord.js");

var method = Command.prototype;

function Command(command, description, usage) {
  this._command = command;
  this._description = description;
  this._usage = Tsubaki.prefix + command + usage;
}

method.execute = function () {
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

method.delete = function (message) {
  message.delete(message, { wait: 10 }, function (error) { });
}

module.exports = Command;