window.onload = () =>{

    var game = new Game();
    game.createGameBoard();

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

class Game{
    attempts = 1;

    constructor(){}

    createGameBoard(){
        const gameBoard = document.getElementById("game-board");
    
        for(let i=0; i<6; i++){
            // create word row div
            let row = document.createElement("div");
            row.setAttribute("class", "word");
            row.setAttribute("id", `attempt_${i+1}`);
    
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
        var input = document.createElement("input");
        input.setAttribute("id", "guess");
        input.setAttribute("type", "text");
        input.setAttribute("maxlength", "5");
        gameBoard.appendChild(input);
    
        // create submit btn
        let submit = document.createElement("button");
        submit.setAttribute("id", "submitBtn");
        submit.innerHTML = "Submit";
        gameBoard.appendChild(submit);

        submit.addEventListener("click", () => {
            if(submitGuess(input, this.attempts)){
                this.attempts++;
            };
        }); 
    }
}

function  convertStringToLetterArray(stringArray){
    return stringArray.map((item)=> new Letter(item));
}

function submitGuess(input, attempts){

    if(input.value.length < 5){
        // inform user that they need to enter text with more than 5 characters
        console.log("Need at least 5 letters for each attempt");
        return false;

    }else{
        console.log("There was text in the input box");

        let guess = convertStringToLetterArray(input.value.split(''));  // may want to handle elsewhere
        console.log(guess);     // DEBUG

        let guessWordObj = new Word(guess);
        console.log(guessWordObj);  // DEBUG

        let currAttemptRow = document.getElementById("attempt_" + attempts);
        currAttemptRow.innerHTML = guessWordObj.display();
        input.value = "";

        return true;
    }
}

function createGameBoard(){
    const gameBoard = document.getElementById("game-board");

    for(let i=0; i<6; i++){
        // create word row div
        let row = document.createElement("div");
        row.setAttribute("class", "word");
        row.setAttribute("id", i);

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
    submit.setAttribute("id", "submitBtn");
    submit.innerHTML = "Submit";
    gameBoard.appendChild(submit);

}