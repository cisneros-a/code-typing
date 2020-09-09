import { prepCodeForDisplay } from "./prepCodeForDisplay.js";
import { functions } from "./domNodeFunctions.js";
import { snippetArray } from "./codeSnippets.js";

window.addEventListener("DOMContentLoaded", () => {
  const lettersContainer = document.querySelector(".letters-container");
  const homeButtons = document.querySelectorAll(".btn-home");
  const wordDiv = document.querySelector(".feedback");
  const form = document.querySelector("#code-form");
  const buttonGroup = document.querySelector(".buttons");
  const demoButton = document.querySelector(".demo");
  const yourCodeButton = document.querySelector(".your");
  const smallButtonGroup = document.querySelector(".buttons-small");
  const resetButtons = document.querySelectorAll(".btn-reset");
  const stats = document.querySelector(".stats");
  let session = false;

  //Task: Have the run function only handle typing. It will only take in an argument that is code
  // so basically we will be starting run at displayTypeableCode (ln73)

  // Thinking about moving the typing session function into another file and having menu's etc in index.

  function startTypingSession(codeToParse) {
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
    };

    // setInterval(function () {
    //   console.log(state);
    // }, 3000);

    function displayTypeableCode(apiResponse) {
      lettersContainer.innerHTML = "";
      lettersContainer.innerText = "";
      let preppedCode = prepCodeForDisplay(apiResponse);
      let codeSeperatedIntoLines = preppedCode[0];
      let codeString = preppedCode[1];
      state.string = codeString;

      createLineDivs(codeSeperatedIntoLines);
      reset();
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
      console.log(state);
      if (!session) {
        console.log("adding listener..");
        window.addEventListener("keydown", addListener, true);
        session = true;
      }
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
          // Idea, scope show stats outside of runTypingSession function.
          //  -Maybe I can pass in functions as args and use that to remove listeners
          showStats(addListener, state.correctlyTyped, state.total);
          return;
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
          lettersContainer.childNodes[currentLine].childNodes[i].innerText !==
          ""
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

    function removeHighlight() {
      console.log("remove");
      const line = lettersContainer.childNodes[state.currentLine];
      const currentLetter = line.childNodes[state.currentCharIndex + 1];
      currentLetter.classList.remove("active");
      reset();
    }

    lettersContainer.classList.remove("hidden");

    resetButtons.forEach((button) =>
      button.addEventListener("click", removeHighlight)
    );

    homeButtons.forEach((button) =>
      button.addEventListener("click", () => {
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

        return;
      })
    );

    displayTypeableCode(codeToParse);
  }

  //====================Menu Buttons===================

  window.addEventListener("keydown", function (e) {
    if (e.keyCode == 32 && e.target == document.body) {
      e.preventDefault();
    }
  });

  demoButton.addEventListener("click", () => {
    buttonGroup.classList.add("hidden");
    // displayTypeableCode(
    //   // snippetArray[Math.floor(Math.random() * Math.floor(3))]
    //   snippetArray[3]
    // );
    startTypingSession(
      // snippetArray[Math.floor(Math.random() * Math.floor(3))]
      snippetArray[0]
    );
  });

  yourCodeButton.addEventListener("click", () => {
    buttonGroup.classList.add("hidden");
    form.classList.remove("hidden");
    form.addEventListener("submit", submitForm);
  });

  function submitForm(e) {
    // removeFormListener();
    let input = document.querySelector(".code-input");
    e.preventDefault();
    form.classList.add("hidden");
    lettersContainer.innerHTML =
      "<h2 style='color: aliceblue;' >Formatting your code....</h2>";
    fetchFormattedCode(input.value);
  }

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
      .then((data) => startTypingSession(data));
  }

  function showStats(addListener, correct, total) {
    window.removeEventListener("keydown", addListener, true);
    let percentage = Math.floor(((correct / total) * 100) / 25);
    const phraseOBj = {
      0: "Keep practicing!",
      1: "Not too bad!",
      2: "Nice! Almost there!",
      3: "Great job!",
      4: "Perfect!!",
    };
    document.querySelector(
      ".percentage"
    ).innerText = `You got ${correct} out of ${total}! ${phraseOBj[percentage]}`;
    // while (!state.inSession) {
    //   console.log("not triggered");
    //   reset();
    // }
    smallButtonGroup.classList.add("hidden");
    stats.classList.remove("hidden");
  }
});
