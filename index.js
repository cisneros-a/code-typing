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
    string: `
    let twoSum = (arr, total) => {
      let numObj = {};
      for (let i = 0; i < arr.length; i++) {
          if (numObj[arr[i]]) {
              return [numObj[arr[i]], i];
          } else {
              let diff = total - arr[i];
              numObj[diff] = i;
          }
      }
  };
    `,
  };

  function fetchFormattedCode() {
    fetch("http://localhost:5000/codeFormatter", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        snippet: `
        let twoSum = (arr, total) => {
          let numObj = {};
          for (let i = 0; i < arr.length; i++) {
              if (numObj[arr[i]]) {
                  return [numObj[arr[i]], i];
              } else {
                  let diff = total - arr[i];
                  numObj[diff] = i;
              }
          }
      };
      `,
      }),
    })
      .then((res) => res.text())
      .then((data) => seperateCodeIntoLines(data));
  }

  // fetchFormattedCode();

  const string1 = `
  let twoSum2 = (arr, total) => {
    let numObj = {};
    for (let i = 0; i < arr.length; i++) {
        if (numObj[arr[i]]) {
            return [numObj[arr[i]], i];
        } else {
            let diff = total - arr[i];
            numObj[diff] = i;
        }
    }
};
  `;

  const arr = [
    "1",
    "let twoSum = (arr, total) => {",
    "2",
    "    let numObj = {};",
    "3",
    "    for (let i = 0; i < arr.length; i++) {",
    "4",
    "        if (numObj[arr[i]]) {",
    "5",
    "            return [numObj[arr[i]], i];",
    "6",
    "        } else {",
    "7",
    "            let diff = total - arr[i];",
    "8",
    "            numObj[diff] = i;",
    "9",
    "        }",
    "10",
    "    }",
    "11",
    "};",
  ];

  const mergeIndexes = (arr) => {
    let completedLines = [];
    for (let i = 0; i < arr.length - 1; i += 2) {
      completedLines.push(arr[i] + arr[i + 1]);
    }
    // console.log(completedLines);
    displayTypeableCode(completedLines);
  };

  function seperateCodeIntoLines(code) {
    splitCode = code.split(/\n/);
    mergeIndexes(splitCode);
  }
  // seperateCodeIntoLines(string1);

  mergeIndexes(arr);

  function displayTypeableCode(lineArray) {
    createLineDivs(lineArray);
    addKeyListener();
    highlightFirstLetter();
  }

  function highlightFirstLetter() {
    firstLetter = lettersContainer.childNodes[0].childNodes[2];
    firstLetter.classList.add("active");
  }

  function createLineDivs(array) {
    // let totalChildNodes = 0;
    for (let i = 0; i < array.length; i++) {
      let lineDiv = document.createElement("div");
      lineDiv.classList.add(`line`);
      lettersContainer.appendChild(lineDiv);
      if (i < 9) {
        const newDiv = createLetterDivs("0", true);
        lineDiv.appendChild(newDiv);
      }
      addLettersToLine(lineDiv, array[i]);
    }
  }

  function addLettersToLine(lineDiv, line) {
    for (let i = 0; i < line.length; i++) {
      let newDiv = createLetterDivs(line[i], i < 1 ? true : false);
      lineDiv.appendChild(newDiv);
    }
    state.lineChars.push(lineDiv.childNodes.length - 1);
    // totalChildNodes += lineDiv.childNodes.length;
  }

  function createLetterDivs(innerText, firstChar) {
    let createdElement = document.createElement(`div`);
    firstChar
      ? createdElement.classList.add("letter", "first-of-row")
      : createdElement.classList.add(`letter`);
    createdElement.innerText = `${innerText}`;

    return createdElement;
  }

  function addKeyListener() {
    document.addEventListener("keydown", (e) => {
      // console.log(e);
      if (e.key !== "Shift") {
        highlightNextLetter(e.key);
        // audio.play();
      }
    });
  }

  function highlightNextLetter(keyPress) {
    console.log("highlightNextLetterTriggered");
    state.currentCharIndex++;
    const line = lettersContainer.childNodes[state.currentLine];
    const nextLetter = line.childNodes[state.currentCharIndex + 1];
    const currentLetter = line.childNodes[state.currentCharIndex];

    currentLetter.classList.remove("active");

    if (state.currentCharIndex > state.lineChars[state.currentLine] - 1) {
      // console.log("triggered", state.currentCharIndex);
      state.currentCharIndex = 2;
      state.currentLine++;

      skipIndention();
    } else {
      nextLetter.classList.add("active");
    }
    if (state.indexesToSkip.length > 0) {
      checkForSymbolToSkip();
    }
    testDetermineIfKeysMatch(keyPress, currentLetter);
  }

  function checkForSymbolToSkip() {
    const line = lettersContainer.childNodes[state.currentLine];
    const currentLetter = line.childNodes[state.currentCharIndex];
    // console.log("checkingForSymbolToSkip");
    console.log(
      `looking for line ${state.currentLine} index ${
        state.currentCharIndex
      } to match line ${state.indexesToSkip[0].line} index ${
        state.indexesToSkip[0].node - 1
      }`
    );
    if (
      state.currentCharIndex === state.indexesToSkip[0].node - 1 &&
      state.currentLine === state.indexesToSkip[0].line
    ) {
      console.log("found symbol");

      currentLetter.classList.remove("active");
      state.indexesToSkip = state.indexesToSkip.splice(1);
      highlightNextLetter();
    }
    console.log(state.indexesToSkip);
    // line.childNodes[state.currentCharIndex + 1].classList.remove("active");
  }

  // function()

  function testDetermineIfKeysMatch(keyPress, currentLetter) {
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

  function skipIndention() {
    const line = lettersContainer.childNodes[state.currentLine];
    const currentLetter = line.childNodes[state.currentCharIndex];
    let spaceCount = 0;

    for (let i = 2; i < state.lineChars[state.currentLine]; i++) {
      if (
        lettersContainer.childNodes[state.currentLine].childNodes[i]
          .innerText !== ""
      ) {
        break;
      }

      spaceCount++;
    }

    if (spaceCount > 0) {
      while (spaceCount > 1) {
        highlightNextLetter();
        spaceCount--;
      }
    } else {
      state.currentCharIndex--;

      console.log(currentLetter);

      currentLetter.classList.add("active");
    }
  }

  function lightUpTypedLetter(response, currentLetter) {
    currentLetter.classList.add(response);
  }

  function symbolCheck(currentLetter, response) {
    // console.log(testString[state.currentCharIndex]);
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
    let allNodes = lettersContainer.getElementsByTagName("*");
    // allNodes[256].classList.add("correct");
    // let currentNode = determineCorrectNode(state.pairs[state.currentSymbol][1]);

    state.indexesToSkip.push(
      findNodeLineAndIndex(state.pairs[state.currentSymbol][1])
    );
    state.indexesToSkip = sortOurObject(state.indexesToSkip);
    allNodes[state.pairs[state.currentSymbol][1]].classList.add("correct");
    checkForSymbolToSkip();
  }

  function sortOurObject(obj) {
    sortedObj = obj.sort((a, b) => {
      if (a.line === b.line) {
        return a.node - b.node;
      }
      return a.line - b.line;
    });
    return sortedObj;
  }

  function findNodeLineAndIndex(num) {
    let lines = lettersContainer.childNodes;
    // let charsPerLine = lines.childNodes;
    let totalNodes = 0;
    let nodesBeforeCurrentLine = 0;
    for (let i = 0; i < lines.length; i++) {
      totalNodes += lines[i].childNodes.length + 1;
      if (nodesBeforeCurrentLine <= num && num <= totalNodes) {
        return {
          line: i,
          node: num - nodesBeforeCurrentLine + (i + 1) * -1,
        };
      }
      nodesBeforeCurrentLine += lines[i].childNodes.length;
    }
    return totalNodes;
  }

  function determineCorrectNode(num) {
    const lines = lettersContainer.childNodes;
    let charsPerLineArray = [];
    for (let i = 0; i < lines.length; i++) {
      charsPerLineArray.push(lines[i].childNodes.length);
    }

    let nodesToAdd = findNodeCountToAdd(charsPerLineArray);

    let totalNodes = 0;
    for (let i = 0; i < charsPerLineArray.length; i++) {
      totalNodes += charsPerLineArray[i] + 1;
      if (totalNodes >= num + nodesToAdd[i]) {
        return num + nodesToAdd[i];
      }
    }
  }

  function findMatchingPairs(testString) {
    let openings = {};
    for (let i = 0; i < testString.length; i++) {
      if (
        testString[i] === "(" ||
        testString[i] === "{" ||
        testString[i] === "["
      ) {
        openings[i] = testString[i];
      }
    }
    for (let charIndex in openings) {
      findCharacterMatch(parseInt(charIndex), openings[charIndex], testString);
    }
    // console.log(state.pairs);
  }

  findMatchingPairs(string1);

  function findCharacterMatch(index, symbol, testString) {
    const lines = lettersContainer.childNodes;
    let lineLengths = [];
    for (let i = 0; i < lines.length; i++) {
      lineLengths.push(lines[i].childNodes.length);
    }
    let allNodes = lettersContainer.getElementsByTagName("*");

    // let maths = intervals(lineLengths);
    const pairsObj = {
      "(": ")",
      "{": "}",
      "[": "]",
    };
    let newOpenings = 0;
    for (let i = index + 1; i < testString.length; i++) {
      if (newOpenings === 0 && testString[i] === pairsObj[symbol]) {
        state.pairs.push([
          determineCorrectNode(index),
          determineCorrectNode(i),
        ]);
        return;
      }
      if (testString[i] === symbol) {
        newOpenings += 1;
      }
      if (testString[i] === pairsObj[symbol]) {
        newOpenings -= 1;
      }
    }
  }

  function findNodeCountToAdd(lineCount) {
    let maths = [-1];
    for (let i = 1; i < lineCount; i++) {
      maths.push(maths[i - 1] + 2);
    }
    return maths;
  }

  function intervals(lineLengths) {
    let maths = [2];
    for (let i = 1; i < lineLengths.length; i++) {
      maths.push(maths[i - 1] - 1);
    }
    console.log(maths);
  }

  function determineCorrectNode(num) {
    const lines = lettersContainer.childNodes;
    let charsPerLineArray = [];
    for (let i = 0; i < lines.length; i++) {
      charsPerLineArray.push(lines[i].childNodes.length);
    }
    // console.log("charPerLineArr", charsPerLineArray);

    let nodesToAddPerLine = findNodeCountToAdd(charsPerLineArray.length);

    let totalNodes = 0;
    for (let i = 0; i < charsPerLineArray.length; i++) {
      totalNodes += charsPerLineArray[i] + 1;
      if (totalNodes >= num + nodesToAddPerLine[i]) {
        return num + nodesToAddPerLine[i];
      }
    }
  }

  function skipSymbols() {
    let moveForward = false;
    while (!moveForward) {
      if (!state.indexesToSkip.includes(state.currentCharIndex + 1)) {
        moveForward = true;
      } else {
        state.currentCharIndex += 1;
        state.indexesToSkip.pop();

        highlightNextLetter();
      }
    }
  }
})();
