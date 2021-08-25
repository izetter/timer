class Timer {
	constructor(input, controlBtn, resetBtn, SVGcircle, alarmAudio) {
		this.input = input;
		this.controlBtn = controlBtn;
		this.resetBtn = resetBtn;
		this.circle = SVGcircle;
		this.alarm = alarmAudio;

		this.initialTime = this.input.value;
		this.controlBtnIcon = controlBtn.children[0]; 	// destructuring would be [this.controlBtnIcon] = controlBtn.children;
		this.CIRCUMFERENCE = this.circle.getAttribute('stroke-dasharray');

		this.RF = 0.01;
		this.flickerInterval = null;
		this.tickInterval = null;
		this.dashOffset = null;
		this.isPaused = true;
		this.isReset = true;
		this.isTimerInitialized = true;
		this.hasInputEventOcurred = false;

		this.input.addEventListener('input', () => this.onInput());
		this.input.addEventListener('keyup', (evt) => this.pressedEnter(evt)); 	// could instead be ` this.pressedEnter.bind(this) `
		this.controlBtn.addEventListener('click', () => this.controlBtnHandler());
		this.resetBtn.addEventListener('click', () => this.reset(false));
		this.resetBtn.addEventListener('dblclick', () => this.reset(true));
	}

	initialize() {
		this.initialTime = this.input.value;
		this.isReset = false;
		this.start();
	}

	start() {
		this.tickInterval = setInterval(() => {
			this.tick();
		}, 1000 * this.RF);
		this.isPaused = false;
		this.toggleControlBtnIcon();
	}

	tick() {
		if (this.input.value > 0) {
			this.input.value = (this.input.value - this.RF).toFixed(2); // Remember that RF is in seconds!
			this.animateCircumference();
		} else {
			this.onTimerFinish();
		}
	}

	animateCircumference() {
		this.dashOffset = this.dashOffset - this.CIRCUMFERENCE / (this.initialTime / this.RF);
		this.circle.setAttribute('stroke-dashoffset', this.dashOffset);
	}

	pause() {
		this.isPaused = true;
		clearInterval(this.tickInterval);
		this.toggleControlBtnIcon();
	}

	onTimerFinish() {
		clearInterval(this.tickInterval);
		if (this.isTimerInitialized) {
			this.startFlicker();
		}
	}

	startFlicker() {
		this.alarm.play();
		this.isTimerInitialized = false;
		this.controlBtnIcon.classList.add('fa-stop');
		let flickerCount = 0;
		this.flickerInterval = setInterval(() => {
			this.input.classList.toggle('transparent');
			flickerCount += 1;
			if (flickerCount === 8) {
				this.stopFlicker();
				this.controlBtn.classList.add('fa-disabled');
			}
		}, 500);
	}

	stopFlicker() {
		clearInterval(this.flickerInterval);
		this.input.classList.remove('transparent');
	}

	reset(isDoubleClick) {
		this.isReset = true;
		this.dashOffset = null;
		this.isTimerInitialized = true;
		this.pause();
		this.stopAlarm();
		clearInterval(this.flickerInterval);
		this.circle.setAttribute('stroke-dashoffset', 0);
		if (this.hasInputEventOcurred) {
			this.initialTime = this.input.value;
			this.hasInputEventOcurred = false;
		} else if (isDoubleClick) {
			this.initialTime = (this.input.value - this.input.value).toFixed(2);
			this.input.value = this.initialTime;
		} else {
			this.input.value = this.initialTime;
		}
	}

	onInput() {
		this.hasInputEventOcurred = true;
		this.reset();
	}

	pressedEnter(evt) {
		if (evt.key === 'Enter') {
			this.controlBtn.click();
		}
	}

	toggleControlBtnIcon() {
		if (this.isReset) {
			this.controlBtnIcon.classList.remove('fa-stop');
			this.controlBtnIcon.classList.remove('fa-pause');
			this.controlBtnIcon.classList.add('fa-play');
		} else {
			this.controlBtnIcon.classList.toggle('fa-play');
			this.controlBtnIcon.classList.toggle('fa-pause');
		}
		this.controlBtn.classList.remove('fa-disabled');
	}

	controlBtnHandler() {
		if (!this.isTimerInitialized) {
			this.stopAlarm();
			this.controlBtn.classList.add('fa-disabled');
		} else if (this.isReset) {
			this.initialize();
		} else if (this.isPaused) {
			this.start();
		} else {
			this.pause();
		}
	}

	stopAlarm() {
		this.stopFlicker();
		this.alarm.pause();
		this.alarm.currentTime = 0;
	}
}

const input = document.querySelector('input');
const controlBtn = document.querySelector('.control-btn');
const resetBtn = document.querySelector('.reset-btn');
const circle = document.querySelector('circle');
const alarm = new Audio('./alarm_beep.mp3');

const timer = new Timer(input, controlBtn, resetBtn, circle, alarm);
