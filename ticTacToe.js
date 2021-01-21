"use strict";
let clickedTableID;

const _ = undefined;
// Game dimensions - size
let dimensions = 6;
// How many buttons have to be inline (4-1, 6-2 and so on)
let equalMoves;
dimensions !== 3 ? (equalMoves = dimensions - 4) : (equalMoves = 0);
// Change later (Change to true if on main page - Change to false for ingame)
let flagTimer = false; //false

// Object with current results
const results = {
  xMark: 0,
  oMark: 0,
};
const emptyBox = "⛓";

// Creating buttons table in html
const createButtons = (dimensions = 3) => {
  for (let first = 0; first < dimensions; first++) {
    for (let second = 0; second < dimensions; second++) {
      let createForm = document.createElement("form");
      createForm.classList.add("forms");
      createForm.id = `${first}${second}`;
      document.querySelector(".table").appendChild(createForm);
      for (let third = 0; third < dimensions; third++) {
        for (let forth = 0; forth < dimensions; forth++) {
          let createButton = document.createElement("button");
          createButton.classList.add("btn");
          createButton.classList.add(`mini-tables-${first}${third}`);
          createButton.id = `${first}${third}-${second}-${forth}`;
          createButton.type = "button";
          document
            .getElementById(`${first}${second}`)
            .appendChild(createButton);
        }
      }
    }
  }
};
createButtons(dimensions);

// CSS Styles object
const styleContent = {
  buttonContent: `
  width: 27px !important;

  background-color: rgb(36, 216, 156);
  padding-top: 0%;
  padding-bottom: 0%;
  padding-right: 0%;
  border-radius: 20%;
  border: none;
  color: rgb(74, 74, 78);
  padding: 0.23%;
  
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 100%;
  
  margin: 0.2% 0.2%;
  border-right-width: 0.1%;
  border-left-width: 0.1%;
  border-bottom-width: 0.1%;
  border-top-width: 0.1%;
  border-block-color: grey;
  box-shadow: 3px 3px 0 #000,
  -1px -1px 0 #000,  
   1px -1px 0 #000,
   -1px 1px 0 #000,
    1px 1px 0 #000;
  `,
};

// Changing colors function
const rgbTableMovement = function (dimensions = 3) {
  for (let first = 0; first < dimensions; first++) {
    for (let second = 0; second < dimensions; second++) {
      let tempString = styleContent.buttonContent.replace(
        /background-color:\srgb\(\d+,\s\d+,\s\d+\);/gm,
        `background-color: rgb(${Math.trunc(Math.random() * 255)}, ${Math.trunc(
          Math.random() * 255
        )}, ${Math.trunc(Math.random() * 255)});`
      );
      styleContent.buttonContent = tempString;

      let elStyle = document.querySelectorAll(`.mini-tables-${first}${second}`);
      elStyle.forEach((el) => (el.style.cssText = styleContent.buttonContent));
    }
  }
};

// Changing colors loop
function colorLoop() {
  rgbTableMovement(dimensions);
  setTimeout(() => {
    if (flagTimer) {
      return colorLoop();
    }
  }, 1000);
}
colorLoop();
// Takes later the signs X or O
let playerNum;

const btnReset = document.querySelector(".reset-btn");
const result = document.getElementById("result");
const buttons = {};
const boards = {};

// Addind the html buttons in JS object to operate with
const addButtons = (dimensions = 3) => {
  for (let first = 0; first < dimensions; first++) {
    for (let second = 0; second < dimensions; second++) {
      for (let third = 0; third < dimensions; third++) {
        for (let forth = 0; forth < dimensions; forth++) {
          buttons[
            `btn${first}${second}${third}${forth}`
          ] = document.getElementById(`${first}${second}-${third}-${forth}`);
        }
      }
    }
  }
};
addButtons(dimensions);

// Formating the buttons look and value
const formatButtons = () => {
  for (const [key, val] of Object.entries(buttons)) val.textContent = emptyBox;
};
formatButtons();

