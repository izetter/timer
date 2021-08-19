'use strict';

const input = document.querySelector('input');
const startPauseBtn = document.querySelector('.start-pause-btn');
const resetBtn = document.querySelector('.reset-btn');
const circle = document.querySelector('circle');
const CIRCUMFERENCE = circle.getAttribute('stroke-dasharray');

const RF = 0.01; // Roughness Factor. Smaller values will make the circle animation appear smoother. Also necessary to keep timer decrement on a real-time-pace and synchronized with the animation.
let initialTime = input.value;
let dashOffset = null;
let interval = null;
let isPaused = true;
let isReset = true;
let isTimerInitialized = true;
let hasInputEventOcurred = false;

function initialize() {
	initialTime = input.value;
	isReset = false;
	// isTimerInitialized = true;
	start();
}

function start() {
	interval = setInterval(() => {
		tick();
	}, 1000 * RF);
	isPaused = false;
	togglePlayPauseBtn();
}

function tick() {
	if (input.value > 0) {
		input.value = (input.value - RF).toFixed(2); // Remember that ROUGHNESS is in seconds!
		animateCircumference();
	} else {
		onTimerFinish();
	}
}

function animateCircumference() {
	dashOffset = dashOffset - CIRCUMFERENCE / (initialTime / RF);
	circle.setAttribute('stroke-dashoffset', dashOffset);
}

function pause() {
	isPaused = true;
	clearInterval(interval);
	togglePlayPauseBtn();
}

function reset(isDoubleClick) {
	isReset = true;
	dashOffset = null;
	pause();
	circle.setAttribute('stroke-dashoffset', 0);
	if (hasInputEventOcurred) {
		initialTime = input.value;
		hasInputEventOcurred = false;
	} else if (isDoubleClick) {
		initialTime = (input.value - input.value).toFixed(2);
		input.value = initialTime;
	} else {
		input.value = initialTime;
	}
	isTimerInitialized = true;
}

function onTimerFinish() {
	clearInterval(interval);
	if (isTimerInitialized) {
		let flickerCount = 0;
		const flicker = setInterval(() => {
			input.classList.toggle('transparent');
			flickerCount++;
			if (flickerCount === 8) clearInterval(flicker);
		}, 500);
		isTimerInitialized = false;
	}
	// isTimerInitialized = false;
}

function onInput() {
	hasInputEventOcurred = true;
	reset();
}

function pressedEnter(evt) {
	if (evt.key === 'Enter') {
		startPauseBtn.click();
	}
}

function togglePlayPauseBtn() {
	if (isReset) {
		startPauseBtn.children[0].classList.add('fa-play');
		startPauseBtn.children[0].classList.remove('fa-pause');
	} else {
		startPauseBtn.children[0].classList.toggle('fa-play');
		startPauseBtn.children[0].classList.toggle('fa-pause');
	}
}

input.addEventListener('input', onInput);
input.addEventListener('keyup', pressedEnter);
resetBtn.addEventListener('click', () => reset(false));
resetBtn.addEventListener('dblclick', () => reset(true));
startPauseBtn.addEventListener('click', () => {
	if (isReset) {
		initialize();
	} else if (isPaused) {
		start();
	} else {
		pause();
	}
});
