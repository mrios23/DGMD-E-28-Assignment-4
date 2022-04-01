window.onload = () =>{

    createGameBoard();

}

class Letter{
    value;

    constructor(value){
        this.value = value;
        this.display = () => `<div class="letterBox">${this.value}</div>`;
    }
}

class Word{
    letters = [];
    constructor(letters){
        this.letters = letters;
    }

    display(){
        let string = "";

        for(let i=0; i<this.letters.length; i++){
            string += this.letters[i].display();
        }
        return string;
    }
}

function createGameBoard(){
    const gameBoard = document.getElementById("game-board");

    for(let i=0; i<6; i++){
        // create word row div
        let row = document.createElement("div");
        row.setAttribute("class", "word");

        // create 5 "empty" letters per row
        let letters = [];
        for(let j=0; j<5; j++){
            let placeHolderLetter = new Letter("");
            letters.push(placeHolderLetter);
        }

        let word = new Word(letters);
        row.innerHTML = word.display();
        gameBoard.appendChild(row);
    }

    // create input box
    let input = document.createElement("input");
    input.setAttribute("id", "guess");
    input.setAttribute("type", "text");
    input.setAttribute("maxlength", "5");
    gameBoard.appendChild(input);

    // create submit btn
    let submit = document.createElement("button");
    submit.innerHTML = "Submit";
    gameBoard.appendChild(submit);

}