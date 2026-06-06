import { numberOfHints, wordToGuess } from '../main.js'
// start mange hint 

export const hint = document.querySelector('.hint')
export const hint_value = document.querySelector('.hint span')
hint.addEventListener("click", getHint)

function getHint() {

    const activeContainerInputs = document.querySelectorAll('.inputs > div:not(.disabled-inputs) input')
    const activeInputs = Array.from(activeContainerInputs).filter(input => input.value === "")

    // determining numberOfHints based on word length

    if (sessionStorage.getItem('savedHints') === null) {
        sessionStorage.setItem('savedHints', JSON.stringify(numberOfHints));
    }
    let numberOfHintsIn = JSON.parse(sessionStorage.getItem('savedHints'));

    console.log(numberOfHintsIn)

    if (activeInputs.length > 0) {
        if (numberOfHintsIn > 0) {
            numberOfHintsIn--
            hint_value.innerHTML = numberOfHintsIn
            sessionStorage.setItem('savedHints', JSON.stringify(numberOfHintsIn))
        }
        if (numberOfHintsIn === 0) {
            hint.disabled = true
        }

        const randIndex = Math.floor(Math.random() * activeInputs.length)
        const randInput = activeInputs[randIndex]
        const indexToFill = Array.from(activeContainerInputs).indexOf(randInput)
        if (indexToFill !== -1) {
            randInput.value = wordToGuess[indexToFill].toUpperCase()
        }
    }

}

// manage Backspace 

document.addEventListener("keydown", handelBackSpace)

function handelBackSpace(event) {
    if (event.key === "Backspace") {
        // identify input index 

        const activeContainerInputs = document.querySelectorAll('.inputs > div:not(.disabled-inputs) input')
        const currIndex = Array.from(activeContainerInputs).indexOf(event.target)
        let previousIndex = currIndex - 1

        if (currIndex > 0) {

            // delete the data of previous input
            activeContainerInputs[currIndex].value = ""
            activeContainerInputs[previousIndex].value = ""
            activeContainerInputs[previousIndex].focus()
        }
    }
}
