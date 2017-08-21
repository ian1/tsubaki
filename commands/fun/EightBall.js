const Tsubaki = require('../../Tsubaki.js');
const Command = require('../Command.js');

/** The 8ball command */
class EightBall extends Command {
  /** Create the command */
  constructor() {
    super(
      '8ball', 'Will answer your burning (yes or no) questions.', ' <question>'
    );
  }

  /**
   * The execute command, overrides Command#executeInternal instead of execute,
   * because we don't want to delete the message.
   * @param {Discord.Message} message The sent command
   * @param {string[]} args The arguments in the command
   * @param {Discord.Client} bot The instance of the discord client
   * @param {sqlite.Database} db The instance of the database
   */
  executeInternal(message, args, bot, db) {
    let question = message.content.split(' ')[1];
    let balls = [
      'It is certain!',
      'It is decidedly so!',
      'Without a doubt!',
      'Yes, definitely!',
      'As I see it, yes.',
      'You may rely on it.',
      'Most likely.',
      'Outlook good!',
      'Yes.',
      'Signs point to yes.',
      'Reply hazy, try again.',
      'Ask again later.',
      'Better not tell you now!',
      'Cannot predict now.',
      'Concentrate and ask again!',
      'Don\'t count on it!',
      'My reply is no.',
      'My sources say no.',
      'Outlook not so good.',
      'Very doubful.',
    ];
    let thinking = [
      'I\'m thinking...',
      'Hmm this is a tough question...',
      'Huh. I\'m not sure I know this one. Let me think...',
      'I\'m not sure about this one...',
      'Oh, this one\'s easy!',
    ];
    if (question == '' || question === undefined) {
      message.channel.sendTemp(Tsubaki.Style.warn(
        ':eye_in_speech_bubble: *Give me a question!*'
      ), 10000);
    } else {
      message.channel.sendType(
        `:thinking: *${thinking[Math.floor(Math.random() * thinking.length)]}* `
      ).then((msg) => {
        // Wait for 1 second before sending response.
        setTimeout(() => {
          msg.editTemp(
            msg.content
            + `  **${balls[Math.floor(Math.random() * balls.length)]}**`
            , 20000);
        }, 1000);
      });
    }
  }
}

module.exports = EightBall;
