'use strict';

const input = document.querySelector('input');
const controlBtn = document.querySelector('.control-btn');
const controlBtnIcon = controlBtn.children[0]; // destructuring would be ` const [controlBtnIcon] = controlBtn.children; `
const resetBtn = document.querySelector('.reset-btn');
const circle = document.querySelector('circle');
const CIRCUMFERENCE = circle.getAttribute('stroke-dasharray');
const alarm = new Audio('./alarm_beep.mp3');
const RF = 0.01; // Roughness Factor, in seconds. Smaller values will make the circle animation appear smoother. Also necessary to keep timer decrement on a real-time-pace and synchronized with the animation.
let initialTime = input.value;
let flickerInterval = null;
let tickInterval = null;
let dashOffset = null;
let isPaused = true;
let isReset = true;
let isTimerInitialized = true;
let hasInputEventOcurred = false;

function initialize() {
	initialTime = input.value;
	isReset = false;
	start();
}

function start() {
	tickInterval = setInterval(() => {
		tick();
	}, 1000 * RF);
	isPaused = false;
	toggleControlBtnIcon();
}

function tick() {
	if (input.value > 0) {
		input.value = (input.value - RF).toFixed(2); // Remember that RF is in seconds!
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
	clearInterval(tickInterval);
	toggleControlBtnIcon();
}

function onTimerFinish() {
	clearInterval(tickInterval);
	if (isTimerInitialized) {
		startFlicker();
	}
}

function startFlicker() {
	alarm.play();
	isTimerInitialized = false;
	controlBtnIcon.classList.add('fa-stop');
	let flickerCount = 0;
	flickerInterval = setInterval(() => {
		input.classList.toggle('transparent');
		flickerCount += 1;
		if (flickerCount === 8) {
			stopFlicker();
			controlBtn.classList.add('fa-disabled');
		}
	}, 500);
}

function stopFlicker() {
	clearInterval(flickerInterval);
	input.classList.remove('transparent');
}

function reset(isDoubleClick) {
	isReset = true;
	dashOffset = null;
	isTimerInitialized = true;
	pause();
	stopAlarm();
	clearInterval(flickerInterval);
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
}

function onInput() {
	hasInputEventOcurred = true;
	reset();
}

function pressedEnter(evt) {
	if (evt.key === 'Enter') {
		controlBtn.click();
	}
}

function toggleControlBtnIcon() {
	if (isReset) {
		controlBtnIcon.classList.remove('fa-stop');
		controlBtnIcon.classList.remove('fa-pause');
		controlBtnIcon.classList.add('fa-play');
	} else {
		controlBtnIcon.classList.toggle('fa-play');
		controlBtnIcon.classList.toggle('fa-pause');
	}
	controlBtn.classList.remove('fa-disabled');
}

function controlBtnHandler() {
	if (!isTimerInitialized) {
		stopAlarm();
		controlBtn.classList.add('fa-disabled');
	} else if (isReset) {
		initialize();
	} else if (isPaused) {
		start();
	} else {
		pause();
	}
}

function stopAlarm() {
	stopFlicker();
	alarm.pause();
	alarm.currentTime = 0;
}

input.addEventListener('input', onInput);
input.addEventListener('keyup', pressedEnter);
controlBtn.addEventListener('click', controlBtnHandler);
resetBtn.addEventListener('click', () => reset(false));
resetBtn.addEventListener('dblclick', () => reset(true));
