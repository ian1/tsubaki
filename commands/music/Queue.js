const Tsubaki = require('../../Tsubaki.js');
const Discord = require('discord.js');

const Command = require('../Command.js');

const execFile = require('child_process').execFile;
let path = require('path');
let fs = require('fs');

const Music = require('./Music.js');

let binPath = path.join(__dirname, '../../node_modules/youtube-dl/bin');
let detailsPath = path.join(binPath, 'details');
let ytdlBinary;

if (fs.existsSync(detailsPath)) {
  let details = JSON.parse(fs.readFileSync(detailsPath));
  if (details.path) {
    ytdlBinary = details.path;
  } else {
    ytdlBinary = path.resolve(binPath, details.exec);
  }
}

let cutOff = 100;

/** The queue command */
class Queue extends Command {
  /** Create the command */
  constructor() {
    super(
      'queue'
      , 'Add a song to, list the songs in, or clear the queue.'
      , ' [song name|song url|clear]'
    );
  }

  /**
   * @param {Discord.Message} message The sent command
   * @param {string[]} args The arguments in the command
   * @param {Discord.Client} bot The instance of the discord client
   * @param {sqlite.Database} db The instance of the database
   */
  execute(message, args, bot, db) {
    let music = Music.getMusic(message.member.voiceChannel);
    if (music === undefined) {
      message.channel.sendType(Tsubaki.Style.warn(
        'You aren\'t in a voice channel!'
        , `${Tsubaki.name} music`
      ) );
    } else {
      if (args.length == 0) {
        message.channel.sendType(Queue.getQueue(music)).then((msg) => {
          for (let i = 1; i <= 30; i++) {
            setTimeout(() => {
              msg.edit(Queue.getQueue(music));
            }, i * 1000);
          }
        } );
        return;
      }

      if (args[0].toLowerCase() === 'clear'
        && message.member !== undefined
        && message.member.hasPermission(Tsubaki.adminPermission)) {
        music.clearQueue();
        message.channel.sendType(Tsubaki.Style.success(
          'Queue cleared!'
          , `${Tsubaki.name} music on ${music.getMusicChannel().name}`) );
      } else {
        message.channel.sendType(Tsubaki.Style.embed(
          undefined, 'Searching...', Tsubaki.color.gray
          , `${Tsubaki.name} music on ${music.getMusicChannel().name}`
        )).then((response) => {
          let searchString = args.join(' ');

          if (!searchString.toLowerCase().startsWith('http')) {
            searchString = 'ytsearch5:' + searchString;
          }

          execFile(ytdlBinary
            , [
              searchString,
              '-q',
              '--no-warnings',
              '--force-ipv4',
              '--get-title',
              '--get-id',
              '--get-thumbnail',
              '--get-description',
              '--get-duration',
            ], {
              timeout: 60000,
            }, (err, stdout, stderr) => {
              if (err || stderr.length > 5) {
                console.log(err);
                console.log(stderr);
                response.editTemp(Tsubaki.Style.error('Invalid video!'), 10000);
                return;
              }

              // Split on thumbnail url, then get elements above and below
              // 5 chunks: title, id, thumbnail, [description], duration
              let chunk = stdout.split('\nhttps://i.ytimg.com');

              if (chunk.length < 2) {
                response.editTemp(Tsubaki.Style.error('Invalid video!'), 10000);
                return;
              }

              let songs = [];
              for (let i = 1, len = chunk.length; i < len; i++) {
                let linesPre = chunk[i - 1].split('\n');
                let linesPost = chunk[i].split('\n');

                let song = {};

                // id is the last element of the previous chunk
                song.id = linesPre.pop();

                // with id removed, title is now the last element
                song.title = linesPre.pop();
                song.titleUrl = `[${song.title}]`
                  + `(https://www.youtube.com/watch?v=${song.id})`;

                // thumb is the first element of this chunk
                song.thumbnail = 'https://i.ytimg.com' + linesPost.shift();

                if (i != len - 1) {
                  linesPost.pop(); // remove the last element (for next section)
                }
                // last chunk ends with new line, so remove for both
                linesPost.pop();

                // duration is now the last element of this chunk
                song.duration = linesPost.pop();

                // description is now the only element left. Join into 1 string
                song.description = linesPost.join('\n');

                if (song.description.length > cutOff) {
                  // Splits the desc at the cut off
                  let descTail = song.description.substring(cutOff);

                   // Finds the first instance of ' ' after cut off
                  let loc = descTail.indexOf(' ');

                  // Set the description to that shortened version
                  song.description = song.description
                    .substring(0, cutOff + loc)
                    + ' ...';
                } if (song.description.split('\n').length > 4) {
                  song.description = song.description
                    .split('\n')
                    .slice(0, 4)
                    .join('\n')
                    + ' ...';
                }

                songs.push(song);
              }

              if (songs.length > 1) {
                response.editTemp(Tsubaki.Style.embed(undefined
                  , 'Search results for ' + args.join(' '), Tsubaki.color.green
                  , `${Tsubaki.name} music on ${music.getMusicChannel().name}`
                ) );

                songs.forEach((songInfo) => {
                  let tokenUrl = Tsubaki.createTokenCmd(() => {
                    this.addQueue(music, message, songInfo);
                  });

                  let embed = new Discord.RichEmbed()
                    .setDescription(
                      `**${songInfo.title}**`
                      + ` [Play](${tokenUrl})`
                      + `\n${songInfo.description}`
                    ).setFooter(
                      `https://www.youtube.com/watch?v=${songInfo.id}`
                      + ' . . . . . '
                      + songInfo.duration
                    ).setThumbnail(songInfo.thumbnail);
                  message.channel.sendType({embed: embed} );
                });
              } else {
                response.delete();
                this.addQueue(music, message, songs[0]);
              }
          });
        }).catch(console.error);
      }
    }
  }

