import { prepCodeForDisplay } from "./prepCodeForDisplay.js";
import { functions } from "./domNodeFunctions.js";
import { snippetArray } from "./codeSnippets.js";

(function run() {
  const lettersContainer = document.querySelector(".letters-container");
  const audio = document.querySelector(`audio[data-key="01"]`);
  const wordDiv = document.querySelector(".feedback");
  const form = document.querySelector("#code-form");

  let state = {
    currentCharIndex: 1,
    currentLine: 0,
    lineChars: [],
    pairs: [],
    indexesToSkip: [],
    currentSymbol: 0,
    string: "",
  };

  function submitForm(e) {
    let input = document.querySelector(".code-input");
    e.preventDefault();
    form.classList.add("hidden");
    lettersContainer.innerHTML =
      "<h2 style='color: aliceblue;' >Formatting your code....</h2>";
    fetchFormattedCode(input.value);
  }

  form.addEventListener("submit", submitForm);

  // Heroku API "https://code-formatter.herokuapp.com/codeFormatter"
  // LocalHostAPI "http://localhost:3000/codeFormatter"


  function fetchFormattedCode() {
    fetch( "https://code-formatter.herokuapp.com/codeFormatter", {

      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        snippet: code,
      }),
    })
      .then((res) => res.text())
      .then((data) => displayTypeableCode(data));
  }

  displayTypeableCode(snippetArray[Math.floor(Math.random() * Math.floor(3))]);

  function displayTypeableCode(apiResponse) {
    document.body.removeChild(form);
    lettersContainer.innerHTML = "";
    lettersContainer.innerText = "";
    let preppedCode = prepCodeForDisplay(apiResponse);
    let codeSeperatedIntoLines = preppedCode[0];
    let codeString = preppedCode[1];
    state.string = codeString;

    createLineDivs(codeSeperatedIntoLines);
    populatePairs(codeString);
    addKeyListener();
    highlightFirstLetter();
  }
  function createLineDivs(array) {
    for (let i = 0; i < array.length; i++) {
      let lineDiv = document.createElement("div");
      lineDiv.classList.add(`line`);
      lettersContainer.appendChild(lineDiv);
      // this loop is to add 0's before first nine digits to keep numbers uniform
      if (i < 9) {
        const newDiv = createLetterDivs("0", true);
        lineDiv.appendChild(newDiv);
      }
      addLettersToLineDiv(lineDiv, array[i]);
    }
  }

  function populatePairs(codeString) {
    state.pairs = functions.findMatchingPairs(codeString, lettersContainer);
  }

  function addKeyListener() {
    document.addEventListener("keydown", (e) => {
      if (e.key !== "Shift") {
        // audio.play();
        highlightNextLetter(e.key);
      }
    });
  }

  function addLettersToLineDiv(lineDiv, line) {
    for (let i = 0; i < line.length; i++) {
      let newDiv = createLetterDivs(line[i], i < 1 ? true : false);
      lineDiv.appendChild(newDiv);
    }
    state.lineChars.push(lineDiv.childNodes.length - 1);
  }

  function createLetterDivs(innerText, firstChar) {
    let createdElement = document.createElement(`div`);
    firstChar
      ? createdElement.classList.add("letter", "first-of-row")
      : createdElement.classList.add(`letter`);
    createdElement.innerText = `${innerText}`;

    return createdElement;
  }

  function highlightFirstLetter() {
    console.log(state.pairs);
    const firstLetter = lettersContainer.childNodes[0].childNodes[2];
    firstLetter.classList.add("active");
  }

  function highlightNextLetter(keyPress) {
    state.currentCharIndex++;
    const { currentCharIndex, currentLine, indexesToSkip, lineChars } = state;
    const line = lettersContainer.childNodes[currentLine];
    const nextLetter = line.childNodes[currentCharIndex + 1];
    const currentLetter = line.childNodes[currentCharIndex];

    currentLetter.classList.remove("active");

    if (currentCharIndex > lineChars[currentLine] - 1) {
      if (currentLine === lettersContainer.childNodes.length - 1) {
        return reset();
      }
      state.currentCharIndex = 2;
      state.currentLine++;

      skipIndention();
    } else {
      nextLetter.classList.add("active");
    }
    if (state.indexesToSkip.length > 0) {
      checkForSymbolToSkip();
    }
    determineIfKeysMatch(keyPress, currentLetter);
  }

  function reset() {
    const allNodes = lettersContainer.getElementsByTagName("*");
    for (let i = 0; i < allNodes.length; i++) {
      allNodes[i].classList.remove("correct");
      allNodes[i].classList.remove("incorrect");
    }
    state.currentSymbol = 0;
    state.currentCharIndex = 1;
    state.currentLine = 0;
    highlightFirstLetter();
    populatePairs(state.string);
  }

  function checkForSymbolToSkip() {
    const { currentCharIndex, currentLine, indexesToSkip } = state;
    const line = lettersContainer.childNodes[currentLine];
    const currentLetter = line.childNodes[currentCharIndex];
    if (
      currentCharIndex === indexesToSkip[0].node - 1 &&
      currentLine === indexesToSkip[0].line
    ) {
      currentLetter.classList.remove("active");
      state.indexesToSkip = indexesToSkip.splice(1);
      highlightNextLetter();
    }
  }

  function determineIfKeysMatch(keyPress, currentLetter) {
    if (currentLetter.innerText === keyPress) {
      symbolCheck(currentLetter, "correct");
      wordDiv.innerText = "Correct!";
      lightUpTypedLetter("correct", currentLetter);
    } else {
      symbolCheck(currentLetter, "incorrect");
      wordDiv.innerText = "Incorrect!";
      lightUpTypedLetter("incorrect", currentLetter);
    }
  }

  function lightUpTypedLetter(response, currentLetter) {
    currentLetter.classList.add(response);
  }

  function skipIndention() {
    const { currentCharIndex, currentLine, lineChars } = state;

    const line = lettersContainer.childNodes[currentLine];
    const currentLetter = line.childNodes[currentCharIndex];
    let spaceCount = 0;

    for (let i = 2; i < lineChars[currentLine]; i++) {
      if (
        lettersContainer.childNodes[currentLine].childNodes[i].innerText !== ""
      ) {
        break;
      }
      spaceCount++;
    }

    skipEachSpace(currentLetter, spaceCount);
  }

  function skipEachSpace(currentLetter, spaceCount) {
    let spaces = spaceCount;
    if (spaces > 0) {
      while (spaces > 1) {
        highlightNextLetter();
        spaces--;
      }
    } else {
      state.currentCharIndex--;

      currentLetter.classList.add("active");
    }
  }

  function symbolCheck(currentLetter, response) {
    if (
      currentLetter.innerText === "(" ||
      currentLetter.innerText === "{" ||
      currentLetter.innerText === "["
    ) {
      if (response === "correct") lightUpPair();
      state.currentSymbol++;
    }
  }

  function lightUpPair() {
    const { pairs, currentSymbol, indexesToSkip } = state;
    let allNodes = lettersContainer.getElementsByTagName("*");
    state.indexesToSkip.push(
      functions.findNodesLineAndIndex(
        pairs[currentSymbol][1],
        lettersContainer.childNodes
      )
    );
    state.indexesToSkip = functions.sortIndexesToSkip(state.indexesToSkip);
    allNodes[pairs[currentSymbol][1]].classList.add("correct");
    if (indexesToSkip.length > 0) {
      checkForSymbolToSkip();
    }
  }
})();
