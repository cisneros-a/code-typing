export const snippetArray = [
  `1
let removeDups = nums => {
2
    for (let i of nums) {
3
        if (nums[i] === nums[i + 1]) {
4
            nums.splice(i, 1);
5
            let j = i + 1;
6
            while (nums[i] === nums[j]) {
7
                nums.splice(j, 1);
8
            }
9
        }
10
    }
11
    return nums.length;
12
};
      `,
  `1
sortIndexesToSkip: function(indexesToSkip) {
2
    let sortedIndexes = indexesToSkip.sort((a, b) => {
3
        if (a.line === b.line) {
4
            return a.node - b.node;
5
        }
6
        return a.line - b.line;
7
    });
8
    return sortedIndexes;
9
};`,
  `1
function createLetterDivs(innerText, firstChar) {
2
    let createdElement = document.createElement("div");
3
    firstChar
4
        ?
5
        createdElement.classList.add("letter", "first-of-row") :
6
        createdElement.classList.add("letter");
7
    createdElement.innerText = innerText;
8
    return createdElement;
9
};
`,
  `1
({
2
    [(
3
        [{
4
            ([])
5
        }]
6
    )]
7
});
`,
];
