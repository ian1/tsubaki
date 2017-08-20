const ytdl = require('ytdl-core');

class Music {
  constructor(musicChannel) {
    this.musicChannel = musicChannel;
    this.queue = [];
    this.playing = undefined;
    this.dispatcher = { paused: true };
  }

  clearQueue() {
    this.queue = [];
  }

  getMusicChannel() {
    return this.musicChannel;
  }

  addToQueue(video) {
    if (this.playing !== undefined && this.playing.id === video.id) return 0;
    this.queue.forEach(queueVid => {
      if (queueVid.id === video.id) {
        return 0;
      }
    });
      
    this.queue.push(video);
    if (this.play()) {
      return 1; // Start to play
    } else {
      return 2; // Already playing
    }
  }

  getQueue() {
    return this.queue;
  }

  isPlaying() {
    return !(this.dispatcher.paused);
  }

  getPlaying() {
    return this.playing;
  }

  getDispatcher() {
    return this.dispatcher;
  }

  play() {
    if (this.playing != undefined) {
      return false;
    }

    if (this.queue.length == 0) {
      this.musicChannel.leave();
      return false;
    }

    this.musicChannel.join().then((connection => {
      const video = this.queue.shift();

      this.playing = video;

      this.dispatcher = connection.playStream(ytdl('https://www.youtube.com/watch?v=' + video.id
        , { filter: 'audioonly' }), { seek: 0, volume: (0.5) });

      connection.on('error', ((error) => {
        // Skip to the next song.
        console.log(error);
        this.playing = undefined;
        this.play();
      }).bind(this));

      this.dispatcher.on('error', ((error) => {
        // Skip to the next song.
        console.log(error);
        this.playing = undefined;
        this.play();
      }).bind(this));

      this.dispatcher.on('end', (() => {
        if (this.playing === video) {
          this.playing = undefined;
          // Wait a second
          setTimeout(this.play.bind(this), 1000);
        }  
      }).bind(this));
    }).bind(this)).catch((error) => {
      console.log(error);
    });
    return true;
  }

  leave() {
    this.playing = undefined;
    this.musicChannel.leave();
  }

  skip() {
    this.musicChannel.leave();
    setTimeout(this.play.bind(this), 2000);
  }

  resume() {
    if (this.dispatcher.paused) {
      this.dispatcher.resume();
      return true;
    }
    return false; // Already playing
  }

  pause() {
    if (!this.dispatcher.paused) {
      this.dispatcher.pause();
      return true;
    }
    return false; // Already paused
  }

  static getMusic(musicChannel) {
    if (musicChannel === undefined) return undefined;
    if (Music.channels === undefined) {
      Music.channels = [];
    }

    let foundMusic = undefined;
    Music.channels.forEach((music) => {
      if (music.getMusicChannel().id == musicChannel.id) {
        foundMusic = music;
        return;
      }
    });

    if (foundMusic === undefined) {
      let music = new Music(musicChannel);
      Music.channels.push(music);
      return music;
    }
    return foundMusic;
  }
}

module.exports = Music;