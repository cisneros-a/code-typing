(function run() {
  const lettersContainer = document.querySelector(".letters-container");
  const audio = document.querySelector(`audio[data-key="01"]`);
  const wordDiv = document.querySelector(".feedback");

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

  let state = {
    currentCharIndex: 1,
    currentLine: 0,
    lineChars: [],
    pairs: [],
    indexesToSkip: [],
    currentSymbol: 0,
    string: "",
  };

  function fetchFormattedCode() {
    fetch("https://code-formatter.herokuapp.com/codeFormatter", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        snippet: `
  function removeLineNumbers(code) {
    let justWords = [];
    for (let i = 1; i < code.length; i += 2) {
      justWords.push(code[i]);
    }
    console.log(justWords.join(""));
    state.string = justWords.join("");
  }
      `,
      }),
    })
      .then((res) => res.text())
      .then((data) => seperateCodeIntoLines(data));
  }

  fetchFormattedCode();

  // const arr = [
  //   "1",
  //   "let twoSum = (arr, total) => {",
  //   "2",
  //   "    let numObj = {};",
  //   "3",
  //   "    for (let i = 0; i < arr.length; i++) {",
  //   "4",
  //   "        if (numObj[arr[i]]) {",
  //   "5",
  //   "            return [numObj[arr[i]], i];",
  //   "6",
  //   "        } else {",
  //   "7",
  //   "            let diff = total - arr[i];",
  //   "8",
  //   "            numObj[diff] = i;",
  //   "9",
  //   "        }",
  //   "10",
  //   "    }",
  //   "11",
  //   "};",
  // ];

  const mergeIndexes = (arr) => {
    let completedLines = [];
    for (let i = 0; i < arr.length - 1; i += 2) {
      completedLines.push(arr[i] + arr[i + 1]);
    }
    displayTypeableCode(completedLines);
  };

  function seperateCodeIntoLines(code) {
    splitCode = code.split(/\n/);
    removeLineNumbers(splitCode);
    mergeIndexes(splitCode);
  }

  function removeLineNumbers(code) {
    let justWords = [];
    for (let i = 1; i < code.length; i += 2) {
      justWords.push(code[i]);
    }
    state.string = justWords.join("");
  }

  function displayTypeableCode(lineArray) {
    createLineDivs(lineArray);
    findMatchingPairs(state.string);

    addKeyListener();
    highlightFirstLetter();
  }

  function highlightFirstLetter() {
    firstLetter = lettersContainer.childNodes[0].childNodes[2];
    firstLetter.classList.add("active");
    // let allNodes = lettersContainer.getElementsByTagName("*");
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
      if (e.key !== "Shift") {
        highlightNextLetter(e.key);
        // audio.play();
      }
    });
  }

  function highlightNextLetter(keyPress) {
    state.currentCharIndex++;
    const line = lettersContainer.childNodes[state.currentLine];
    const nextLetter = line.childNodes[state.currentCharIndex + 1];
    const currentLetter = line.childNodes[state.currentCharIndex];

    currentLetter.classList.remove("active");

    if (state.currentCharIndex > state.lineChars[state.currentLine] - 1) {
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

    if (
      state.currentCharIndex === state.indexesToSkip[0].node - 1 &&
      state.currentLine === state.indexesToSkip[0].line
    ) {
      currentLetter.classList.remove("active");
      state.indexesToSkip = state.indexesToSkip.splice(1);
      highlightNextLetter();
    }
  }

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

      currentLetter.classList.add("active");
    }
  }

  function lightUpTypedLetter(response, currentLetter) {
    currentLetter.classList.add(response);
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
    let allNodes = lettersContainer.getElementsByTagName("*");
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
  }

  function findCharacterMatch(index, symbol, testString) {
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
    let maths = [3];
    for (let i = 1; i < lineCount; i++) {
      maths.push(i * 3 + 3);
    }
    return maths;
  }

  function determineCorrectNode(num) {
    const lines = lettersContainer.childNodes;
    let charsPerLineArray = [];
    for (let i = 0; i < lines.length; i++) {
      charsPerLineArray.push(lines[i].childNodes.length);
    }

    let nodesToAddPerLine = findNodeCountToAdd(charsPerLineArray.length);
    let totalNodes = 0;
    for (let i = 0; i < charsPerLineArray.length; i++) {
      totalNodes += charsPerLineArray[i] + 1;
      console.log(
        "total nodes",
        totalNodes,
        "our num is",
        num + nodesToAddPerLine[i]
      );
      if (totalNodes > num + nodesToAddPerLine[i]) {
        return num + nodesToAddPerLine[i];
      }
    }
  }
})();
