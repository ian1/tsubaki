const Tsubaki = require('../../Tsubaki.js');
const Discord = require('discord.js');

const Command = require('../Command.js');
const fs = require('fs');
const rimraf = require('rimraf');
const https = require('https');
const http = require('http');
const gm = require('gm');

let width = 300;
let height = width;

let profWidth = 80;
let profHeight = profWidth;
let profX = (width - profWidth) / 2;
let profY = 10;
let profRadius = profWidth / 2;
let profOX = profX + profWidth / 2;
let profOY = profY + profHeight / 2;

let nameBoxWidth = 280;
let nameBoxHeight = 40;
let nameBoxX = 10;
let nameBoxY = profY + profHeight - 3;

let textRegionWidth = nameBoxWidth - 10;
let textRegionHeight = nameBoxHeight - 10;
let textRegionX = nameBoxX + 5;
let textRegionY = nameBoxY + 5;

let profBorderWidth = 3;

let mainBoxWidth = nameBoxX + nameBoxWidth - textRegionX;
let mainBoxHeight = height - nameBoxY - nameBoxHeight - 10;
let mainBoxX = textRegionX;
let mainBoxY = nameBoxY + nameBoxHeight;

let sideBoxWidth = nameBoxWidth - mainBoxWidth;
let sideBoxHeight = mainBoxHeight;
let sideBoxX = nameBoxX;
let sideBoxY = mainBoxY;

let font = process.env['HOME'] + '/.fonts/EncodeSansSemiCondensed-Regular.ttf';
let fontBold = process.env['HOME'] + '/.fonts/EncodeSansSemiCondensed-Bold.ttf';
let pointsBar = '#BF42F400';
let devColor = '#2BBBEF00';

/** The pinfo command */
class pinfo extends Command {
  /** Create the command */
  constructor() {
    super(
      'pinfo', 'Will show your pinfo or the mentioned pinfo.'
      , ' [@mention]'
    );
  }