  /**
   * Add a song to the queue
   * @param {Music} music The instance of the music class
   * @param {Discord.Message} message The message
   * @param {Object} songInfo The song's info
   * @param {string} songInfo.titleUrl The song's title and url
   */
  addQueue(music, message, songInfo) {
    let response = music.addToQueue(songInfo);
    if (response === 0) {
      message.channel.sendType(Tsubaki.Style.warn(
        songInfo.titleUrl + ' is already queued.'
        , `${Tsubaki.name} music on ${music.getMusicChannel().name}`
      ));
    } else if (response === 1) {
      message.channel.sendType(Tsubaki.Style.success(
        `Playing: ${songInfo.titleUrl}`
        , `${Tsubaki.name} music on ${music.getMusicChannel().name}`
      ) );
    } else if (response === 2) {
      message.channel.sendType(Tsubaki.Style.success(
        `Queued: ${songInfo.titleUrl}`
        , `${Tsubaki.name} music on ${music.getMusicChannel().name}`
      ) );
    }
  }

  /**
   * Get the queue list
   * @param {Music} music The instance of the music class
   * @return {string} The queue list
   */
  static getQueue(music) {
    let text = music.getQueue().map((video, index) => (
      (index + 1) + ': ' + video.titleUrl + ' (' + video.duration + ')'
    )).join('\n');

    let status = 'Paused';
    if (music.isPlaying() && music.getPlaying() !== undefined) {
      let currSong = music.getPlaying();
      let elapsed = Queue.getTime(music.getDispatcher().time);

      status = `Playing ${currSong.titleUrl}`
        + ` (${elapsed} / ${currSong.duration})`;
    }

    let embed = new Discord.RichEmbed()
      .setTitle(`${Tsubaki.name} music`)
      .addField('Status', status);
    if (text !== undefined && text != '') {
      embed.addField('Queue', text);
    } else {
      embed.addField('Queue', 'Empty');
    }

    return {embed: embed};
  }

