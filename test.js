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

let lineLengths = [32, 22, 44, 31, 41, 18, 40, 31, 11, 7, 4];

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

let extraNodesPerLine = [-1, 1, 3, 5, 7, 9, 11, 13, 15, 17, 19];
let nodeLines = {};

function determineLine(num) {
  let totalNodes = 0;
  for (let i = 0; i < lineLengths.length; i++) {
    totalNodes += lineLengths[i] + 1;
    if (totalNodes >= num + maths[i]) {
      return num + maths[i];
    }
  }
  return totalNodes;
}

arr = [17, 33, 52, 64, 97, 110, 117, 121, 127, 148, 155, 159, 184, 220, 243];

for (let i = 0; i < arr.length; i++) {
  console.log(determineLine(arr[i]));
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
