const Tsubaki = require('../../Tsubaki.js');
const Discord = require('discord.js');

const Command = require('../Command.js');

class Eval extends Command {
  
  constructor() {
    super('eval', 'Evaluates the provided javascript.', ' <code> <javascript>');
    this.logEval('First code: ' + (this.code = this.randString()));
  }

  executeAdmin(message, args, bot, db) {
    this.logEval(message.author.username + ' executed an eval: ');
    this.logEval(message.content, 1);

    let expression = args.splice(1).join(' ');
    let result = '';
    try {
      result = eval(expression);
    } catch (e) {
      message.channel.sendTemp(Tsubaki.Style.error('Whoops! I got an error: '
        + e.message + '. See console for stack trace.'), 10000);
      
      this.logEval('Eval threw an error!');
      this.logEval('Command:');
      this.logEval(expression, 1);
      this.logEval('Error:');
      this.logEval(e.stack, 1);
      return;
    }
    if (result !== Object(result)) {
      message.channel.sendTemp(Tsubaki.Style.codeBlock(result, ''), 20000);
    }
  }

  execute(message, args, bot, db) {
    if (message.member !== undefined && (message.member.id === Tsubaki.ianId || message.member.id === Tsubaki.davidId)
      && args[0] !== undefined && args[0] === this.code) {
      this.executeAdmin(message, args, bot, db);
    } else {
      message.channel.sendTemp(Tsubaki.Style.notFound(), 10000);
    }
    this.logEval('Next code: ' + (this.code = this.randString())); // Generate a new code and print to console
  }

  randString() {
    let text = '';
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]\\{}|;\':",./<>?';

    for (let i = 0; i < 16; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
  }

  logEval(msg, indent = 0) {
    msg.split('\n').forEach(logLine => {
      let line = '[EVAL] ';
      for (let i = 0; i < indent; i++) {
        line += '    ';
      }
      line += logLine;

      console.log(line);
    });
  }
}

module.exports = Eval;