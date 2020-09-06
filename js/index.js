import { prepCodeForDisplay } from "./prepCodeForDisplay.js";
import { functions } from "./domNodeFunctions.js";
import { snippetArray } from "./codeSnippets.js";
const lettersContainer = document.querySelector(".letters-container");
const homeButton = document.querySelector(".btn-home");
const wordDiv = document.querySelector(".feedback");
const form = document.querySelector("#code-form");
const buttonGroup = document.querySelector(".buttons");
const demoButton = document.querySelector(".demo");
const yourCodeButton = document.querySelector(".your");
const smallButtonGroup = document.querySelector(".buttons-small");
const resetButton = document.querySelector(".btn-reset");
const stats = document.querySelector(".stats");
const lines = document.querySelectorAll(".line");

function run() {
  const audio = document.querySelector(`audio[data-key="01"]`);

  let state = {
    currentCharIndex: 1,
    currentLine: 0,
    lineChars: [],
    pairs: [],
    indexesToSkip: [],
    currentSymbol: 0,
    string: "",
    correctlyTyped: 0,
    total: 0,
    inSession: false,
  };

  function removeFormListener() {
    console.log("removing form listener");
    form.removeEventListener("submit", submitForm);
  }
  function submitForm(e) {
    removeFormListener();
    let input = document.querySelector(".code-input");
    e.preventDefault();
    form.classList.add("hidden");
    lettersContainer.innerHTML =
      "<h2 style='color: aliceblue;' >Formatting your code....</h2>";
    fetchFormattedCode(input.value);
  }

  // function removeForm() {
  //   document.body.removeChild(form);
  // }

  // Heroku API "https://code-formatter.herokuapp.com/codeFormatter"
  // LocalHostAPI "http://localhost:3000/codeFormatter"

  function fetchFormattedCode(code) {
    console.log(code);

    fetch("http://localhost:3001/codeFormatter", {
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

  function displayTypeableCode(apiResponse) {
    state.inSession = true;
    lettersContainer.innerHTML = "";
    lettersContainer.innerText = "";
    let preppedCode = prepCodeForDisplay(apiResponse);
    let codeSeperatedIntoLines = preppedCode[0];
    let codeString = preppedCode[1];
    state.string = codeString;

    createLineDivs(codeSeperatedIntoLines);
    populatePairs(codeString);
    softReset();
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
    document.addEventListener("keydown", addListener, true);
  }

  function addListener(e) {
    if (e.key !== "Shift") {
      // audio.play();
      highlightNextLetter(e.key);
    }
  }

  function addLettersToLineDiv(lineDiv, line) {
    smallButtonGroup.classList.remove("hidden");
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

    // this is checking if we are the end of the line
    if (currentCharIndex > lineChars[currentLine] - 1) {
      // checking if this is the final character in the code snippet
      if (currentLine === lettersContainer.childNodes.length - 1) {
        console.log(state.correctlyTyped, state.total);
        showStats();
        // return reset();
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

  function showStats() {
    state.inSesssion = false;
    smallButtonGroup.classList.add("hidden");
    stats.classList.remove("hidden");
    document.querySelector(".percentage").innerText = "Y";
    console.log("state session", state.inSession);
    while (!state.inSession) {
      console.log("not triggered");
      reset();
    }
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
    state.correctlyTyped = 0;
    state.total = 0;
    highlightFirstLetter();
    populatePairs(state.string);
  }

  function softReset() {
    const allNodes = lettersContainer.getElementsByTagName("*");
    for (let i = 0; i < allNodes.length; i++) {
      allNodes[i].classList.remove("correct");
      allNodes[i].classList.remove("incorrect");
    }
    state.currentSymbol = 0;
    state.currentCharIndex = 1;
    state.currentLine = 0;
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
    if (currentLetter.innerText === "") {
      wordDiv.innerText = "Correct!";
    } else if (currentLetter.innerText === keyPress) {
      state.total += 1;
      state.correctlyTyped += 1;
      symbolCheck(currentLetter, "correct");
      wordDiv.innerText = "Correct!";
      lightUpTypedLetter("correct", currentLetter);
    } else {
      state.total += 1;
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
    state.correctlyTyped += 1;
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

  demoButton.addEventListener("click", () => {
    buttonGroup.classList.add("hidden");
    displayTypeableCode(
      // snippetArray[Math.floor(Math.random() * Math.floor(3))]
      snippetArray[3]
    );
  });

  yourCodeButton.addEventListener("click", () => {
    buttonGroup.classList.add("hidden");
    form.classList.remove("hidden");
    form.addEventListener("submit", submitForm);
  });

  resetButton.addEventListener("click", () => {
    const line = lettersContainer.childNodes[state.currentLine];
    const currentLetter = line.childNodes[state.currentCharIndex + 1];
    currentLetter.classList.remove("active");
    reset();
  });

  (function removingListener() {
    console.log("removing keydown listener....");
    document.removeEventListener("keydown", addListener, true);
    stats.classList.add("hidden");
  })();

  lettersContainer.classList.remove("hidden");
}

run();

homeButton.addEventListener("click", () => {
  buttonGroup.classList.remove("hidden");
  lettersContainer.classList.add("hidden");
  smallButtonGroup.classList.add("hidden");

  for (let i = 0; i < lettersContainer.childNodes.length; i++) {
    while (lettersContainer.childNodes[i].firstChild) {
      lettersContainer.childNodes[i].removeChild(
        lettersContainer.childNodes[i].firstChild
      );
    }
  }

  while (lettersContainer.firstChild) {
    lettersContainer.removeChild(lettersContainer.firstChild);
  }

  run();
});
