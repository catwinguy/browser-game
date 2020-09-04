/* Level generation based on the drunkard walk algorithm. */


function randint(a, b){
    // https://www.w3schools.com/js/js_random.asp
    return Math.floor(Math.random() * (b+1-a)) + a;
}

let ROWS = 36;
let COLS = 50;
let HALF_ROWS = Math.floor(ROWS / 2);
let HALF_COLS = Math.floor(COLS / 2);

let NUM_BLOCKS = 700;  // change me to change max num blocks
let PLATFORM = "x";
let AIR = ".";
let EMERALD = "o";
let DIAMOND = "0";
let DOOR = "d";
let PLAYER_START = "p";

let NORTH = 1;
let SOUTH = 2;
let EAST = 3;
let WEST = 4;

let numStuck = 0;
let badMap = false;

function validInnerRow(i){
    /* Returns whether i is a valid inner row on the map. */
    return 1 < i && i < (ROWS - 1)
}

function validInnerCol(j){
    /* Returns whether j is a valid inner column on the map. */
    return j > 1 && j < (COLS-1)
}


function createEmptyMap(){
    /* Create an empty map of air with size ROWS x COLS. */
    myMap = [];
    for (let i=0; i<ROWS; i++){
        myMap.push([]);
        for (let j=0; j<COLS; j++){
            myMap[i].push(AIR);
        }
    }
    return myMap;
}

function printMap(arr){
    /* Print out the map array in a readable fashion. */
    for (let i=0; i<ROWS; i++){
        console.log(arr[i].join(" "));
    }
}

function north(r, c){
    /* Get a coordinate (r,c) north of the one given. */
    if (r > 0){
        temp = randint(2, 5);  // number of blocks to move
        if (r > temp + 1){
            return [r - temp, c];
        }
        return [r - 1, c];
    }
    numStuck++;
    return [r, c];
}

function south(r, c){
    /* Get a coordinate (r,c) south of the one given. */
    if (r < ROWS - 1){
        temp = randint(2, 5);  // number of blocks to move
        if (r < (ROWS - (1 + temp))){
            return [r + temp, c];
        }
        return [r + 1, c];
    }
    numStuck++;
    return [r, c];
}

function east(r, c){
    /* Get a coordinate (r,c) east of the one given. */
    if (c > 0){
        temp = randint(1, 4);  // number of blocks to move
        if (c > temp + 1){
            return [r, c-temp];
        }
        return [r, c-1];
    }
    numStuck++;
    return [r, c];
}

function west(r, c){
    /* Get a coordinate (r,c) west of the one given. */
    if (c < COLS - 1){
        temp = randint(1, 4);  // number of blocks to move
        if (c < (COLS - (1 + temp))){
            return [r, c+temp];
        }
        return [r, c+1]
    }
    numStuck++;
    return [r, c];
}

function populateMap(myMap){
    /* Fill in the empty map with up to NUM_BLOCKS platform blocks. */
    let startingRows = [
        randint(0, HALF_ROWS),
        randint(0, HALF_ROWS),
        randint(HALF_ROWS, (ROWS-1)),
        randint(HALF_ROWS, (ROWS-1)),
    ];
    let startingCols = [
        randint(0, HALF_COLS),
        randint(0, HALF_COLS),
        randint(HALF_COLS, (COLS-1)),
        randint(HALF_COLS, (COLS-1)),
    ];

    let row = startingRows[0];
    let col = startingCols[0];
    let prevRow = 0;
    let prevCol = 0;
    let newCoords = [row, col];

    for (let i=0; i<=NUM_BLOCKS; i++){
        if (validInnerCol(col) && validInnerRow(row)){
            // if too many surrounding platforms nearby, decrease chances of new platform
            let count = 0;
            for (let m=row-1; m<row+1; m++){
                for (let n=col-1; n<col+1; n++){
                    if (myMap[m][n] == PLATFORM){
                        count++;
                    }
                }
            }
            if (randint(0, 3) == count){
                myMap[row][col] = PLATFORM;
            }
        }

        if (numStuck == 4){
            // stuck too many times, go back a step
            row = prevRow;
            col = prevCol;
            numStuck = 0;
        }

        x = randint(1, 4);  // choose random  direction
        switch(x){
            case NORTH:
                newCoords = north(row, col);
                break;
            case SOUTH:
                newCoords = south(row, col);
                break;
            case EAST:
                newCoords = east(row, col);
                break;
            case WEST:
                newCoords = west(row, col);
                break;
            default:
                newCoords = [row, col];
        }
        if (newCoords[0] != row){
            prevRow = row;
            row = newCoords[0];
        }
        if (newCoords[1] != col){
            prevCol =  col;
            col = newCoords[1];
        }

        if (i == Math.floor(NUM_BLOCKS / 4)){
            row = startingRows[1];
            col = startingCols[1];
        } else if (i == Math.floor(NUM_BLOCKS / 4) * 2){
            row = startingRows[2];
            col = startingCols[2];
        } else if (i == Math.floor(NUM_BLOCKS / 4) * 3){
            row = startingRows[3];
            col = startingCols[3];
        }

    }
   
    return myMap;
}

