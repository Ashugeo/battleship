const letters = ['-', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

const boats = {
    'Carrier': 5,
    'Battleship': 4,
    'Cruiser': 3,
    'Submarine': 3,
    'Destroyer': 2
};

let availableSlots = [];
let placing = 0;
let direction = 0;

$(document).ready(() => {
    // Build the grid
    buildGrid();

    // Generate empty slots array
    for (let i = 1; i <= 10; i += 1) {
        for (let j = 1; j <= 10; j += 1) {
            availableSlots.push('' + letters[i] + j);
        }
    }

    // console.log(availableSlots);

    // Place boats randomly
    placeBoatsRandom();
});

/**
* Build the grid
*/
function buildGrid() {
    for (let i = 0; i <= 10; i += 1) {
        $('.grid').append('<div class="row"></div>');
        for (let j = 0; j <= 10; j += 1) {
            if (j === 0) {
                $('.row').eq(i).append('<div class="cell locked" data-col="' + letters[j] + '" data-row="' + i + '" >' + i + '</div>');
            } else if (i === 0) {
                $('.row').eq(i).append('<div class="cell locked" data-col="' + letters[j] + '" data-row="' + i + '">' + letters[j] + '</div>');
            } else {
                $('.row').eq(i).append('<div class="cell" data-col="' + letters[j] + '" data-row="' + i + '" ></div>');
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

function showPlaceholder(i, row, col) {
    $('.placing-boat').removeClass('placing-boat');

    if ($currentCell === undefined) {
        return false;
    }

    if (placing !== 0 && $currentCell.hasClass('available')) {
        if (direction === 0) {
            for (let i = 0; i < placing; i += 1) {
                const cell = $('.cell[data-row="' + row + '"][data-col="' + (col + i) + '"]')
                cell.addClass('placing-boat');
            }
        } else if (direction === 1) {
            for (let i = 0; i < placing; i += 1) {
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

        if (!fitBoat(length, row, col, direction)) {
            // Rerun randomization
            i -= 1;
            continue;
        }
    }
}

/**
* Check if a boat can be set at precise coordinates
* @param  {int} length     Length of boat to place (2 to 5)
* @param  {int} row        Row to start at
* @param  {int} col        Column to start at
* @param  {int} direction  0 for horizontal, or 1 for vertical
* @return {bool}           True (this boat can be set here) or false
*/
function fitBoat(length, row, col, direction) {
    // Array of strings
    let boatCells = [];

    // Can a boat be set here?
    let canSetBoat = true;

    for (let i = 0; i < length; i += 1) {
        // Convert coordinates to a string
        const cellString = '' + letters[(col + (i * (1 - direction)))] + (row + (i * direction));

        // Is this cell available?
        if (availableSlots.indexOf(cellString) > -1) {
            boatCells.push(cellString);
        } else {
            canSetBoat = false;
        }
    }

    if (canSetBoat) {
        // Set boat
        setBoat(boatCells);
        return true;
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
        $('.cell[data-col="' + col + '"][data-row="' + row + '"]').addClass('boat');

        // Mark cell (and neighbours) as unavailable
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
            cellString = '' + targetCol + targetRow;

            if (availableSlots.indexOf(cellString) > -1) {
                // Show cell as unavailable
                // $('.cell[data-col="' + targetCol + '"][data-row="' + targetRow + '"]').addClass('unavailable');

                // Mark cell as unavailable
                availableSlots.splice(availableSlots.indexOf(cellString), 1);
            }
        }
    }
}
