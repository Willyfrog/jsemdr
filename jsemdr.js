var times = 0;

var Beeper = function (play_seconds, wait_seconds, frequency) {
  console.log("Creating beeper");
  this.context = new webkitAudioContext();
  this.destination = this.context.destination;
  this.merger = this.context.createChannelMerger(2);
  this.gainL = this.context.createGainNode();
  this.gainR = this.context.createGainNode();
  this.beepAgain = true;

  this.wait_seconds = wait_seconds;
  this.play_seconds = play_seconds;
  this.leftgain = 1;

  this.frequency = frequency;

  this.gainL.connect(this.merger, 0, 0);
  this.gainR.connect(this.merger, 0, 1);

  this.merger.connect(this.destination);
  this.last_timeout_id = null;

  this.osc = null;

  /**
   * Conectamos la señal del osciloscopio
   */
  this.start_oscilloscope = function () {
    if (this.osc == null) {
      this.osc = this.context.createOscillator();

	  this.osc.frequency.value = this.frequency;

	  this.osc.connect(this.gainL);
	  this.osc.connect(this.gainR);
      this.leftgain = 1;
    }
  };

  /**
   * Paramos el osciloscopio y lo desconectamos
   */
  this.stop_oscilloscope = function () {
    if (this.osc != null) {
	  this.osc.noteOff(0);
	  this.osc.disconnect();
      this.osc = null;
    }
  };

  this.play = function () {
    if (this.osc == null) {
      console.log("not playing on null");
      return this;
    }
	console.log("playing! " + times);
	this.osc.noteOn(0);

	this.gainL.gain.value = this.leftgain;
	this.gainR.gain.value = 1-this.leftgain;
    var self = this;
    var self_stop = function () {
        console.log("about to stop");
        self.stop();
    };
	this.last_timeout_id = window.setTimeout(self_stop, 1000 * this.play_seconds);
    return this;
  };


  this.stop = function () {
    if (this.osc == null) {
      console.log("not playing on null");
      return this;
    }
	console.log("stopping! " + this.beepAgain);
    this.gainL.gain.value = 0;
	this.gainR.gain.value = 0;

	this.leftgain = 1 - this.leftgain;
	console.log("running play in " + this.wait_seconds + " seconds with leftgain:" + this.leftgain);
    var self = this;
    var self_play = function () {
      console.log("about to play");
      self.play();
    };
    this.last_timeout_id = window.setTimeout(self_play, 1000 * this.wait_seconds);
    return this;
  };

  this.start_playing = function () {
    this.start_oscilloscope();
	this.play();
    return this;
  };

  this.stop_playing = function () {
    this.stop_oscilloscope();
    window.clearTimeout(self.last_timeout_id);
    return this;
  };

  this.change_frequency = function (new_freq) {
    this.frequency = new_freq;
    this.osc.frequency.value = new_freq;
  };

};



function start () {
    beeper.start_playing();
}

function stop () {
    beeper.stop_playing();
}

function change_frequency() {
  var new_freq = document.getElementById('freq_value').value;
  console.log("changing frequency to " + new_freq);
  beeper.change_frequency(new_freq);
}

function change_pause() {
  console.log("changing pause to " + document.getElementById('pause_value').value);
  beeper.wait_seconds = document.getElementById('pause_value').value;
}

function create_beeper() {
  window.beeper = new Beeper(1, document.getElementById('pause_value').value, document.getElementById('freq_value').value);
}

// what should you do next?
var next_play = true;

function switch_play() {
  var btn = document.getElementById('play');
  if (next_play) {
    start();
    //btn.innerHTML = "&#9642;";
    btn.innerHTML = "&#9724;";
  }
  else {
    stop();
    btn.innerHTML = "&#9654;";
  }
  next_play = !next_play;
}

window.onload=create_beeper;
