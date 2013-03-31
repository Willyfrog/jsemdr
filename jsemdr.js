var times = 0;

var Beeper = function () {
    this.context = new webkitAudioContext();
    this.destination = this.context.destination;
    this.merger = this.context.createChannelMerger(2);
    this.gainL = this.context.createGainNode();
    this.gainR = this.context.createGainNode();
    this.beepAgain = true;

    this.frequency = 500;

    this.gainL.connect(this.merger, 0, 0);
    this.gainR.connect(this.merger, 0, 1);

    this.merger.connect(this.destination);

    this.leftgain = 1;

    this.play = function (seconds, wait_seconds) {
	console.log("playing! " + times);
	var osc = this.context.createOscillator();

	osc.frequency.value = this.frequency;
  
	osc.connect(this.gainL);
	osc.connect(this.gainR);
	
	osc.noteOn(0);

	this.gainL.gain.value = this.leftgain;
	this.gainR.gain.value = 1-this.leftgain;
	window.setTimeout(this.stop, 1000 * seconds, osc, wait_seconds);
    };


    this.stop = function (osc, wait_seconds) {
	console.log("stopping! " + this.beepAgain);
	osc.noteOff(0);
	osc.disconnect();
	if (!this.beepAgain) {
	    console.log("+");
	    this.leftgain = 1 - this.leftgain;
	    window.setTimeout(this.play, 1000*wait_seconds, 2, 2);
	}
    };

    this.start_playing = function () {
	this.beepAgain = true;
	this.play(2, 2);
    };

    this.stop_playing = function () {
	this.beepAgain = false;
    };

};

var beeper = new Beeper();

function start () {
    beeper.start_playing();
}

function stop () {
    beeper.stop_playing();
}

//window.onload=start;


