arrOfOpenings = [
  17,
  33,
  52,
  64,
  97,
  110,
  117,
  121,
  127,
  148,
  155,
  159,
  184,
  220,
  243,
];

newArrOfClosings = [
  23,
  49,
  92,
  121,
  122,
  123,
  160,
  161,
  165,
  175,
  223,
  250,
  264,
  271,
  272,
];

let lines = [32, 22, 44, 31, 41, 18, 40, 31, 11, 7, 4];

function findNodeLineAndIndex(num) {
  let totalNodes = 0;
  let nodesBeforeCurrentLine = 0;
  for (let i = 0; i < lines.length; i++) {
    totalNodes += lines[i] + 1;
    if (nodesBeforeCurrentLine <= num && num <= totalNodes) {
      return {
        line: i,
        node: num - nodesBeforeCurrentLine + (i + 1) * -1,
      };
    }
    nodesBeforeCurrentLine += lines[i];
  }
  return totalNodes;
}

function findNodeCountToAdd(lineCount) {
  let maths = [];
  for (let i = 0; i < lineCount; i++) {
    maths.push(maths[i - 1] + 2);
  }
  return maths;
}

function determineCorrectNode(num) {
  let charsPerLineArray = [32, 22, 44, 31, 41, 18, 40, 31, 11, 7, 4];

  console.log("charsPerLine", charsPerLineArray);
  let nodesToAddPerLine = findNodeCountToAdd(charsPerLineArray.length);

  let totalNodes = 0;
  for (let i = 0; i < charsPerLineArray.length; i++) {
    totalNodes += charsPerLineArray[i] + 1;
    if (totalNodes >= num + nodesToAddPerLine[i]) {
      return num + nodesToAddPerLine[i];
    }
  }
}
