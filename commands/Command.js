const Tsubaki = require('../Tsubaki.js');
const Discord = require('discord.js');

class Command {
  constructor(command, description, usage) {
    this._command = command;
    this._description = description;
    this._usage = Tsubaki.prefix + command + usage;
  }

  executeInternal(message, args, bot, db) {
    this.execute(message, args, bot, db);
    message.delete();
  }

  execute(message, args, bot, db) {
    throw new Error('Abstract method!');
  }

  executeAdmin(message, args, bot, db) {
    throw new Error('Abstract method!');
  }

  getCommand() {
    return this._command;
  };

  getDescription() {
    return this._description;
  };

  getUsage() {
    return this._usage;
  };

  getInformation() {
    return Tsubaki.Style.bold(Tsubaki.name + ' Information:') + '\n'
      + Tsubaki.name + ' is a Discord.js bot that you can have fun with '
      + Tsubaki.Style.italicize('and') + ' moderate with. In your server do '
      + Tsubaki.Style.code(Tsubaki.help().getUsage()) + ' and a list of all my command will pop up.';
  };
}

module.exports = Command;

/*
// TEMPLATE

const Tsubaki = require('../../Tsubaki.js');
const Discord = require('discord.js');

const Command = require('../Command.js');

class NAME extends Command {
  constructor() {
    super('COMMAND', 'DESCRIPTION, 'USAGE');
  }

  execute(message, args, bot, db) {
    // ACTION
  }
}

module.exports = NAME;

*/