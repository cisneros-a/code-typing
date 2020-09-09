export const functions = {
  // this finds the node within the context of all nodes in our display
  determineCorrectNode: function (num, lines) {
    let charsPerLineArray = [];
    for (let i = 0; i < lines.length; i++) {
      charsPerLineArray.push(lines[i].childNodes.length);
    }
    let nodesToAddPerLine = findNodeCountToAdd(charsPerLineArray.length);
    let totalNodes = 0;
    for (let i = 0; i < charsPerLineArray.length; i++) {
      totalNodes += charsPerLineArray[i] + 1;
      if (totalNodes > num + nodesToAddPerLine[i]) {
        return num + nodesToAddPerLine[i];
      }
    }
  },

  // this function finds a node's location in the context of each line of typeable code
  findNodesLineAndIndex: function (num, lines) {
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
  },

  //this function finds all the bracket pairs in the code snippet
  findMatchingPairs: function (codeString, lettersContainer) {
    let openings = {};
    for (let i = 0; i < codeString.length; i++) {
      if (
        codeString[i] === "(" ||
        codeString[i] === "{" ||
        codeString[i] === "["
      ) {
        openings[i] = codeString[i];
      }
    }
    let pairs = [];
    for (let charIndex in openings) {
      pairs.push(
        findCharacterMatch(
          parseInt(charIndex),
          openings[charIndex],
          codeString,
          lettersContainer
        )
      );
    }
    return pairs;
  },

  // this function ensures that we skip the correctly typed closing bracket
  //in the proper order
  sortIndexesToSkip: function (indexesToSkip) {
    let sortedIndexes = indexesToSkip.sort((a, b) => {
      if (a.line === b.line) {
        return a.node - b.node;
      }
      return a.line - b.line;
    });
    return sortedIndexes;
  },
};

//==========helper function========================
function findNodeCountToAdd(lineCount) {
  let maths = [3];
  for (let i = 1; i < lineCount; i++) {
    maths.push(i * 3 + 3);
  }
  return maths;
}

function findCharacterMatch(index, symbol, codeString, lettersContainer) {
  const pairsObj = {
    "(": ")",
    "{": "}",
    "[": "]",
  };
  let newOpenings = 0;
  for (let i = index + 1; i < codeString.length; i++) {
    if (newOpenings === 0 && codeString[i] === pairsObj[symbol]) {
      return [
        functions.determineCorrectNode(index, lettersContainer.childNodes),
        functions.determineCorrectNode(i, lettersContainer.childNodes),
      ];
    }
    if (codeString[i] === symbol) {
      newOpenings += 1;
    }
    if (codeString[i] === pairsObj[symbol]) {
      newOpenings -= 1;
    }
  }
}
