import { savedata, pasteSavedData, dataContainer } from './module/saveData.js'
import { hint, hint_value } from './module/hint.js'

// manage game title

let gameName = "guess The Word"
document.querySelector('h1').innerText = gameName
document.querySelector('footer').innerHTML = `${gameName} Created By Me`

// Mange Words

let words = ["YouseF", "Khaled", "mohammed", "Metwaly", "Ehab", "Saleh", "Foda", "Mariam", "Mayar", "Noor", "blue"];

// save the wordGUessed to prevent it to change when reload

export let wordToGuess;
let savedWord = sessionStorage.getItem('saveWord');

// change the word on click

let changeBtn = document.querySelector('.change-btn')
let restartBtn = document.querySelector('.restart-btn')
changeBtn.addEventListener('click', changeWord)
restartBtn.addEventListener('click', () => {
    sessionStorage.removeItem('Data_Container');
    sessionStorage.removeItem('savedMessage');
    sessionStorage.removeItem('savedHints');
    location.reload()
})

function changeWord() {
    wordToGuess = words.length >= 0 ? words[Math.floor(Math.random() * words.length)].toLowerCase() : "";
    sessionStorage.setItem('saveWord', wordToGuess);
    sessionStorage.removeItem('Data_Container');
    sessionStorage.removeItem('savedMessage');
    sessionStorage.removeItem('savedHints');  // ← is this there?
    location.reload()
}
if (savedWord) {
    wordToGuess = savedWord
} else {
    changeWord()
}


// setting Game Options 

export let numberOfAttempts = 6;
export let numberOfLetters = wordToGuess.split("").length;
export let numberOfHints;
let wordContent = wordToGuess.includes('yousef') ? wordToGuess + ' The Game Creator 👑' : wordToGuess;
let currentTry = dataContainer.length + 1;

// determining numberOfHints based on word length

if (wordToGuess.length > 6) numberOfHints = 3
else if (wordToGuess.length > 4) numberOfHints = 2
else numberOfHints = 1
hint_value.innerHTML = numberOfHints



function inputsGenerator() {
    const inputsContainer = document.querySelector(".inputs")

    // create number of tries available

    for (let i = 1; i <= numberOfAttempts; i++) {
        let inputsHolder = document.createElement('div');
        inputsHolder.classList.add(`try-${i}`);
        inputsHolder.innerHTML = `<span>Try ${i}</span>`;

        if (i != 1) inputsHolder.classList.add('disabled-inputs');

        for (let j = 1; j <= numberOfLetters; j++) {
            let input = document.createElement('input');
            input.type = "text";
            input.autocomplete = "off";
            input.maxLength = "1";
            input.id = `guess-${i}-letter-${j}`;
            inputsHolder.appendChild(input);

        }

        inputsContainer.appendChild(inputsHolder);
    }

    // focus on first try when the window loaded

    inputsContainer.children[0].children[1].focus();

    // disable all inputs except in the first try

    let disabledInputs = document.querySelectorAll(".disabled-inputs input");
    disabledInputs.forEach(input => input.disabled = true);

    // control the flow of data and what can user do

    let inputs = document.querySelectorAll(".inputs input");
    inputs.forEach((input, index) => {

        // turn letters toUpperCase then move to next input

        input.addEventListener("input", (event) => {
            event.target.value = event.target.value.toUpperCase();
            let nextIndex = inputs[index + 1];
            if (nextIndex) nextIndex.focus();
        });

        input.addEventListener("keydown", (event) => {

            // move to right when clicking in ArrowRight
            if (event.key === "ArrowRight") {
                let nextIndex = index + 1
                if (nextIndex < inputs.length) inputs[nextIndex].focus()
            }

            if (event.key === "ArrowLeft") {
                let previousIndex = index - 1
                if (previousIndex >= 0) inputs[previousIndex].focus()
            }
        });

    })
    pasteSavedData()
}

export const guessBtn = document.querySelector('.check')
export const message = document.querySelector('.message')

guessBtn.addEventListener('click', handleGuess)
document.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        handleGuess()
    }
})

function handleGuess() {
    let success = true

    for (let i = 1; i <= numberOfLetters; i++) {
        const inputField = document.querySelector(`#guess-${currentTry}-letter-${i}`)
        if (!inputField || inputField.value === "" || inputField.value === " ") {
            message.innerHTML = "Please fill all letters first!"
            return
        }
    }

    for (let i = 1; i <= numberOfLetters; i++) {
        const inputField = document.querySelector(`#guess-${currentTry}-letter-${i}`)
        const letter = inputField.value.toLowerCase()
        const actualLetter = wordToGuess[i - 1]

        if (letter === actualLetter && letter !== "") {
            inputField.classList.add('yes-in-place')
        }
        else if (wordToGuess.includes(letter) && letter !== "") {
            success = false
            inputField.classList.add('not-in-place')
        } else if (!(wordToGuess.includes(letter))) {
            success = false
            inputField.classList.add('not')
        }
    }
    if (!success) {
        let divContainer = document.querySelectorAll(`.inputs > div`)
        document.querySelector(`.try-${currentTry}`).classList.add('disabled-inputs')
        let Previous = document.querySelectorAll(`.try-${currentTry} input`)
        Previous.forEach(input => input.disabled = true)

        currentTry++
        let current = document.querySelectorAll(`.try-${currentTry} input`)
        current.forEach(input => input.disabled = false)

        let el = document.querySelector(`.try-${currentTry}`)
        if (el) {
            document.querySelector(`.try-${currentTry}`).classList.remove('disabled-inputs')
            el.children[1].focus()

        }
        else {
            guessBtn.disabled = true
            hint.disabled = true
            message.innerHTML = `You Lost 😣 and the word is <span>${wordContent}</span>`
            sessionStorage.setItem('savedMessage', message.innerHTML)

        }


    } else {
        guessBtn.disabled = true
        hint.disabled = true
        message.innerHTML = `You win 😉 and the word is <span>${wordContent}</span>`
        sessionStorage.setItem('savedMessage', message.innerHTML)
    }

    if (message.textContent.includes("win")) {
        message.style.color = "#0aab90"
    }
    else message.style.color = "#c44"
    savedata()
}


// determining numberOfHints based on word length

// export let numberOfHints = 0
// if(wordToGuess.length > 5) numberOfHints = 3 
// else if(wordToGuess.length > 3) numberOfHints = 2
// else numberOfHints = 1 


window.onload = () => {
    inputsGenerator()
}