  /**
   * Formats time (duration)
   * @param {number} milliseconds The time in milliseconds
   * @return {string} The time as H:MM:ss
   */
  static getTime(milliseconds) {
    let seconds = parseInt((milliseconds / 1000) % 60);
    seconds = (seconds < 10) ? '0' + seconds : seconds;
    let minutes = parseInt((milliseconds / (1000 * 60)) % 60);
    let hours = parseInt((milliseconds / (1000 * 60 * 60)) % 24);

    let time = '';

    if (hours > 0) {
      minutes = (minutes < 10) ? '0' + minutes : minutes;
      time = `${hours}:${minutes}:${seconds}`;
    } else {
      time = `${minutes}:${seconds}`;
    }

    return time;
  }
}

module.exports = Queue;

/* EXAMPLE RESPONSE

asdfmovie 1-10 (Complete Collection)
furTlhb-990
https://i.ytimg.com/vi/furTlhb-990/maxresdefault.jpg
Every asdfmovie so far! - More asdfmovie! (https://www.youtube.com/playlist?list=PL3A5849BDE0581B19)
asdfmovie shirts (http://sharkrobot.com/asdfmovie)
Animation + Music Credits Below!

asdfmovie1
James 'GlassCake' Cunningham (animator): http://youtube.com/EpikkuFeiru
Alexander 'Binärpilot' Støver (music): http://binaerpilot.no

asdfmovie2 / asdfmovie2: deleted scenes
Edd 'Eddsworld' Gould (animator): http://www.youtube.com/eddsworld
Stephen 'Sherbethead (music):  http://www.youtube.com/user/sherbetheadmusic

asdfmovie3
Jamie 'RageNineteen' Spicer-Lewis (animator): http://www.youtube.com/ragenineteen
Retrospekt (intro music): http://www.twitter.com/retrospektuk

asdfmovie5:
Jamie 'RageNineteen' Spicer-Lewis (animator): http://www.youtube.com/ragenineteen
Yoav 'TheLivingTombstone' Landau (music): http://youtube.com/thelivingtombstone

asdfmovie4/6/7/deleted scenes/8/9/10
Ben 'Wonchop' Smallman (animator): http://youtube.com/WonchopAnimation
Todd 'LilDeuceDeuce' Bryanton (music): http://youtube.com/LilDeuceDeuce

For cast/additional credits, watch the actual asdfmovies, ya goober.

Main Channel (http://youtube.com/TomSka)
Twitter (http://twitter.com/thetomska)
Facebook (http://fb.com/thetomska)
Tumblr (http://thetomska.tumblr.com)
18:13
asdfmovie10
foFKXS6Nyho
https://i.ytimg.com/vi/foFKXS6Nyho/maxresdefault.jpg
ass-duff-moo-vee-ten - More asdfmovie! https://www.youtube.com/playlist?list=PL3A5849BDE0581B19
asdfmovie t-shirts (http://bit.ly/asdfshirts) download the song (http://bit.ly/beepsheep)
Animated by Ben ‘Wonchop’ Smallman (http://youtube.com/wonchopanimation)

Written and Directed by Thomas Ridgewell (http://youtube.com/tomska)
Music by Todd ‘LilDeuceDeuce’ Bryanton (http://youtube.com/lildeucedeuce)
Additional Animation by David Post (http://youtube.com/Hoolopee)
Featuring Eddie Bowley (http://youtube.com/eddache)
Erin Breslin (http://twitter.com/2ToesUp)
Gabriel ‘Black Gryph0n’ Brown (http://youtube.com/christkids)
Luke ‘LukeIsNotSexy’ Cutforth (http://youtube.com/lukeisnotsexy)
Jack ‘Jacksfilms’ Douglass (http://youtube.com/jacksfilms)
Chloe ‘ScarfDemon’ Dungate (http://youtube.com/scarfdemon)
Elliot ‘ElliotExplicit’ Gough (http://twitter.com/elliotexplicit)
Dan ‘danisnotonfire’ Howell (http://youtube.com/danisnotonfire)
Phil ‘AmazingPhil’ Lester (http://youtube.com/amazingphil)
Sean ‘Jacksepticeye’ McLoughlin (http://youtube.com/jacksepticeye)
Rebecca Parham (http://youtube.com/LetMeExplainStudios)
Jacob and Mike Trueman (http://youtube.com/fratocrats)
and Edd Gould

Art is Dead (the asdf book) (http://amzn.eu/9MeoROd)
Twitter (http://twitter.com/thetomska)
Facebook (http://fb.com/thetomska)
Tumblr (http://thetomska.tumblr.com)
Secondary Channel (http://youtube.com/darksquidge)
2:15
asdfmovie9
8l6T3fwxAyw
https://i.ytimg.com/vi/8l6T3fwxAyw/maxresdefault.jpg
ass-duff-moo-vee-nine - More asdfmovie! https://www.youtube.com/playlist?list=PL3A5849BDE0581B19
asdfmovie t-shirts (http://bit.ly/asdfshirts) download the song (http://bit.ly/asdf9song)
Animated by Ben ‘Wonchop’ Smallman (http://youtube.com/wonchopanimation)
the asdf book (https://youtu.be/I7cDTaMES8I)

Written and Directed by Thomas Ridgewell (http://youtube.com/tomska)
Music by Todd ‘LilDeuceDeuce’ Bryanton (http://youtube.com/lildeucedeuce)
Featuring Chloe Dungate (http://youtube.com/scarfdemon),
Mark Fischbach (http://youtube.com/markiplier),
Dodie Clark (http://youtube.com/doddleoddle)
Phil Lester (http://youtube.com/amazingphil)
Dan Howell (http://youtube.com/danisnotonfire)
Edited by Elliot Gough (http://twitter.com/elliotexpicit)

TomSka Shirts (http://sharkrobot.com/asdfmovie)
Twitter (http://twitter.com/thetomska)
Facebook (http://fb.com/thetomska)
Tumblr (http://thetomska.tumblr.com)
Secondary Channel (http://youtube.com/darksquidge)
1:47
ASDF Movies 1-10
6udb9_rUimM
https://i.ytimg.com/vi/6udb9_rUimM/maxresdefault.jpg
Every asdfmovie as of the time of upload (https://www.youtube.com/playlist?list...)
asdfmovie shirts (http://sharkrobot.com/asdfmovie)
Animation + music credits listed in the video

ASDF Movie 1
James 'GlassCake' Cunningham (animator): http://youtube.com/EpikkuFeiru
Alexander 'Binärpilot' Støver (music): http://binaerpilot.no

ASDF Movie 2/ asdfmovie2: deleted scenes
Edd 'Eddsworld' Gould (animator): http://www.youtube.com/eddsworld
Stephen 'Sherbethead (music): http://www.youtube.com/user/sherbethe...

ASDF Movie 3
Jamie 'RageNineteen' Spicer-Lewis (animator): http://www.youtube.com/ragenineteen
Retrospekt (intro music): http://www.twitter.com/retrospektuk

asdfmovie5:
Jamie 'RageNineteen' Spicer-Lewis (animator): http://www.youtube.com/ragenineteen
Yoav 'TheLivingTombstone' Landau (music): http://youtube.com/thelivingtombstone

asdfmovie4/6/7/deleted scenes/8/9/10
Ben 'Wonchop' Smallman (animator): http://youtube.com/WonchopAnimation
Todd 'LilDeuceDeuce' Bryanton (music): http://youtube.com/LilDeuceDeuce


Main Channel (http://youtube.com/TomSka)
Twitter (http://twitter.com/thetomska)
Facebook (http://fb.com/thetomska)
Tumblr (http://thetomska.tumblr.com)
16:52
Unseen asdf movies (not released)
WTUnwygoFsU
https://i.ytimg.com/vi/WTUnwygoFsU/hqdefault.jpg
I must state that in NO way, shape or form am I intending to infringe rights of the copyright holder. Content used is strictly for research/reviewing purposes and to help educate. All under the Fair Use Law.

"Copyright Disclaimer Under Section 107 of the Copyright Act of 1976, allowance is made for "Fair Use"for purposes such as criticism, comment, news reporting, teaching, scholarship, and research. Fair Use is a use permitted by copyright statute that might otherwise  be infringing. Non-profit, educational or personal use tips the balance in favor of Fair Use".

If I get 3000 subscribers I'll upload again.
if you laughed leave me a sub. ;]
7:30

*/
