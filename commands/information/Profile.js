const Tsubaki = require('../../Tsubaki.js');
const Discord = require('discord.js');

const Command = require('../Command.js');
const fs = require('fs');
const https = require('https');
const gm = require('gm');

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
                  this.getSize(text, width, height, fontSize - 3).then((fontSize) => {
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

    let width = 300;
    let height = width;
    let boxWidth = 280;
    let boxHeight = 40;
    let boxX = 10;
    let boxY = 100;

    let textRegionWidth = boxWidth - 120;
    let textRegionHeight = boxHeight - 10;
    let textRegionX = boxX + 105;
    let textRegionY = boxY + 5;

    let profBorderWidth = 2;

    let profWidth = 80;
    let profHeight = profWidth;
    let profX = ((textRegionX - boxX - profWidth) / 2) + boxX;
    let profY = boxY + boxHeight + profBorderWidth - profHeight + 5;

    let text = profileMention.username;

    let name = '';
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
      + 'abcdefghijklmnopqrstuvwxyz';

    for (let i = 0; i < 64; i++) {
      name += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    let file = fs.createWriteStream(name + '.png');

    https.get(profileMention.displayAvatarURL, (response) => {
      response.pipe(file);
    });

    this.getSize(text, textRegionWidth, textRegionHeight).then((fontSize) => {
      https.get(profileMention.displayAvatarURL, (response) => {
        gm(response, 'image.png')
          .autoOrient()
          .resize(width, height)
          .blur(5, 5)

          .fill('#00000060')
          .drawRectangle(boxX, boxY, boxX + boxWidth, boxY + boxHeight)

          .fill('#ffffff00')
          .drawRectangle(profX - profBorderWidth, profY - profBorderWidth, profX + profWidth + profBorderWidth, profY + profHeight + profBorderWidth)

          .draw(`image over ${profX},${profY + 1} ${profWidth},${profHeight} ${name}.png`)
          .draw(`image over ${profX},${profY} ${profWidth},${profHeight} ${name}.png`)

          .fill('#FF000000')
          //.drawRectangle(profX, profY, profX + profWidth, profY + profHeight)

          .region(textRegionWidth, textRegionHeight, textRegionX, textRegionY)
          .gravity('Center')
          .fill('#ffffff00')
          .fontSize(fontSize)
          .font('Calibri')
          .drawText(0, 0, text)

          .toBuffer('PNG', (err, imgBuffer) => {
            if (err) console.log(err);
            fs.unlink(name + '.png');
            message.channel.sendTemp({
              files: [{
                attachment: imgBuffer,
                name: `${profileMention}'s profile`,
            }] }, 30000);
          });
      });
    }).catch((err) => {
      console.log(err);
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
