const Tsubaki = require('../../Tsubaki.js');
const Discord = require('discord.js');

const Command = require('../Command.js');
const fs = require('fs');
const https = require('https');
const gm = require('gm');

let width = 300,
  height = width,

  profWidth = 80,
  profHeight = profWidth,
  profX = ((width - profWidth) / 2),
  profY = 10,

  nameBoxWidth = 280,
  nameBoxHeight = 40,
  nameBoxX = 10,
  nameBoxY = profY + profHeight + 10,

  textRegionWidth = nameBoxWidth - 10,
  textRegionHeight = nameBoxHeight - 10,
  textRegionX = nameBoxX + 5,
  textRegionY = nameBoxY + 5,

  profBorderWidth = 2,

  mainBoxWidth = nameBoxX + nameBoxWidth - textRegionX,
  mainBoxHeight = height - nameBoxY - nameBoxHeight - 10,
  mainBoxX = textRegionX,
  mainBoxY = nameBoxY + nameBoxHeight,

  sideBoxWidth = nameBoxWidth - mainBoxWidth,
  sideBoxHeight = mainBoxHeight,
  sideBoxX = nameBoxX,
  sideBoxY = mainBoxY;

/** The profile command */
class Profile extends Command {
  /** Create the command */
  constructor() {
    super(
      'profile', 'Will show your profile or the mentioned profile.'
      , ' [@mention]'
    );
  }

  getSize(text, width, height, fontSize = 30) {
    return new Promise((resolve, reject) => {
      gm(1000, 500, '#ffffff00')
        .fontSize(fontSize)
        .font('Calibri')
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
                  this.getSize(text, width, height, fontSize - 5).then((fontSize) => {
                    resolve(fontSize)
                  }).catch((err) => {
                    reject(err)
                  });
                } else {
                  resolve(fontSize);
                }
              });
            });
        });
    });
  }

  drawProfile(profile, fileName, fontSize) {
    let name = profile.username;

    return new Promise((resolve, reject) => {
      https.get(profile.displayAvatarURL, (response) => {
        gm(response, 'image.png')
          .autoOrient()
          .resize(width, height)
          .blur(5, 5)

          .fill('#00000060')
          .drawRectangle(nameBoxX, nameBoxY, nameBoxX + nameBoxWidth, nameBoxY + nameBoxHeight)

          .fill('#FFFFFF60')
          .drawRectangle(mainBoxX, mainBoxY, mainBoxX + mainBoxWidth, mainBoxY + mainBoxHeight)

          .fill('#80808060')
          .drawRectangle(sideBoxX, sideBoxY, sideBoxX + sideBoxWidth, sideBoxY + sideBoxHeight)

          .fill('#FFFFFF00')
          .drawRectangle(profX - profBorderWidth, profY - profBorderWidth
          , profX + profWidth + profBorderWidth, profY + profHeight + profBorderWidth)

          .draw(`image over ${profX},${profY + 1} ${profWidth},${profHeight} ${fileName}.png`)
          .draw(`image over ${profX},${profY} ${profWidth},${profHeight} ${fileName}.png`)

          .fill('#FF000000')
          //.drawRectangle(profX, profY, profX + profWidth, profY + profHeight)

          .region(textRegionWidth, textRegionHeight, textRegionX, textRegionY)
          .gravity('Center')
          .fill('#ffffff00')
          .fontSize(fontSize)
          .font('Calibri')
          .drawText(0, 0, name)

          .toBuffer('PNG', (err, imgBuffer) => {
            if (err) reject(err);
            fs.unlink(fileName + '.png');
            resolve(imgBuffer);
          });
      });
    });
  }

  /**
   * @param {Discord.Message} message The sent command
   * @param {string[]} args The arguments in the command
   * @param {Discord.Client} bot The instance of the discord client
   * @param {sqlite.Database} db The instance of the database
   */
  executeNew(message, args, bot, db) {
    let profileMention = message.mentions.users.first();
    if (profileMention == '' || profileMention === undefined) {
      if (args.length === 0) {
        profileMention = message.author;
      } else {
        message.channel.sendType(Tsubaki.Style.unknownUser(), 10000);
        return;
      }
    }

    let name = profileMention.username;

    let fileName = '';
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
      + 'abcdefghijklmnopqrstuvwxyz';

    for (let i = 0; i < 64; i++) {
      fileName += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    let file = fs.createWriteStream(fileName + '.png');

    https.get(profileMention.displayAvatarURL, (response) => {
      response.pipe(file);

      response.on('end', () => { 
        this.getSize(name, textRegionWidth, textRegionHeight).then((fontSize) => {
          this.drawProfile(profileMention, fileName, fontSize).then((imgBuffer) => {
            message.channel.sendTemp({
              files: [{
                attachment: imgBuffer,
                name: 'profile.png',
              }]
            }, 30000);
          });
        }).catch((err) => {
          console.log(err);
        });
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
    let profileMention = message.mentions.users.first();
    if (profileMention == '' || profileMention === undefined) {
      if (args.length === 0) {
        profileMention = message.author;
      } else {
        message.channel.sendType(Tsubaki.Style.unknownUser(), 10000);
        return;
      }
    }

    let color = Tsubaki.color.gray;
    switch (profileMention.presence.status) {
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

    Tsubaki.getPoints(profileMention.id, (points) => {
      let profileEmbed = new Discord.RichEmbed()
        .setDescription(`**__${guildMember.displayName}__**`)
        .addField('Full Username', profileMention.tag, true)
        .addField('ID', profileMention.id, true)
        .addField(
        'Banana'
        , `Level ${Tsubaki.getLevelR(points)}, with ${points} Bananas`
        , true
        )
        .addField('Roles', roleList.join(' '), true)
        .setThumbnail(profileMention.displayAvatarURL)
        .setFooter(`Member since ${Profile.formatDate(guildMember.joinedAt)}`
        + `, Discorder since ${Profile.formatDate(profileMention.createdAt)}`)
        .setColor(color);
      message.channel.sendTemp({ embed: profileEmbed }, 20000);
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

module.exports = Profile;
