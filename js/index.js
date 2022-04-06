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
    isValid = false;

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

    toString(){
        let string = "";
        this.letters.forEach(letter => string+= letter.value);

        return string;
    }

    /*Check if a word is a real dictionary word 
    (Takes a query parameter called word which denotes the word to check) */    
    async checkIsValid(attempts){

        const options = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Host': 'wordle-creator-tools.p.rapidapi.com',
                'X-RapidAPI-Key': 'c5c5487ec6mshfa9eea1774ea84fp1b6491jsn97d7ea39604c'
            }
        };
        
        await fetch(`https://wordle-creator-tools.p.rapidapi.com/check-word?word=${this.toString()}`, options)
            .then(response => response.json())
            .then(response => {
                if(response.result === true){
                    console.log("The word entered was valid");
                    this.isValid = true;

                    let currAttemptRow = document.getElementById("attempt_" + attempts);
                    currAttemptRow.innerHTML = this.display();

                }else{
                    // inform user that entry is not valid word
                    console.log("The word entered was not valid");
                }
            })
            .catch(err => console.error(err));        
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
            this.submitGuess(input);
            input.value = "";
        }); 
    }

    submitGuess(input){
        if(input.value.length < 5){
            // inform user that they need to enter text with more than 5 characters
            console.log("Need at least 5 letters for each attempt");
            return false;
    
        }else{
            console.log("You inputted: " + input.value);    // DEBUG
    
            let guess = convertStringToLetterArray(input.value.split(''));
            let guessWordObj = new Word(guess);
    
            guessWordObj.checkIsValid(this.attempts)
            .then(()=>{
                    if(guessWordObj.isValid == true){
                        this.attempts++;
                    }
                }
            )
            .catch(err => console.log(err));
        }
    }
}

function  convertStringToLetterArray(stringArray){
    return stringArray.map((item)=> new Letter(item));
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