  /**
   * @param {Discord.Message} message The sent command
   * @param {string[]} args The arguments in the command
   * @param {Discord.Client} bot The instance of the discord client
   * @param {sqlite.Database} db The instance of the database
   */
  executeNew(message, args, bot, db) {
    let pinfoMention = message.mentions.users.first();
    if (pinfoMention == '' || pinfoMention === undefined) {
      if (args.length === 0) {
        pinfoMention = message.author;
      } else {
        message.channel.sendType(Tsubaki.Style.unknownUser() );
        return;
      }
    }

    let name = pinfoMention.username;

    let dir = '';
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
      + 'abcdefghijklmnopqrstuvwxyz';

    for (let i = 0; i < 8; i++) {
      dir += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    fs.mkdirSync(dir);

    let fontInfo;

    pinfo.getP(pinfoMention.displayAvatarURL).then((response) => {
      // response.pipe(file);
      return pinfo.createAvatar(response, dir);
    }).then(() => {
      return pinfo.getSize(name, textRegionWidth - 100, textRegionHeight, 20);
    }).then((info) => {
      fontInfo = info;
      return Tsubaki.getPoints(pinfoMention.id);
    }).then((points) => {
      return pinfo.drawpinfo(pinfoMention, points, dir, fontInfo.size, fontInfo.width);
    }).then((imgBuffer) => {
      message.channel.sendType({
        files: [{
          attachment: imgBuffer,
          name: pinfoMention.username + '.gif',
        }],
      } );
    }).catch((err) => { 
      console.log(err);
    });
  }

  /**
   * Run http or https get as a promise
   * @param {string} url
   * @return {Promise.<IncomingMessage, Error>}
   */
  static getP(url) {
    return new Promise((resolve, reject) => {
      if ((url).startsWith('https')) {
        https.get(url, (res) => {
          resolve(res);
        }).on('error', (e) => {
          reject(e);
        });
      } else {
        http.get(url, (res) => {
          resolve(res);
        }).on('error', (e) => {
          reject(e);
        });
      }
    });
  }

  /**
   * Creates the avatar as a 320x320 circle image
   * @param {IncomingMessage} image The image
   * @param {string} dir The directory to save the images
   * @return {Promise.<string, Error>} A buffer of the drawn image if resolved.
   * an error if rejected
   */
  static createAvatar(image, dir) {
    return new Promise((resolve, reject) => {
      gm(image, 'image.png')
        .command('convert')
        .in('-thumbnail', '320x320^')
        .in('-extent', '320x320')

        .write(`${dir}/avatar-pre.png`, (err) => {
          if (err) reject(err);

          gm()
            .command('convert')
            .in('-size', '320x320')
            .in('xc:none')
            .in('-fill', 'white')
            .drawCircle(160, 160, 160, 2)

            .write(`${dir}/circle.png`, (err) => {
              if (err) reject(err);

              gm()
                .command('composite')
                .in('-compose', 'CopyOpacity')
                .in(`${dir}/circle.png`)
                .in(`${dir}/avatar-pre.png`)
                .write(`${dir}/avatar.png`, (err) => {
                  if (err) reject(err);
                  resolve();
                });
            });
        });
    });
  }

  /**
   * Fits text within boundaries by reducing font size
   * @param {string} text The text to fit
   * @param {number} width The maximum width
   * @param {number} height The maximum height
   * @param {number} fontSize The starting font size
   * @return {Promise} The largest font size that fits in the boundaries
   */
  static getSize(text, width, height, fontSize = 30) {
    return new Promise((resolve, reject) => {
      gm(1000, 500, '#ffffff00')
        .fontSize(fontSize)
        .font(font)
        .gravity('Center')
        .drawText(0, 0, text)

        .toBuffer('PNG', (err, buffer) => {
          if (err) reject(err);
          gm(buffer, 'image.png')
            .trim()

            .toBuffer('PNG', (err, buffer2) => {
              gm(buffer2, 'image.png').size((err, size) => {
                if (err) reject(err);

                if (size.width >= width || size.height >= height) {
                  pinfo.getSize(text, width, height, fontSize - 5)
                    .then((fontInfo) => {
                      resolve(fontInfo);
                    }).catch((err) => {
                      reject(err);
                    });
                } else {
                  resolve({size: fontSize, width: size.width});
                }
              });
            });
        });
    });
  }

  /**
   * 
   * @param {Discord.User} pinfo The user's pinfo
   * @param {number} points The number of points the user has
   * @param {string} dir The temporary directory for the files
   * @param {number} fontSize The font size for the name
   * @param {number} nameWidth The width of the name at that font size
   * @return {Promise.<string, Error>} A buffer of the drawn image if resolved,
   * an error if rejected
   */
  static drawpinfo(pinfo, points, dir, fontSize, nameWidth) {
    let name = pinfo.username;

    let level = Tsubaki.getLevelR(points);
    let levelPoints = Tsubaki.getPointsFor(level);
    let nextLevelPoints = Tsubaki.getPointsFor(level + 1);
    let pointsBetween = nextLevelPoints - levelPoints;
    let pointsOver = points - levelPoints;
    let percentStep = pointsOver * 1.0 / (pointsBetween * 19);

    let avatar = `${dir}/avatar.png`;

    let role = '';
    let roleColor = '#FFFFFFFF';

    if (pinfo.id === Tsubaki.ianId || pinfo.id === Tsubaki.davidId) {
      role = 'Dev';
      roleColor = devColor;
    }

    return new Promise((resolve, reject) => {
    // replace avatar with background
    pinfo.getP(pinfo.displayAvatarURL).then((response) => {
        gm(response, 'image.png')
          .autoOrient()
          .resize(width, height)
          .blur(5, 5)

          .fill('#00000060')
          .drawRectangle(
            nameBoxX
            , nameBoxY
            , nameBoxX + nameBoxWidth
            , nameBoxY + nameBoxHeight
          )

          .fill('#FFFFFF60')
          .drawRectangle(
            mainBoxX
            , mainBoxY
            , mainBoxX + mainBoxWidth
            , mainBoxY + mainBoxHeight
          )

          .fill('#80808060')
          .drawRectangle(
            sideBoxX
            , sideBoxY
            , sideBoxX + sideBoxWidth
            , sideBoxY + sideBoxHeight
          )

          .fill('#FFFFFF00')
          .drawCircle(
            profOX
            , profOY
            , profOX + profRadius + profBorderWidth
            , profOY
          )

          .draw(
            `image over`
            + ` ${profX},${profY}`
            + ` ${profWidth},${profHeight}`
            + ` ${avatar}`
          )

          .fill('#000000D0')
          .drawCircle(
            profOX
            , profOY
            , profOX + profRadius
            , profOY
          )

          .fill('#FFFFFF00')
          .fontSize(40)
          .font(fontBold)
          .region(profWidth, profHeight, profX, profY - 10)
          .gravity('Center')
          .drawText(0, 0, level)

          .region(textRegionWidth, textRegionHeight, textRegionX, textRegionY)
          .gravity('Center')
          .fontSize(fontSize)
          .font(font)
          .drawText(0, 0, name)

          .region((textRegionWidth - nameWidth) / 2 - 10, textRegionHeight, textRegionX, textRegionY)
          .gravity('East')
          .font(fontBold)
          .fill(roleColor)
          .drawText(0, 0, role)

          .write(`${dir}/template.png`, (err) => {
            if (err) reject(err);
            let parts = 0;

            for (let i = 0; i < 20; i++) {
              let percentage = percentStep * i;

              let largeArc = percentage >= 0.5 ? '1' : '0';
              let endDegree = percentage * 2 * Math.PI;
              let progRadius = profRadius + profBorderWidth / 2;
              let progX = profOX + progRadius * Math.sin(endDegree);
              let progY = profOY - progRadius * Math.cos(endDegree);

              let progPoints = percentage * pointsBetween;
              progPoints = Math.round(progPoints);

              gm(`${dir}/template.png`)
                .fill('#FFFFFFFF')
                .stroke(pointsBar, profBorderWidth)
                .draw( // https://www.w3.org/TR/SVG/paths.html#PathDataEllipticalArcCommands
                  `path 'M ${profOX},${profOY - progRadius}`
                  + `  A ${progRadius},${progRadius}`
                  + ` 0 ${largeArc},1 ${progX},${progY}'`
                )

                .fill('#FFFFFF00')
                .stroke('#FFFFFFFF', 0)
                .font(font)
                .fontSize(10)
                .region(profWidth, profHeight - 15, profX, profY)
                .gravity('South')
                .drawText(0, 0, `${progPoints} / ${pointsBetween}`)
                .write(`${dir}/part-${i}.png`, (err) => {
                  if (err) reject(err);
                  if (++parts >= 20) {
                    pinfo.toGif(dir).then((imgBuffer) => {
                      resolve(imgBuffer);
                    });
                  }
                });
            }
          });
      });
    });
  }

  /**
   * Combine all parts into gif
   * @param {string} dir The temporary directory for the files
   * @return {Promise}
   */
  static toGif(dir) {
    return new Promise((resolve, reject) => {
      let g = gm();
      g.in(`${dir}/part-19.png`);
      for (let i = 0; i < 20; i++) {
        g.in(`${dir}/part-${i}.png`);
      }
      g.delay(3)
        .loop(1)
        .toBuffer('gif', (err, imgBuffer) => {
        if (err) reject(err);
        rimraf(dir, (err) => {
          if (err) console.log(err);
        });
        resolve(imgBuffer);
      });
    });
  }

  /**
   * @param {Discord.Message} message The sent command
   * @param {string[]} args The arguments in the command
   * @param {Discord.Client} bot The instance of the discord client
   * @param {sqlite.Database} db The instance of the database
   */
  execute(message, args, bot, db) {
    if (args.length >= 1 && args[0].toLowerCase() === 'beta') {
      this.executeNew(message, args.slice(1), bot, db);
      return;
    }
    let pinfoMention = message.mentions.users.first();
    if (pinfoMention == '' || pinfoMention === undefined) {
      if (args.length === 0) {
        pinfoMention = message.author;
      } else {
        message.channel.sendType(Tsubaki.Style.unknownUser() );
        return;
      }
    }

    let color = Tsubaki.color.gray;
    switch (pinfoMention.presence.status) {
      case 'online':
        color = Tsubaki.color.green;
        break;
      case 'offline':
        color = Tsubaki.color.red;
        break;
      case 'idle':
        color = Tsubaki.color.yellow;
        break;
    }

    let guildMember = message.member;
    let roleList = guildMember.roles.array();

    Tsubaki.getPoints(pinfoMention.id).then((points) => {
      let pinfoEmbed = new Discord.RichEmbed()
        .setDescription(`**__${guildMember.displayName}__**`)
        .addField('Full Username', pinfoMention.tag, true)
        .addField('ID', pinfoMention.id, true)
        .addField(
        'Banana'
        , `Level ${Tsubaki.getLevelR(points)}, with ${points} Bananas`
        , true
        )
        .addField('Roles', roleList.join(' '), true)
        .setThumbnail(pinfoMention.displayAvatarURL)
        .setFooter(`Member since ${pinfo.formatDate(guildMember.joinedAt)}`
        + `, Discorder since ${pinfo.formatDate(pinfoMention.createdAt)}`)
        .setColor(color);
      message.channel.sendType({embed: pinfoEmbed} );
    });
  }

  /**
   * Formats the provided date
   * @param {Date} date The date object
   * @return {string} The formated date
   */
  static formatDate(date) {
    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
    ];

    return `${date.getDate()} ${monthNames[date.getMonth()]}`
      + ` ${date.getFullYear()}`;
  }
}

module.exports = pinfo;
