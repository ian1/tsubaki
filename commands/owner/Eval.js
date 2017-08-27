const Tsubaki = require('../../Tsubaki.js');
const OwnerCommand = require('./OwnerCommand.js');

/** The eval command */
class Eval extends OwnerCommand {
  /** Create the command */
  constructor() {
    super('eval', 'Evaluates the provided javascript.', ' <code> <javascript>');

    this.logEval(`First code: ${this.code = this.randString()}`);
  }

  /**
   * @param {Discord.Message} message The sent command
   * @param {string[]} args The arguments in the command
   * @param {Discord.Client} bot The instance of the discord client
   * @param {sqlite.Database} db The instance of the database
   */
  executeOwner(message, args, bot, db) {
    if (args[0] !== undefined && args[0] === this.code) {
      this.logEval(`${message.author.username} executed an eval: `);
      this.logEval(message.content, 1);

      let expression = args.splice(1).join(' ');
      let result = '';
      try {
        result = eval(expression);
      } catch (e) {
        message.channel.sendType(Tsubaki.Style.error(
          `Whoops! I got an error: ${e.message}. See console for stack trace.`
        ), 10000);

        this.logEval('Eval threw an error!');
        this.logEval('Command:');
        this.logEval(expression, 1);
        this.logEval('Error:');
        this.logEval(e.stack, 1);
      }
      if (result !== Object(result)) {
        message.channel.sendType(Tsubaki.Style.codeBlock(result), 20000);
      }
    } else {
      message.channel.sendType(Tsubaki.Style.notFound(), 10000);
    }

    // Generate a new code and print to console
    this.logEval('Next code: ' + (this.code = this.randString()));
  }

  /**
   * Generate a random string
   * @return {string} The generated string
   */
  randString() {
    let text = '';
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
      + '0123456789!@#$%^&*()_+-=[]\\{}|;\':",./<>?';

    for (let i = 0; i < 16; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
  }

  /**
   * Logs a message with an [Eval] prefix
   * @param {string} msg The message to log
   * @param {number} indent The number of levels to indent
   */
  logEval(msg, indent = 0) {
    msg.split('\n').forEach((logLine) => {
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
