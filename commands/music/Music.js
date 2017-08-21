const ytdl = require('ytdl-core');

/** The music manager */
class Music {
  /**
   * Create an instance of music
   * @param {Discord.VoiceChannel} musicChannel The channel to play music on
   */
  constructor(musicChannel) {
    this.musicChannel = musicChannel;
    this.queue = [];
    this.playing = undefined;
    this.dispatcher = {paused: true};
  }

  /** Clear the queue */
  clearQueue() {
    this.queue = [];
  }

  /**
   * Get the music channel
   * @return {Discord.VoiceChannel} the music channel
   */
  getMusicChannel() {
    return this.musicChannel;
  }

  /**
   * Add a video to the queue
   * @see Queue
   * @param {Object} video The video info
   * @return {number} The status. 0 if already in queue, 1 if music is starting
   * to play, 2 if music is already playing
   */
  addToQueue(video) {
    if (this.playing !== undefined && this.playing.id === video.id) return 0;
    this.queue.forEach((queueVid) => {
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

  /**
   * Get the queue
   * @see Queue
   * @return {Object[]} The queue
   */
  getQueue() {
    return this.queue;
  }

  /**
   * Get whether music is playing
   * @return {boolean} True if dispatcher is playing, false if paused
   */
  isPlaying() {
    return !(this.dispatcher.paused);
  }

  /**
   * Get the current playing song
   * @return {Object} the video info
   */
  getPlaying() {
    return this.playing;
  }

  /**
   * Get the dispatcher
   * @return {Discord.StreamDispatcher} The dispatcher
   */
  getDispatcher() {
    return this.dispatcher;
  }

  /**
   * Play the next queued song
   * @return {boolean} True if starting to play, false otherwise
   */
  play() {
    if (this.playing != undefined) {
      return false;
    }

    if (this.queue.length == 0) {
      this.musicChannel.leave();
      return false;
    }

    this.musicChannel.join().then(((connection) => {
      const video = this.queue.shift();

      this.playing = video;

      this.dispatcher = connection.playStream(ytdl('https://www.youtube.com/watch?v=' + video.id
        , {filter: 'audioonly'}), {seek: 0, volume: (0.5)});

      connection.on('error', ((error) => {
        // Skip to the next song.
        console.log(error);
        this.playing = undefined;
        this.play();
      }));

      this.dispatcher.on('error', ((error) => {
        // Skip to the next song.
        console.log(error);
        this.playing = undefined;
        this.play();
      }));

      this.dispatcher.on('end', (() => {
        if (this.playing === video) {
          this.playing = undefined;
          // Wait a second
          setTimeout(this.play.bind(this), 1000);
        }
      }));
    })).catch((error) => {
      console.log(error);
    });
    return true;
  }

  /**
   * Remove Tsubaki from the music channel
   * @see Leave
   */
  leave() {
    this.playing = undefined;
    this.musicChannel.leave();
  }

  /**
   * Skip the current song
   * @see Skip
   */
  skip() {
    this.musicChannel.leave();
    setTimeout(this.play.bind(this), 2000);
  }

  /**
   * Resume playback
   * @see Play
   * @return {boolean} True playback status changed
   */
  resume() {
    if (this.dispatcher.paused) {
      this.dispatcher.resume();
      return true;
    }
    return false; // Already playing
  }

  /**
   * Pause playback
   * @see Pause
   * @return {boolean} True playback status changed
   */
  pause() {
    if (!this.dispatcher.paused) {
      this.dispatcher.pause();
      return true;
    }
    return false; // Already paused
  }

  /**
   * Get the music instance from its voice channel
   * @param {Discord.VoiceChannel} musicChannel The voice channel
   * @return {Music} The music instance
   */
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
