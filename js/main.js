const letters = ['-', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

const boats = {
    'Carrier': 5,
    'Battleship': 4,
    'Cruiser': 3,
    'Submarine': 3,
    'Destroyer': 2
};

let grid = [];
let boatsGrid = [];
let fails = [];
let availableSlots = [];
let placing = 0;
let direction = 0;

$(document).ready(() => {
    // Build the grid
    buildGrid();

    // Generate grid and empty slots arrays
    for (let i = 1; i <= 10; i += 1) {
        for (let j = 1; j <= 10; j += 1) {
            grid.push('' + letters[i] + j);
            availableSlots.push('' + letters[i] + j);
        }
    }

    // console.log(availableSlots);

    // Place boats randomly
    placeBoatsRandom();

    console.log('Boats successfuly placed');

    showProbability();
});

/**
* Build the grid
*/
function buildGrid() {
    for (let i = 0; i <= 10; i += 1) {
        $('.grid#bot').append('<div class="row"></div>');
        $('.grid#user').append('<div class="row"></div>');
        for (let j = 0; j <= 10; j += 1) {
            if (j === 0) {
                $('.grid#bot .row').eq(i).append('<div class="cell locked" data-col="' + letters[j] + '" data-row="' + i + '" >' + i + '</div>');
                $('.grid#user .row').eq(i).append('<div class="cell locked" data-col="' + letters[j] + '" data-row="' + i + '" >' + i + '</div>');
            } else if (i === 0) {
                $('.grid#bot .row').eq(i).append('<div class="cell locked" data-col="' + letters[j] + '" data-row="' + i + '">' + letters[j] + '</div>');
                $('.grid#user .row').eq(i).append('<div class="cell locked" data-col="' + letters[j] + '" data-row="' + i + '">' + letters[j] + '</div>');
            } else {
                $('.grid#bot .row').eq(i).append('<div class="cell" data-col="' + letters[j] + '" data-row="' + i + '" ></div>');
                $('.grid#user .row').eq(i).append('<div class="cell" data-col="' + letters[j] + '" data-row="' + i + '" ></div>');
            }
        }
    }
}

/**
* Place a boat
* @param  {int} i index of boat to place
*/
function boatPlaceholder(i) {
    console.log('Placing', Object.keys(boats)[i], 'which has length', boats[Object.keys(boats)[i]]);
    placing = boats[Object.keys(boats)[i]];

    $('.cell').removeClass('available');

    $('.cell:not(.locked)').each((id, el) => {
        const $el = $(el);
        const row = parseInt($el.attr('data-row'));
        const col = parseInt($el.attr('data-col'));

        if (direction === 0 && col + placing <= 11) {
            $el.addClass('available');
        } else if (direction === 1 && row + placing <= 11) {
            $el.addClass('available');
        }
    });

    showPlaceholder(i);
}

function showPlaceholder(i, row, col, length) {
    $('.placing-boat').removeClass('placing-boat');

    if ($currentCell === undefined) {
        return false;
    }

    if (length !== 0 && $currentCell.hasClass('available')) {
        if (direction === 0) {
            for (let i = 0; i < length; i += 1) {
                const cell = $('.cell[data-row="' + row + '"][data-col="' + (col + i) + '"]')
                cell.addClass('placing-boat');
            }
        } else if (direction === 1) {
            for (let i = 0; i < length; i += 1) {
                const cell = $('.cell[data-row="' + (row + i) + '"][data-col="' + col + '"]')
                cell.addClass('placing-boat');
            }
        }
    }
}

// $(document).on('mouseenter', '.cell', (e) => {
//     $currentCell = $(e.currentTarget);
//
//     if ($currentCell.hasClass('locked')) {
//         return false;
//     }
//
//     const row = parseInt($currentCell.attr('data-row'));
//     const col = parseInt($currentCell.attr('data-col'));
//
//     boatPlaceholder(0, row, col);
// });

// $(document).on('keypress', (e) => {
//     if (e.which === 32) {
//         if (direction === 0) {
//             direction = 1;
//         } else if (direction === 1) {
//             direction = 0;
//         }
//
//         boatPlaceholder(0);
//     }
// });

$(document).on('click', '.grid#user .cell', (e) => {
    const $cell = $(e.currentTarget);
    const row = $cell.attr('data-row');
    const col = $cell.attr('data-col');

    const cellString = '' + col + row;

    if (boatsGrid.indexOf(cellString) > -1) {
        console.log('hit on', cellString);

    } else {
        console.log('missed on', cellString);
        fails.push(cellString);
        showProbability();
    }
});

/**
* Place all boats randomly
*/
function placeBoatsRandom() {
    for (let i = 0; i < Object.keys(boats).length; i += 1) {
        // Length depends on the boat to set
        const length = boats[Object.keys(boats)[i]];

        // Random coordinates and direction (horizontal or vertical)
        const row = Math.ceil(Math.random()*10);
        const col = Math.ceil(Math.random()*10);
        const direction = parseInt([0, 1][Math.round(Math.random())].toString());

        if (fitBoat(length, row, col, direction)) {
            // Set boat
            setBoat(fitBoat(length, row, col, direction));
        } else {
            // Rerun randomization
            i -= 1;
            continue;
        }
    }
}

/**
* /**
* Check if a boat can be set at precise coordinates
* @param  {int}           length        Length of boat to place (2 to 5)
* @param  {int}           row           Row to start at
* @param  {int}           col           Column to start at
* @param  {int}           direction     0 for horizontal, or 1 for vertical
* @param  {Boolean}       [guess=false] Should we consider placed boats?
* @return {Boolean|array}               Array if boat can be set, otherwise false
*/
function fitBoat(length, row, col, direction, guess = false) {
    // console.log('Trying to set boat of length', length, 'at', letters[col], row, (direction === 0 ? 'horizontally' : 'vertically'));

    // Array of strings
    let boatCells = [];

    // Can a boat be set here?
    let canSetBoat = true;

    for (let i = 0; i < length; i += 1) {
        // Convert coordinates to a string
        const cellString = '' + letters[(col + (i * (1 - direction)))] + (row + (i * direction));

        // Is this cell available?
        if (guess === false) {
            if (availableSlots.indexOf(cellString) > -1) {
                boatCells.push(cellString);
            } else {
                canSetBoat = false;
            }
        } else {
            // Does this cell exist?
            if (grid.indexOf(cellString) > -1) {
                // Is this cell a miss?
                if (fails.indexOf(cellString) === -1) {
                    boatCells.push(cellString);
                } else {
                    canSetBoat = false;
                }
            } else {
                canSetBoat = false;
            }
        }
    }

    if (canSetBoat) {
        return boatCells;
    } else {
        // Will rerun randomization
        return false;
    }
}

/**
* Fill a cell with a boat part
* @param {array} boatCells Array of strings (e.g ["A1", "A2", "A3"])
*/
function setBoat(boatCells) {

    for (let boatCell in boatCells) {
        // Convert string to coordinates
        let col = boatCells[boatCell][0];
        let row = parseInt(boatCells[boatCell][1] + boatCells[boatCell][2]);

        // Show cell as filled with a boat
        $('.grid#bot .cell[data-col="' + col + '"][data-row="' + row + '"]').addClass('boat');

        // Mark cell as filled with a boat
        boatsGrid.push(boatCells[boatCell]);

        // Mark cell and neighbours as unavailable
        markUnavailable(col, row);
    }
}

/**
* Mark a cell (and its 8 neighbours) as unavailable
* @param  {int} col Column of target cell
* @param  {int} row Row of target cell
*/
function markUnavailable(col, row) {
    for (let i = 0; i < 3; i += 1) {
        for (let j = 0; j < 3; j += 1) {
            let targetCol = letters[letters.indexOf(col) - 1 + i];
            let targetRow = row - 1 + j;

            // Convert coordinates to a string
            let cellString = '' + targetCol + targetRow;

            if (availableSlots.indexOf(cellString) > -1) {
                // Show cell as unavailable
                // $('.cell[data-col="' + targetCol + '"][data-row="' + targetRow + '"]').addClass('unavailable');

                // Mark cell as unavailable
                availableSlots.splice(availableSlots.indexOf(cellString), 1);
            }
        }
    }
}

function showProbability() {
    let probabilities = {};
    console.log(fails);

    for (let i = 1; i <= 10; i += 1) {
        for (let j = 1; j <= 10; j += 1) {
            probabilities[('' + letters[i] + j)] = 0;
        }
    }

    // For each boat
    for (let b = 0; b < Object.keys(boats).length; b += 1) {

        // For each cell
        for (let i = 1; i <= 10; i += 1) {
            for (let j = 1; j <= 10; j += 1) {

                let cellString = '' + letters[j] + i;

                for (o = 0; o <= 1; o += 1) {
                    // console.log(letters[j], i, fitBoat(boats[Object.keys(boats)[b]], j, i, o, false));

                    let canFit = fitBoat(boats[Object.keys(boats)[b]], j, i, o, true);

                    if (canFit) {
                        for (let i = 0; i < canFit.length; i += 1) {
                            probabilities[canFit[i]] += 1;
                        }
                    }
                }
            }
        }
    }

    for (let i = 0; i < Object.keys(probabilities).length; i += 1) {
        const prob = probabilities[Object.keys(probabilities)[i]];

        const col = Object.keys(probabilities)[i][0];
        const row = parseInt(Object.keys(probabilities)[i][1] + Object.keys(probabilities)[i][2]);

        const cell = $('.grid#user .cell[data-row="' + row + '"][data-col="' + col + '"]')

        cell.css('background-color', 'rgba(0, 0, 0, ' + (prob * 0.025) + ')').text(prob);
    }
}
