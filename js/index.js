import { prepCodeForDisplay } from "./prepCodeForDisplay.js";
import { functions } from "./domNodeFunctions.js";

(function run() {
  const lettersContainer = document.querySelector(".letters-container");
  const audio = document.querySelector(`audio[data-key="01"]`);
  const wordDiv = document.querySelector(".feedback");

  let state = {
    currentCharIndex: 1,
    currentLine: 0,
    lineChars: [],
    pairs: [],
    indexesToSkip: [],
    currentSymbol: 0,
  };

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
        snippet: `
        var isAnagram = function(s, t){if (s.length !== t.length) {
              return false} let sArray = s.split(''); let tArray = t.split('');
          for (let i = 0; i < sArray.length; i++) {
            if ( tArray.includes(sArray[i])) { var found = tArray.indexOf(sArray[i])
              tArray.splice(found, 1) } else {
              return false } } return true
        }
      `,
      }),
    })
      .then((res) => res.text())
      .then((data) => displayTypeableCode(data));
  }

  function displayTypeableCode(apiResponse) {
    let preppedCode = prepCodeForDisplay(apiResponse);
    let codeSeperatedIntoLines = preppedCode[0];
    let codeString = preppedCode[1];

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
      state.currentCharIndex = 2;
      state.currentLine++;

      skipIndention();
    } else {
      nextLetter.classList.add("active");
    }
    if (indexesToSkip.length > 0) {
      checkForSymbolToSkip();
    }
    determineIfKeysMatch(keyPress, currentLetter);
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
    const { pairs, currentSymbol } = state;
    let allNodes = lettersContainer.getElementsByTagName("*");
    state.indexesToSkip.push(
      functions.findNodesLineAndIndex(
        pairs[currentSymbol][1],
        lettersContainer.childNodes
      )
    );
    state.indexesToSkip = functions.sortIndexesToSkip(state.indexesToSkip);
    allNodes[pairs[currentSymbol][1]].classList.add("correct");
    checkForSymbolToSkip();
  }

  fetchFormattedCode();
})();
