const Tsubaki = require("../../Tsubaki.js");
const Discord = require("discord.js");

let _super = require("../Command.js").prototype;
let method = Eval.prototype = Object.create(_super);
let code = randString();

method.constructor = Eval;

function Eval() {
  _super.constructor.apply(this, ["eval", 'Evaluates the provided javascript.', ' <code> <javascript>']);
  logEval('First code: ' + code)
}

method.executeAdmin = function (message, args, bot, db) {
  logEval(message.author.name + ' executed an eval: ');
  logEval(message.content, 1);

  let expression = args.splice(1).join(' ');
  let result = '';
  try {
    result = eval(expression);
  } catch (e) {
    message.channel.send({ embed: Tsubaki.Style.error('Whoops! I got an error: ' + e.message + '. See console for stack trace.') });
    
    logEval('Eval threw an error!');
    logEval('Command:');
    logEval(expression, 1);
    logEval('Error:');
    logEval(e.stack, 1);
    return;
  }
  if (result !== Object(result)) {
    message.channel.send(Tsubaki.Style.codeBlock(result, ''));
  }
}

method.execute = function (message, args, bot, db) {
  if (message.member !== undefined && (message.member.id === Tsubaki.ianId || message.member.id === Tsubaki.davidId)
    && args[0] !== undefined && args[0] === code) {
    this.executeAdmin(message, args, bot, db);
  } else {
    message.channel.send({ embed: Tsubaki.Style.notFound() });
  }
  logEval('Next code: ' + (code = randString())); // Generate a new code and print to console
}

function randString() {
  let text = '';
  let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]\\{}|;\':",./<>?';

  for (let i = 0; i < 16; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
}

function logEval(msg, indent = 0) {
  msg.split('\n').forEach(logLine => {
    line = '[EVAL] ';
    for (let i = 0; i < indent; i++) {
      line += '    ';
    }
    line += logLine;

    console.log(line);
  });
}

module.exports = Eval;