function cleanUp(myMap){
    /* Make the randomly generated map more playable. */
    for (let i=0; i<myMap.length; i++){
        for (let j=0; j<myMap[i].length; j++){
            if (myMap[i][j] == AIR){
                if (validInnerCol(j) && myMap[i][j-1] == PLATFORM && myMap[i][j+1] == PLATFORM){
                    // left and right are platforms -> fill in gap
                    if (randint(0,1)){  // 50% chance
                        myMap[i][j] = PLATFORM;
                    }
                }
                if (validInnerRow(i) && myMap[i-1][j] == PLATFORM && myMap[i+1][j] == PLATFORM){
                    // above and below are platforms. 1 block space is inaccessible
                    if (randint(0,1)){  // 50% chance
                        myMap[i][j] = PLATFORM;
                    } else {
                        myMap[i+1][j] = AIR;
                    }
                }
                if (validInnerRow(i) && validInnerCol(j) && myMap[i+1][j] == PLATFORM && myMap[i-1][j-1] == PLATFORM){
                    // below and upper left are platforms, can't fit through gap
                    if (randint(0,1)){  // 50% chance
                        myMap[i+1][j] = AIR;
                    } else {
                        myMap[i-1][j-1] = AIR;
                    }
                }
                if (validInnerRow(i) && validInnerCol(j) && myMap[i+1][j] == PLATFORM && myMap[i-1][j+1] == PLATFORM){
                    // below and upper right are platforms, can't fit through gap
                    if (randint(0,1)){  // 50% chance
                        myMap[i+1][j] = AIR;
                    } else {
                        myMap[i-1][j+1] = AIR;
                    }
                }
            } else {
                if (i <= 1){
                    // make sure there's a two block gap at top of map
                    myMap[i][j] = AIR;
                }
                if (i <= 4 && j <= 7){
                    // make sure there's a cutout for the timer
                    myMap[i][j] = AIR;
                }
                if (validInnerCol(j) && validInnerRow(i) &&
                    myMap[i][j-1] == AIR && myMap[i][j+1] == AIR &&
                    myMap[i-1][j] == AIR &&  myMap[i+1][j] == AIR){
                    // single floating block surrounded by air -> either add to the platform horizontally or remove
                    if (randint(0,1)){  // 50% chance
                        let temp = randint(0,2);  // 33% chance
                        switch(temp){
                            case 0:
                                myMap[i][j-1] = PLATFORM;
                                break;
                            case 1:
                                myMap[i][j+1] = PLATFORM;
                                break;
                            default:
                                myMap[i][j-1] = PLATFORM;
                                myMap[i][j+1] = PLATFORM;
                        }
                    } else {
                        myMap[i][j] = AIR;
                    }
                }

            }
        }
    }
    return myMap;
}

function addExitDoor(myMap){
    /* Add door to exit level on bottom right corner. */
    for(let i=ROWS-1; i>HALF_ROWS; i--){
        for (let j=COLS-1; j>HALF_COLS; j--){
            if (myMap[i][j] == PLATFORM && myMap[i][j-1] == PLATFORM &&
                myMap[i-1][j] == AIR && myMap[i-1][j-1] == AIR &&
                myMap[i-2][j] == AIR && myMap[i-2][j] == AIR){
                    // two wide platform with two blocks of air above
                    myMap[i-1][j] = DOOR;
                    myMap[i-2][j] = DOOR;
                    return myMap;
                }
        }
    }
    badMap = true;  // nowhere to exit level
    return myMap;
}

