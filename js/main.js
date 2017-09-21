$(document).ready(() => {
    // Build the grid
    buildGrid();
});

/**
* Build the grid
*/
function buildGrid() {
    const letters = ['-', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'];

    for (let i = 0; i <= 10; i += 1) {
        $('.grid').append('<div class="row"></div>');
        for (let j = 0; j <= 10; j += 1) {
            if (j === 0) {
                $('.row').eq(i).append('<div class="cell locked" data-row="' + i + '" data-col="' + j + '">' + i + '</div>');
            } else if (i === 0) {
                $('.row').eq(i).append('<div class="cell locked" data-row="' + i + '" data-col="' + j + '">' + letters[j] + '</div>');
            } else {
                $('.row').eq(i).append('<div class="cell" data-row="' + i + '" data-col="' + j + '"></div>');

            }
        }
    }
}
