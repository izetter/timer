'use strict';

const input = document.querySelector('input');
const startPauseBtn = document.querySelector('#start-pause');
const resetBtn = document.querySelector('#reset');
const timeRemaining = null;
let interval = null;
let isPaused = true;

function start() {
	interval = setInterval(() => {
		tick();
	}, 10);	// run every 0.01 seconds instead of every second to facilitate smooth animation.
	isPaused = false;
}

function pause() {
	clearInterval(interval);
	isPaused = true;
}

function reset() {
	clearInterval(interval);
	input.value = 10;
}

function tick() {
	if (input.value > 0) {
		console.log('tick');
		// For the timer to run on normal pace while keeping a smooth animation, decrement the input value by 0.01 to match the tick function being run every 0.01 seconds.
		input.value = (input.value - 0.01).toFixed(2);
	} else {
		clearInterval(interval);
	}
}

function pressEnter(evt) {
	if (evt.key === 'Enter') {
		startPauseBtn.click();
		startPauseBtn.style.active = true;
	}
}

input.addEventListener('input', pause);
input.addEventListener('keyup', pressEnter);
startPauseBtn.addEventListener('click', () => (isPaused ? start() : pause()));
resetBtn.addEventListener('click', reset);

input.value = 10;