function addPlayerStart(myMap){
    /* Add place for player to start. */
    for(let i=2; i<HALF_ROWS; i++){
        for (let j=1; j<HALF_COLS; j++){
            if (myMap[i][j] == PLATFORM && myMap[i][j-1] == PLATFORM &&
                myMap[i-1][j] == AIR && myMap[i-1][j-1] == AIR &&
                myMap[i-2][j] == AIR && myMap[i-2][j] == AIR){
                    // two wide platform with two blocks of air above
                    myMap[i-1][j] = PLAYER_START;
                    myMap[i-2][j] = PLAYER_START;
                    return myMap;
                }
        }
    }
    badMap = true;  // nowhere to start player
    return myMap;
}

function addCoins(myMap){
    /* Add coins to the level. */
    for (let i=0; i<myMap.length; i++){
        for (let j=0; j<myMap[i].length; j++){
            if (myMap[i][j] == PLATFORM && validInnerRow(i) && myMap[i-1][j] == AIR){
                if (randint(1, 10) == 1){  // 10% chance
                    if (randint(1, 5) == 1){  // 20% chance
                        myMap[i-1][j] = DIAMOND;
                    } else{
                        myMap[i-1][j] = EMERALD;
                    }
                }
                
            }
        }
    }
    return myMap;
}

function makeGround(){
    let gnd = [];
    for (let i=0; i<COLS; i++){
        if (randint(1,4) === 1){  // 25% chance
            gnd.push(AIR);
        } else {
            gnd.push(PLATFORM);
        }
    }
    return gnd;
}

function createMap(){
    let m = createEmptyMap();
    m = populateMap(m);
    m = cleanUp(m);
    m = cleanUp(m);  // make sure nothing was missed the first time
    m = addPlayerStart(m);
    m = addExitDoor(m);
    m = addCoins(m);
    return m;
}

function convertMapToCoords(myMap){
    /* Convert the map array into JSON for the game. */
    while (badMap){
        // if the map was generated bad, try again
        // console.log("fixing bad map.")
        badMap = false;
        myMap = createMap();
    }

    let myGnd = makeGround();

    let json = {
        backgroundImage: "village_background",
        ground: [],
        platforms: [],
        playerStart: {},
        coins: [],
        doors: []
    };

    let x;
    let y;

    for (let i=0; i<myMap.length; i++){
        for (let j=0; j<myMap[i].length; j++){
            x = j*16 + 8;
            y = i*16 + 8;
            switch(myMap[i][j]){
                case PLATFORM:
                    if (validInnerRow(i) && myMap[i-1][j] != PLATFORM){
                        json["platforms"].push({"image": "grass_block", "x": x, "y": y});
                    } else {
                        json["platforms"].push({"image": "dirt_block", "x": x, "y": y});
                    }
                    break;
                case EMERALD:
                    json["coins"].push({"image": "emerald", "x": x, "y": y});
                    break;
                case DIAMOND:
                    json["coins"].push({"image": "diamond", "x": x, "y": y});
                    break;
                case DOOR:
                    if (myMap[i-1][j] == DOOR){
                        json["doors"].push({"image": "door_left", "x": x, "y": y-8});
                    }
                    break;
                case PLAYER_START:
                    if (validInnerRow(i) && myMap[i-1][j] == PLAYER_START){
                        json["playerStart"]["x"] = x;
                        json["playerStart"]["y"] = y-8;
                    } else if (myMap[i+1][j] == PLAYER_START){
                        json["playerStart"]["x"] = x;
                        json["playerStart"]["y"] = y+8;
                    }
                    break;
            }
        }
    }
    for (let i=0; i<myGnd.length; i++){
        if (myGnd[i] === PLATFORM){
            json["ground"].push({"image": "grass_block", "x": i*16 + 8, "y": 600});
        }
    }
    return json;
}
