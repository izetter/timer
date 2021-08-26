import Timer from './timer-class.js';

const input = document.querySelector('input');
const controlBtn = document.querySelector('.control-btn');
const resetBtn = document.querySelector('.reset-btn');
const circle = document.querySelector('circle');
const alarm = new Audio('./alarm_beep.mp3');

const timer = new Timer(input, controlBtn, resetBtn, circle, alarm);

/* 

Remember that because of CORS' same-origin-policy, ES6 modules only work through HTTP/HTTPS,
so to test this app locally using modules, it must be run through a server, e.g. Live Server VS Code extension.
Otherwise simply put all code in the same file and don't use modules.

The following error indicates the aforementioned situation:
"Access to Script at '<path/to/script.js>' from origin 'null' has been blocked by CORS policy: 
Invalid response. Origin 'null' is therefore not allowed access."

*/
