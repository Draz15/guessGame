import { numberOfAttempts, numberOfLetters, numberOfHints, wordToGuess, guessBtn } from '../main.js'
import { hint, hint_value } from './hint.js'

// mange save data imputed by user
export let dataContainer = JSON.parse(sessionStorage.getItem('Data_Container')) || []

export function savedata() {
    const inputsContainer = document.querySelectorAll(".inputs > .disabled-inputs")
    const newInputsContainer = Array.from(inputsContainer)

    // ensure that inputs contains data and count the inputs and input containers
    const notEmptyRow = newInputsContainer.filter(el => Array.from(el.children).slice(1).some(input => input.value !== ""))
    const inputsNotEmpty = newInputsContainer.map(el => Array.from(el.children).splice(1).filter(input => input.value != ""))

    if (inputsNotEmpty.length > 0) {
        for (let i = 0; i < notEmptyRow.length; i++) {
            let savedRow = {}
            for (let j = 0; j < numberOfLetters; j++) {
                // assign every word to object
                savedRow[`${j}`] = inputsNotEmpty[i][j].value
            }
            // ensuring the object isn't duplicated

            if (dataContainer.every(el => JSON.stringify(el) !== JSON.stringify(savedRow))) dataContainer.push(savedRow)
        }
        // saving data even if you reloaded

        sessionStorage.setItem('Data_Container', JSON.stringify(dataContainer))
    }
}

const arrLetsToCheck = JSON.parse(sessionStorage.getItem('arrLetsToCheck')) ?? [];

export function pasteSavedData() {
    const inputsContainer = document.querySelectorAll(".inputs > div")
    const newInputsContainer = Array.from(inputsContainer)
    const EmptyRow = newInputsContainer.map(el => Array.from(el.children).slice(1).filter(input => input.value == ""))
    // ensure that inputs contains data and count the inputs and input containers

    if (dataContainer.length > 0) {
        for (let i = 0; i < dataContainer.length; i++) {
            let inputs = EmptyRow[i]
            let numOfLetsToCheck = {}
            for (let j = 0; j < numberOfLetters; j++) {
                // assign every savedData to word
                inputs[j].value = dataContainer[i][j]
                const letter = dataContainer[i][j]
                if (!(letter in numOfLetsToCheck)) {
                    numOfLetsToCheck[letter] = arrLetsToCheck[i]?.[letter]?.length
                }

                // give every word here background based on data assigned

                if (dataContainer[i][j].toLowerCase() === wordToGuess[j].toLowerCase()) {
                    inputs[j].classList.add('yes-in-place');
                    if (numOfLetsToCheck[letter] < 1) {
                        numOfLetsToCheck[letter] = 0
                    } else {
                        --numOfLetsToCheck[letter]
                    }
                }

                else if (wordToGuess.includes(dataContainer[i][j].toLowerCase()) && numOfLetsToCheck[letter] > 0) {
                    inputs[j].classList.add('not-in-place');
                    --numOfLetsToCheck[letter]
                }

                else if (!(wordToGuess.includes(dataContainer[i][j]))) inputs[j].classList.add('not')
            }
            if (newInputsContainer[dataContainer.length]) {
                newInputsContainer[i].classList.add('disabled-inputs')
                let Previous = newInputsContainer[i].querySelectorAll('input')
                Previous.forEach(input => input.disabled = true)

                newInputsContainer[dataContainer.length].classList.remove('disabled-inputs')
                let current = newInputsContainer[i + 1].querySelectorAll('input')
                current.forEach(input => input.disabled = false)
                newInputsContainer[dataContainer.length].children[1].focus()
            }
        }
    }


    if (dataContainer.length >= numberOfAttempts) {
        const divContainer = document.querySelectorAll('.inputs > div')
        divContainer.forEach(el => {
            el.classList.add('disabled-inputs')
            Array.from(el.children).slice(1).forEach(input => input.disabled = true)
        })
        guessBtn.disabled = true
        hint.disabled = true
    }
    // save Number Of Hints even if user reload
    let savedHints = JSON.parse(sessionStorage.getItem('savedHints')) ?? numberOfHints
    if (savedHints == 0) {
        hint_value.innerHTML = 0
        hint.disabled = true
    }

    // save Message even if user reload
    const message = document.querySelector('.message')
    let savedMessage = sessionStorage.getItem("savedMessage")
    if (savedMessage) message.innerHTML = savedMessage
}