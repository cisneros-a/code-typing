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
let arrOfClosings = [
  27,
  54,
  98,
  128,
  129,
  130,
  168,
  169,
  173,
  186,
  233,
  261,
  278,
  286,
  290,
];

// let extraNodesPerLine = [-1, 1, 3, 5, 7, 9, 11, 13, 15, 17, 19];
// let nodesToRemovePerLine = [2, 1, 0, -1, -2, -3, -4, -5];
let nodesPerLine = [32, 22, 44, 31, 41, 18, 40, 31, 11, 7, 4];

function determineLine(num) {
  // console.log("function for line", num);
  let totalNodes = 0;
  let nodesBeforeCurrentLine = 0;
  for (let i = 0; i < nodesPerLine.length; i++) {
    totalNodes += nodesPerLine[i] + 1;
    if (nodesBeforeCurrentLine <= num && num <= totalNodes) {
      // if (nodesBeforeCurrentLine < num + extraNodesPerLine[i] && 1) {
      return {
        line: i,
        node: num - nodesBeforeCurrentLine + (i + 1) * -1,
      };
    }

    nodesBeforeCurrentLine += nodesPerLine[i];
  }
  return totalNodes;
}

for (let i = 0; i < arrOfClosings.length; i++) {
  // console.log(i);
  console.log(determineLine(arrOfClosings[i]));
}

// console.log(nodeLines);
// determineLine(177)
// determineLine(222)
// determineLine(248)

//=========================================
//=========================================
//=========================================
//=========================================
//=========================================
//=========================================

// intervals();
