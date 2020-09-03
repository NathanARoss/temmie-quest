const outputNode = document.getElementById("console-output");
const inputNode = document.getElementById("console-input");
const submitNode = document.getElementById("console-submit");
const form = document.getElementById("console-form");

let msgResolver;
let msgFormatter;

function buttonResolver() {
    inputNode.removeAttribute("hidden");
    submitNode.removeAttribute("hidden");

    for (const button of document.querySelectorAll("#console-form > input[type='button']")) {
        button.parentElement.removeChild(button);
    }

    msgResolver(this.value);
    msgResolver = null;
}

function readCheckboxes() {
    const selected = [];

    for (const option of document.querySelectorAll("#console-form > label > input[type='checkbox']:checked")) {
        selected.push(option.value);
    }

    for (const label of document.querySelectorAll("#console-form > label")) {
        label.parentElement.removeChild(label);
    }

    return selected;
}

function readString(placeholder="", required=false) {
    inputNode.removeAttribute("disabled");
    inputNode.setAttribute("type", "text");
    inputNode.setAttribute("placeholder", placeholder);
    inputNode.focus();

    if (required) {
        inputNode.setAttribute("required", "true");
    }

    return new Promise( (resolve, reject) => {
        msgResolver = resolve;
    });
}

function readNumber(placeholder="", min=-Infinity, max=Infinity, step="any") {
    inputNode.removeAttribute("disabled");
    inputNode.setAttribute("type", "number");
    inputNode.setAttribute("placeholder", placeholder);
    inputNode.setAttribute("min", min);
    inputNode.setAttribute("max", max);
    inputNode.setAttribute("step", step);
    inputNode.setAttribute("pattern", String.raw`\d*`);
    inputNode.setAttribute("required", "true"); // don't allow an empty string to avoid NaN
    inputNode.focus();

    msgFormatter = parseFloat;

    return new Promise( (resolve, reject) => {
        msgResolver = resolve;
    });
}

function readNumberWithSlider(min, max, step="any") {
    inputNode.removeAttribute("disabled");
    inputNode.setAttribute("type", "range");
    inputNode.setAttribute("min", min);
    inputNode.setAttribute("max", max);
    inputNode.setAttribute("step", step);
    inputNode.focus();

    msgFormatter = parseFloat;

    return new Promise( (resolve, reject) => {
        msgResolver = resolve;
    });
}

function readCheckboxSelections(options) {
    inputNode.setAttribute("hidden", "true");

    for (const option of options) {
        const checkbox = document.createElement("input");
        checkbox.setAttribute("type", "checkbox");
        checkbox.setAttribute("value", option);

        const label = document.createElement("label");
        label.innerText = option;
        label.insertBefore(checkbox, label.firstChild);

        form.insertBefore(label, submitNode);
    }

    msgFormatter = readCheckboxes;

    return new Promise( (resolve, reject) => {
        msgResolver = resolve;
    });
}

function readButtonSelection(options) {
    inputNode.setAttribute("hidden", "true");
    submitNode.setAttribute("hidden", "true");

    for (const option of options) {
        const button = document.createElement("input");
        button.setAttribute("type", "button");
        button.setAttribute("value", option);
        button.innerText = option;
        button.addEventListener("click", buttonResolver);

        form.insertBefore(button, submitNode);
    }

    return new Promise( (resolve, reject) => {
        msgResolver = resolve;
    });
}

function readColor(defaultColor) {
    inputNode.removeAttribute("disabled");
    inputNode.setAttribute("type", "color");
    inputNode.setAttribute("value", defaultColor);
    inputNode.focus();

    return new Promise( (resolve, reject) => {
        msgResolver = resolve;
    });
}

function sleep(miliseconds) {
    return new Promise(resolve => {
        setTimeout(resolve, miliseconds);
    });
}

function print(text) {
    if (outputNode.childNodes.length == 0 || outputNode.lastChild.nodeValue.length > 512) {
        const textNode = document.createTextNode(text);
        outputNode.appendChild(textNode);
    } else {
        outputNode.lastChild.nodeValue += text;
    }

    window.scrollTo(0,document.body.scrollHeight);
}

function println(text) {
    print(text + '\n');
}

function clear() {
    outputNode.innerHTML = "";
}

form.onsubmit = function() {
    event.preventDefault();

    let value = inputNode.value;

    inputNode.setAttribute("type", "number");
    inputNode.setAttribute("disabled", "true");
    inputNode.removeAttribute("type");
    inputNode.removeAttribute("placeholder");
    inputNode.removeAttribute("required");
    inputNode.removeAttribute("hidden");
    inputNode.removeAttribute("pattern");

    if (msgResolver) {
        inputNode.value = "";
        
        if (msgFormatter) {
            value = msgFormatter(value);
            msgFormatter = null;
        }

        msgResolver(value);
        msgResolver = null;
    }
}