// Creating the mini boards and adding them to the boards object
const createBoards = (dimensions = 3) => {
  let arr = [];
  for (let first = 0; first < dimensions; first++) {
    for (let second = 0; second < dimensions; second++) {
      boards[`board${first}${second}`] = [];
      for (let third = 0; third < dimensions; third++) {
        for (let forth = 0; forth < dimensions; forth++) {
          let button =
            buttons[`btn${first}${second}${third}${forth}`].textContent;

          arr.push(button);
          if (forth === dimensions - 1) {
            boards[`board${first}${second}`].push(arr);
            arr = [];
          }
        }
      }
    }
  }

  // for (let first = 0; first < dimensions; first++) {
  //   for (let second = 0; second < dimensions; second++) {
  //     boards[`board${first}${second}`] = [
  //       [
  //         buttons[`btn${first}${second}00`].textContent,
  //         buttons[`btn${first}${second}01`].textContent,
  //         buttons[`btn${first}${second}02`].textContent,
  //       ],
  //       [
  //         buttons[`btn${first}${second}10`].textContent,
  //         buttons[`btn${first}${second}11`].textContent,
  //         buttons[`btn${first}${second}12`].textContent,
  //       ],
  //       [
  //         buttons[`btn${first}${second}20`].textContent,
  //         buttons[`btn${first}${second}21`].textContent,
  //         buttons[`btn${first}${second}22`].textContent,
  //       ],
  //     ];
  //   }
  // }
};
createBoards(dimensions);

// let mainBoard = [
//   [boards.board00, boards.board01, boards.board02],
//   [boards.board10, boards.board11, boards.board12],
//   [boards.board20, boards.board21, boards.board22],
// ];

// Creating the main board
const creatingMainBoard = (dimensions = 3) => {
  let inputBoardRow;
  let boardRow = [];
  let inputMainBoard = [];
  let mainBoard = [];
  let flagsObject = {};
  let flagCompletedObject = {};
  for (let i = 0; i < dimensions; i++) {
    boardRow = [];
    for (let n = 0; n < dimensions; n++) {
      flagsObject[`flag${i}${n}`] = false;
      flagCompletedObject[`flagCompleted${i}${n}`] = false;
      inputBoardRow = boards[`board${i}${n}`];
      boardRow.push(inputBoardRow);
    }
    inputMainBoard = [...boardRow];
    mainBoard.push(inputMainBoard);
  }
  return { mainBoard, flagsObject, flagCompletedObject };
};

let mainBoardObject = { ...creatingMainBoard(dimensions) };
let mainBoard = mainBoardObject[`mainBoard`];

// Flag allowing to make more moves at the whole board - default: false
let flag = false;

// Flag for even game
let flagNoWin = false;

// Flag for win game
let flagWins = false;

// move itteration variable
let i = -1;

// alert messaging function
const printMsg = () => {
  if (flagNoWin) alert("The game ended! Nobody wins 🤝");
  if (flagWins) alert(`Player ${playerNum} wins!`);
};

