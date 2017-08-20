const Tsubaki = require('../../Tsubaki.js');
const Discord = require('discord.js');

const Command = require('../Command.js');

const execFile = require('child_process').execFile;
let http = require('http');
let path = require('path');
let fs = require('fs');

const Music = require('./Music.js');

let binPath = path.join(__dirname, '../../node_modules/youtube-dl/bin');
let detailsPath = path.join(binPath, 'details');
let ytdlBinary;

if (fs.existsSync(detailsPath)) {
  let details = JSON.parse(fs.readFileSync(detailsPath));
  ytdlBinary = (details.path) ? details.path : path.resolve(binPath, details.exec);
}

let cutOff = 100;

class Queue extends Command {
  constructor() {
    super('queue', 'Add a song, list, or clear the queue.', ' [song name|song url|clear]');
  }

  execute(message, args, bot, db) {
    let music = Music.getMusic(message.member.voiceChannel);
    if (music === undefined) {
      message.channel.sendTemp(Tsubaki.Style.warn('You aren\'t in a voice channel!'
        , Tsubaki.name + ' music'), 10000);
    } else {
      if (args.length == 0) {
        let text = music.getQueue().map((video, index) => (
          (index + 1) + ': ' + video.title
        )).join('\n');

        let status = 'Paused';
        if (music.isPlaying() && music.getPlaying() !== undefined) {
          status = 'Playing ' + music.getPlaying().title;
        }

        var embed = new Discord.RichEmbed()
          .setTitle(Tsubaki.name + ' music')
          .addField('Status', status);
        if (text !== undefined && text != '') {
          embed.addField('Queue', text);
        }

        message.channel.sendTemp({ embed: embed }, 30000);
        return;
      }

      if (args[0].toLowerCase() === "clear"
        && message.member !== undefined && message.member.hasPermission(Tsubaki.adminPermission)) {
        music.clearQueue();
        message.channel.sendTemp(Tsubaki.Style.success('Queue cleared!'
          , Tsubaki.name + ' music on ' + music.getMusicChannel().name), 10000);
      } else {
        message.channel.send('Searching...').then(response => {
          let searchString = args.join(' ');

          if (!searchString.toLowerCase().startsWith('http')) {
            searchString = 'ytsearch3:' + searchString;
          } else {
            searchString = searchString.replace('/&list=.+/', '');
            console.log(searchString);
          }
          
          execFile(ytdlBinary, [searchString, '-q', '--no-warnings', '--force-ipv4', '--get-title'
            , '--get-id', '--get-thumbnail', '--get-description', '--get-duration'], {
              timeout: 60000,
            }, (err, stdout, stderr) => {
              if (err || stderr.length > 5) {
                console.log(err);
                console.log(stderr);
                return response.editTemp(Tsubaki.Style.warn('Invalid video!'), 10000);
              }

              let chunk = stdout.split('\nhttps://i.ytimg.com'); // 5 chunks: title, id, thumbnail, [description], duration
              // Split by finding the thumbnail url, then get elements above and below

              if (chunk.length < 2) {
                return response.editTemp(Tsubaki.Style.warn('Invalid video!'), 10000);
              }

              let songs = [];
              for (var i = 1, len = chunk.length; i < len; i++) {
                let linesPre = chunk[i - 1].split('\n');
                let linesPost = chunk[i].split('\n');

                let song = {};

                song.id = linesPre.pop(); // id is the last element of the previous chunk
                song.title = linesPre.pop(); // with id removed, title is now the last element

                song.thumbnail = 'https://i.ytimg.com' + linesPost.shift(); // thumb is the first element of this chunk

                if (i != len - 1) {
                  linesPost.pop(); // remove the last 2 elements (they're for next section)
                }
                linesPost.pop(); // last section ends with new line, so remove anyways

                song.duration = linesPost.pop(); // duration is now the last element of this chunk
                song.description = linesPost.join('\n'); // description is now the only element left

                if (song.description.length > cutOff) {

                  let descTail = song.description.substring(cutOff); // Splits the desc at the cut off
                  let loc = descTail.indexOf(' '); // Finds the first instance of ' ' after cut off
                  song.description = song.description.substring(0, cutOff + loc) + ' ...'; // Set the description to that shortened version
                }

                songs.push(song);
              }

              if (songs.length > 1) {
                response.editTemp(Tsubaki.Style.embed(undefined, 'Search results for ' + searchString, Tsubaki.Style.green
                  , Tsubaki.name + ' music on ' + music.getMusicChannel().name), 30000);
                
                songs.forEach(songInfo => {
                  let embed = new Discord.RichEmbed()
                    .setDescription(Tsubaki.Style.bold(songInfo.title) + '\n'
                    + songInfo.description)
                    .setFooter('https://www.youtube.com/watch?v=' + songInfo.id + ' . . . . . ' + songInfo.duration)
                    .setThumbnail(songInfo.thumbnail);
                  message.channel.sendTemp({ embed: embed }, 30000);
                })
              } else {
                if (music.addToQueue(songs[0])) {
                  response.editTemp(Tsubaki.Style.success('Playing: ' + songs[0].title
                    , Tsubaki.name + ' music on ' + music.getMusicChannel().name), 10000);
                } else {
                  response.editTemp(Tsubaki.Style.success('Queued: ' + songs[0].title
                    , Tsubaki.name + ' music on ' + music.getMusicChannel().name), 10000);
                }
              }
          });
        }).catch(console.error);
      }
    }
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