'use strict';

const input = document.querySelector('input');
const startPauseBtn = document.querySelector('#start-pause');
const resetBtn = document.querySelector('#reset');
const circle = document.querySelector('circle');
const CIRCUMFERENCE = circle.getAttribute('stroke-dasharray');

const RF = 0.01; // Roughness Factor. Smaller values will make the circle animation appear smoother. Also necessary to keep timer decrement on a real-time-pace and synchronized with the animation.
let initialTime = null;
let dashOffset = null;
let interval = null;
let isPaused = true;
let hasInputEventOcurred = false;

function start() {
	interval = setInterval(() => {
		tick();
	}, 1000 * RF);
	isPaused = false;
	initialTime = input.value;
	hasInputEventOcurred = false;
}

function pause() {
	clearInterval(interval);
	isPaused = true;
}

function reset() {
	clearInterval(interval);
	circle.setAttribute('stroke-dashoffset', 0);
	isPaused = true;
	initialTime = null;
	dashOffset = null;
	if (!hasInputEventOcurred) input.value = 5;
	hasInputEventOcurred = false;
}

function tick() {
	if (input.value > 0) {
		input.value = (input.value - RF).toFixed(2); // Remember that ROUGHNESS is in seconds!
		trimCircumference();
	} else {
		clearInterval(interval);
	}
}

function onInput() {
	pause();
	hasInputEventOcurred = true;
	reset();
}

function pressEnter(evt) {
	if (evt.key === 'Enter') {
		startPauseBtn.click();
	}
}

function trimCircumference() {
	dashOffset -= CIRCUMFERENCE / (initialTime / RF);
	circle.setAttribute('stroke-dashoffset', dashOffset);
}

input.addEventListener('input', onInput);
input.addEventListener('keyup', pressEnter);
startPauseBtn.addEventListener('click', () => (isPaused ? start() : pause()));
resetBtn.addEventListener('click', reset);