// Checking the game condition - return true for game ended
const check = function (
  board,
  mark = "⬜",
  mainBx = "UnSet",
  mainBy = "UnSet"
) {
  let rows = [];
  let colum = [];
  let diag = [];
  let diagReversed = [];

  for (let row = 0; row < board.length; row++) {
    rows = [];

    for (let col = 0; col < board[row].length; col++) {
      typeof board[col][row] !== "string"
        ? colum.push(mark)
        : colum.push(board[col][row]);

      typeof board[row][col] !== "string"
        ? rows.push(mark)
        : rows.push(board[row][col]);

      if (rows.length === board.length - equalMoves && !rows.includes(mark)) {
        if (new Set(rows).size === 1) {
          if (mainBx !== "UnSet" && mainBy !== "UnSet")
            mainBoardObject.flagsObject[`flag${mainBx}${mainBy}`] = true;
          return true;
        }
      }

      if (rows.length === board.length - equalMoves) {
        rows.splice(0, 1);
      }

      if (colum.length === board.length - equalMoves && !colum.includes(mark)) {
        if (new Set(colum).size === 1) {
          if (mainBx !== "UnSet" && mainBy !== "UnSet")
            mainBoardObject.flagsObject[`flag${mainBx}${mainBy}`] = true;
          return true;
        }
      }
      if (colum.length === board.length - equalMoves) {
        colum.splice(0, 1);
        if (col === board[row].length - 1) colum = [];
      }

      if (col === row) {
        typeof board[col][row] !== "string"
          ? diag.push(mark)
          : diag.push(board[col][row]);

        if (diag.length === board.length - equalMoves && !diag.includes(mark)) {
          if (new Set(diag).size === 1) {
            if (mainBx !== "UnSet" && mainBy !== "UnSet")
              mainBoardObject.flagsObject[`flag${mainBx}${mainBy}`] = true;
            return true;
          }
        }

        if (diag.length === board.length - equalMoves) diag.splice(0, 1);
      }
    }
  }
  for (let row = 1; row <= board.length; row++) {
    for (let col = board.length; col >= 1; col--) {
      console.log(diagReversed);

      if (col + row === board.length + 1) {
        typeof board[board.length - col][board.length - row] !== "string"
          ? diagReversed.push(mark)
          : diagReversed.push(board[board.length - col][board.length - row]);
        console.log("before", diagReversed);

        if (
          diagReversed.length === board.length - equalMoves &&
          !diagReversed.includes(mark)
        ) {
          if (new Set(diagReversed).size === 1) {
            if (mainBx !== "UnSet" && mainBy !== "UnSet")
              mainBoardObject.flagsObject[`flag${mainBx}${mainBy}`] = true;
            return true;
          }
        }
        if (diagReversed.length === board.length - equalMoves) {
          diagReversed.splice(0, 1);
          console.log("After", diagReversed);
        }
      }
    }
  }

  let rowDiag = 0;
  let colDiag = 1;
  let countDiag = 1;
  while (true) {
    typeof board[rowDiag][colDiag] !== "string"
      ? diag.push(mark)
      : diag.push(board[rowDiag][colDiag]);

    if (diag.length === board.length - equalMoves && !diag.includes(mark)) {
      if (new Set(diag).size === 1) {
        if (mainBx !== "UnSet" && mainBy !== "UnSet")
          mainBoardObject.flagsObject[`flag${mainBx}${mainBy}`] = true;
        return true;
      }
    }

    if (diag.length === board.length - equalMoves) diag.splice(0, 1);

    if (colDiag === board.length - 1) {
      countDiag++;
      diag = [];
      rowDiag = 0;

      if (countDiag === board.length - 1) {
        countDiag = 1;
        colDiag = 1;
        break;
      } else {
        colDiag = countDiag;
        continue;
      }
    }
    rowDiag++;
    colDiag++;
  }

  rowDiag++;
  colDiag++;
  while (true) {
    typeof board[board.length - rowDiag][board.length - colDiag] !== "string"
      ? diag.push(mark)
      : diag.push(board[board.length - rowDiag][board.length - colDiag]);

    if (diag.length === board.length - equalMoves && !diag.includes(mark)) {
      if (new Set(diag).size === 1) {
        if (mainBx !== "UnSet" && mainBy !== "UnSet")
          mainBoardObject.flagsObject[`flag${mainBx}${mainBy}`] = true;
        return true;
      }
    }

    if (diag.length === board.length - equalMoves) diag.splice(0, 1);
    if (board.length - colDiag === 0) {
      countDiag++;
      diag = [];
      rowDiag = 1;

      if (countDiag === board.length - 1) {
        countDiag = 1;
        colDiag = 2;
        break;
      } else {
        colDiag = countDiag;
        continue;
      }
    }
    rowDiag++;
    colDiag++;
  }

  rowDiag = 0;
  colDiag = 2;
  countDiag = 2;
  while (true) {
    typeof board[rowDiag][board.length - colDiag] !== "string"
      ? diag.push(mark)
      : diag.push(board[rowDiag][board.length - colDiag]);

    if (diag.length === board.length - equalMoves && !diag.includes(mark)) {
      if (new Set(diag).size === 1) {
        if (mainBx !== "UnSet" && mainBy !== "UnSet")
          mainBoardObject.flagsObject[`flag${mainBx}${mainBy}`] = true;
        return true;
      }
    }

    if (diag.length === board.length - equalMoves) diag.splice(0, 1);

    if (colDiag === board.length) {
      countDiag++;
      diag = [];

      if (rowDiag === 1) {
        break;
      } else {
        rowDiag = 0;
        colDiag = countDiag;
        continue;
      }
    }
    rowDiag++;
    colDiag++;
  }

  rowDiag = 1;
  colDiag = 1;
  countDiag = 1;
  while (true) {
    typeof board[board.length - rowDiag][colDiag] !== "string"
      ? diag.push(mark)
      : diag.push(board[board.length - rowDiag][colDiag]);

    if (diag.length === board.length - equalMoves && !diag.includes(mark)) {
      if (new Set(diag).size === 1) {
        if (mainBx !== "UnSet" && mainBy !== "UnSet")
          mainBoardObject.flagsObject[`flag${mainBx}${mainBy}`] = true;
        return true;
      }
    }

    if (diag.length === board.length - equalMoves) diag.splice(0, 1);
    if (colDiag === board.length - 1) {
      countDiag++;
      diag = [];

      if (rowDiag === 2) {
        break;
      } else {
        rowDiag = 1;
        colDiag = countDiag;
        continue;
      }
    }
    rowDiag++;
    colDiag++;
  }
};
// Main game
function playGame(sequence) {
  const move = () => sequence[0].split(" ").map((val) => Number(val));
  let [x, y, xBoard, yBoard] = move();

  if (
    !flag &&
    !mainBoardObject.flagCompletedObject[`flagCompleted${xBoard}${yBoard}`]
  ) {
    i++;
    const marks = ["❌", "⭕"];

    let board = boards[`board${xBoard}${yBoard}`];

    const checkFreeSpace = function () {
      let flagFree;

      for (const el of board) {
        flagFree = el.includes(emptyBox);
        if (flagFree) break;
      }
      if (!flagFree)
        mainBoardObject.flagsObject[`flag${xBoard}${yBoard}`] = true;

      let flagFreeMain = Object.values(mainBoardObject.flagsObject).includes(
        false
      );
      return flagFreeMain;
    };

    const printBoard = function () {
      for (const el of board) {
        console.log(`${el.join("\t")}`);
      }
    };

    const mark = function () {
      i++;
      const temp = marks.shift();
      marks.push(temp);

      return marks;
    };

    if (board[x][y] !== marks[0] && board[x][y] !== marks[1]) {
      if (i % 2 === 0) {
        //player 1
        let btn = (document.getElementById(
          `${xBoard}${yBoard}-${x}-${y}`
        ).textContent = marks[0]);
        board[x][y] = btn;
        playerNum = marks[0];
      } else {
        //player 2
        let btn = (document.getElementById(
          `${xBoard}${yBoard}-${x}-${y}`
        ).textContent = marks[1]);
        board[x][y] = btn;
        playerNum = marks[1];
      }
    } else {
      mark();
      alert("This place is already taken. Please choose another!");
    }

    if (check(board, emptyBox)) {
      mainBoard[`${xBoard}`][`${yBoard}`] = playerNum;
      mainBoardObject.flagCompletedObject[
        `flagCompleted${xBoard}${yBoard}`
      ] = true;
      if (check(mainBoard, _, xBoard, yBoard)) {
        playerNum === "❌" ? results.xMark++ : results.oMark++;

        result.textContent = `Result: ❌=${results.xMark} ::: ⭕=${results.oMark}`;
        printBoard();
        flagWins = true;
        printMsg();
        flag = true;
      }
    } else if (!checkFreeSpace()) {
      flagNoWin = true;
      printMsg();
      printBoard();
      flag = true;
    }
  }
}

// Pressing board buttons
for (let first = 0; first < dimensions; first++) {
  for (let second = 0; second < dimensions; second++) {
    for (let third = 0; third < dimensions; third++) {
      for (let forth = 0; forth < dimensions; forth++) {
        buttons[`btn${first}${second}${third}${forth}`].addEventListener(
          "click",
          function (e) {
            playGame([`${third} ${forth} ${first} ${second}`]);
            rgbTableMovement(dimensions);
          },
          false
        );
      }
    }
  }
}

let onDublleclick = function (first, second) {
  document.querySelectorAll(".forms").forEach((e) => {
    singleClick = false;
    flagDubbleClick = false;
    clickedTableID = `mini-tables-${first}${second}`;
    e.style.cssText = "visibility: hidden";
    clickcount = 0;
  });
};

// Reseting the game
btnReset.addEventListener(
  "click",
  (e) => {
    e.preventDefault();
    formatButtons();
    createBoards(dimensions);
    mainBoardObject = { ...creatingMainBoard(dimensions) };
    mainBoard = mainBoardObject[`mainBoard`];
    // mainBoard = creatingMainBoard(dimensions);
    flag = false;
    flagNoWin = false;
    flagWins = false;
    i = -1;
  },
  false
);
