const shipT = "ship";
const waterT = "water";

export const shipValues = {
    submarine : {
        name: "submarine",
        length: 4,
    },
    aircraft_carrier: {
        name: "aircraft_carrier",
        length: 5,
    },
    cruiser:  {
        name: "cruiser",
        length: 4,
    },
    motorboat: {
        name: "motorboat",
        length: 2,
    }
}

export const gameStates = {
    inGame: 'inGame',
    selectingShips: 'selectingShips',
    
}

export const rawValues = {
    vertical: 'vertical',
    horizontal: 'horizontal',
    unknown: 'unknown',
}