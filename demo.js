const radios = document.getElementsByName("data-type-radio");
const resumeButton = document.getElementById("resume-button");
const playButton = document.getElementById("play-button");
const stepBackButton = document.getElementById("step-back");
const stepForwardButton = document.getElementById("step-forward");
const canvasDimensionsButton = document.getElementById("canvas-dims-btn");
const canvas = document.getElementById("canvas");
canvas.width = document.documentElement.clientWidth - canvas.offsetLeft;
canvas.height = document.documentElement.clientHeight - canvas.offsetTop;
const canvasWidthInput = document.getElementById("canvas-width");
let canvasHeightInput = document.getElementById("canvas-height");
canvasWidthInput.value = canvas.width;
canvasHeightInput.value = canvas.height;
const ctx = canvas.getContext("2d");
const animationControl = document.getElementById("animation-speed");
let animationSpeed;
let playing = false;
let demo = null;
let intervalID;

const warning = document.getElementById("warning");

function showWarning() {
    if (demo.warning) {
        warning.style.display = 'inline';
        warning.textContent = demo.warning;
    }
    else {
        warning.style.display = 'none';
    }
}

function updateInputsDisabledState() {
    for (let radio of radios) {
        if (!radio.checked) {
            radio.nextElementSibling.nextElementSibling.disabled = true;
        }
    }
}

updateInputsDisabledState();
for (let radio of radios) {
    radio.addEventListener("change", () => {
        let textInput = radio.nextElementSibling.nextElementSibling;
        textInput.disabled = false;
        updateInputsDisabledState();
    });
}

function getInputArray() {
    let input = document.querySelector("[name=data-type]:enabled");
    if (input.id === "int-input") {
        return input.value.split(" ").map(e => Number.parseInt(e)).filter(e => !Number.isNaN(e));
    } else {
        return input.value;
    }
}

function setSpeed(speed) {
    let step = Number.parseInt(animationControl.step);
    let max = Number.parseInt(animationControl.max);
    animationSpeed = max - speed + step;
}

setSpeed(animationControl.value);
animationControl.addEventListener('change', () => {
    setSpeed(animationControl.value);
    clearInterval(intervalID);
    runDemo();
});

function updatePlayState(state) {
    playing = state;
    resumeButton.textContent = playing ? "Pause" : "Resume";
}

resumeButton.addEventListener("click", () => {
    updatePlayState(!playing);
    runDemo();
});

playButton.addEventListener("click", () => {
    updatePlayState(true);
    demo = null;
    clearInterval(intervalID);
    runDemo();
});

stepBackButton.addEventListener("click", () => {
    runDemo(singleStepDirection = 'back');
});

stepForwardButton.addEventListener("click", () => {
    runDemo(singleStepDirection = 'forward');
});

canvasDimensionsButton.addEventListener("click", () => {
    let width = canvasWidthInput.value;
    let height = canvasHeightInput.value;
    canvas.width = width;
    canvas.height = height;
});

function runDemo(singleStepDirection) {
    if (!demo) {
        const array = getInputArray();
        demo = new CountingSortDemo(array, ctx);
    }
    if (playing) {
        demo.resume();
    } else {
        demo.pause();
    }

    if (singleStepDirection) {
        let pausedState = demo.paused;
        demo.resume();
        if (singleStepDirection === 'forward') {
            demo.next();
        } else {
            demo.undo();
        }
        demo.paused = pausedState;
        showWarning();
    } else {
        intervalID = setInterval(() => {
            demo.next();
            showWarning();
            if (demo.finished()) {
                updatePlayState(false);
                clearInterval(intervalID);
            } else if (demo.paused) {
                clearInterval(intervalID);
            }

        }, animationSpeed);
    }
}
