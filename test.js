// const testString2 = `let createdElement = (document.createElement({element}));

// if (secondClass !== "") {
//   createdElement.classList.add("letter","active");
// } []
// createdElement.classList.add({className});
// createdElement.innerText = {innerText};
// return createdElement;
// }`;

// console.log(testString.length);
// let matchingPairs = {};

// function findMatchingPairs() {
//   let openings = {};
//   for (let i = 0; i < testString.length; i++) {
//     if (
//       testString[i] === "(" ||
//       testString[i] === "{" ||
//       testString[i] === "["
//     ) {
//       openings[i] = testString[i];
//     }
//   }
//   for (let charIndex in openings) {
//     findCharacterMatch(parseInt(charIndex), openings[charIndex]);
//   }
// }

// findMatchingPairs();

// function findCharacterMatch(index = 45, symbol = "{") {
//   const pairsObj = {
//     "(": ")",
//     "{": "}",
//     "[": "]",
//   };
//   let newOpenings = 0;
//   for (let i = index + 1; i < testString.length; i++) {
//     //   console.log(testString[i], )
//     if (newOpenings === 0 && testString[i] === pairsObj[symbol]) {
//       matchingPairs[index] = i;
//       return;
//     }
//     if (testString[i] === symbol) {
//       newOpenings += 1;
//     }
//     if (testString[i] === pairsObj[symbol]) {
//       newOpenings -= 1;
//     }
//   }
// }
// console.log(findCharacterMatch());

// console.log(matchingPairs);

let nodeLines = {};

//match is 17-

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

// let extraNodesPerLine = [-1, 1, 3, 5, 7, 9, 11, 13, 15, 17, 19];
// let nodesToRemovePerLine = [2, 1, 0, -1, -2, -3, -4, -5];
// console.log(
//   numss.sort((a, b) => {
//     return a - b;
//   })
// );

// should be returning
// { line: 0, node: 26 }
// { line: 1, node: 20 }
// { line: 2, node: 41 }
// { line: 3, node: 26 }
// { line: 3, node: 27 }
// { line: 3, node: 28 }
// { line: 4, node: 34 } //26
// { line: 4, node: 35 } //27,
// { line: 4, node: 39 } // 31
// { line: 5, node: 10 } // 1
// { line: 6, node: 38 }
// { line: 7, node: 25 }
// { line: 8, node: 10 }
// { line: 9, node: 6 }
// { line: 10, node: 2 }

let lines = [32, 22, 44, 31, 41, 18, 40, 31, 11, 7, 4];

function findNodeLineAndIndex(num) {
  // let lines = lettersContainer.childNodes;
  // let charsPerLine = lines.childNodes;
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
  console.log(totalNodes);
  return totalNodes;
}

// console.log(findNodeLineAndIndex(290));

function findNodeCountToAdd(lineCount) {
  let maths = [];
  for (let i = 0; i < lineCount; i++) {
    maths.push(maths[i - 1] + 2);
  }
  return maths;
}

function determineCorrectNode(num) {
  // console.log(num);
  // const lines = lettersContainer.childNodes;
  let charsPerLineArray = [32, 22, 44, 31, 41, 18, 40, 31, 11, 7, 4];
  // for (let i = 0; i < lines.length; i++) {
  //   charsPerLineArray.push(lines[i].childNodes.length);
  // }
  // console.log("charPerLineArr", charsPerLineArray);
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

let newOpenings = [
  24,
  48,
  89,

  116,
  117,
  118,

  153,
  154,
  158,

  168,

  212,

  237,

  251,
  256,
  257,
];

for (let i = 0; i < newOpenings.length; i++) {
  console.log(determineCorrectNode(newOpenings[i]));
}

// what we should be returning
let arrOfClosings = [
  27, //0
  // add 3

  54, //1
  // add 6

  98, //2
  // add 9

  128, //3
  129, //3
  130, //3
  // add 12

  168, //4
  169, //4
  173, //4
  //add 15

  186, //5
  // add 18

  233, //6
  //add 21

  261, //7
  //add 24

  278, //8
  // add 27

  286, //9
  //add 30

  290, //10
  //add 33
];

let closings = [
  { 0: 28 },
  { 1: 53 },
  { 2: 95 },
  { 3: [123, 124, 125] },
  { 4: [161, 162, 166] },
  { 5: 177 },
  { 6: 222 },
  { 7: 248 },
  { 8: 263 },
  { 9: 269 },
  { 10: 271 },
];
