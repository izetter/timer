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
let isReset = true;
let hasInputEventOcurred = false;

function initialize() {
	initialTime = input.value;
	isReset = false;
	start();
}

function start() {
	interval = setInterval(() => {
		tick();
	}, 1000 * RF);
	isPaused = false;
}

function tick() {
	if (input.value > 0) {
		input.value = (input.value - RF).toFixed(2); // Remember that ROUGHNESS is in seconds!
		trimCircumference();
	} else {
		clearInterval(interval); // change this to onComplete()
	}
}

function trimCircumference() {
	dashOffset = dashOffset - CIRCUMFERENCE / (initialTime / RF);
	circle.setAttribute('stroke-dashoffset', dashOffset);
}

function pause() {
	clearInterval(interval);
	isPaused = true;
}

function reset() {
	pause();
	isReset = true;
	dashOffset = null;
	circle.setAttribute('stroke-dashoffset', 0);
	if (hasInputEventOcurred) {
		initialTime = input.value;
		hasInputEventOcurred = false;
	} else {
		input.value = initialTime;
	}
}

function onInput() {
	hasInputEventOcurred = true;
	reset();
}

function pressEnter(evt) {
	if (evt.key === 'Enter') {
		startPauseBtn.click();
	}
}

input.addEventListener('input', onInput);
input.addEventListener('keyup', pressEnter);
resetBtn.addEventListener('click', reset);
startPauseBtn.addEventListener('click', () => {
	if (isReset) {
		initialize();
	} else if (isPaused) {
		start();
	} else {
		pause();
	}
});
