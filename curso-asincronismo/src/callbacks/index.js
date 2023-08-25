/**
 * A callback function is a function passed into another function as an argument,
 * which is then invoked inside the outer function to complete some kind of routine or action.
 */



/**
 * 
 * @param {*} x The first number to be added.
 * @param {*} y The second number to be added.
 * @returns The result of adding x + y.
 */
function sum(x, y){
    return x + y;
}


/**
 * 
 * @param {*} x The first number.
 * @param {*} y The second number.
 * @param {*} callback The function to be executed with those numbers.
 * @returns The result of opperating x and y with the callback function.
 */
function calc(x, y, callback){
    return callback(x, y);
}



console.log(calc(3, 4, sum));