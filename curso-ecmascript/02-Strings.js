var nombre = "Andres"
var edad = 23

// SINGLE-LINE OUTPUT.
// Concatenación pre-ES6.
var mensaje = "Mi nombre es " + nombre + " y tengo " + edad + " años."
console.log(mensaje) /* 'Mi nombre es Andres y tengo 23 años.' */

//Concatenación post-ES6.
var mensaje = `Mi nombre es ${nombre} y tengo ${edad} años.`
console.log(mensaje) /* 'Mi nombre es Andres y tengo 23 años.' */


// MULTI-LINE OUTPUT.
// Pre-ES6
var mensaje = "Línea 1 \n" + "línea 2"
console.log(mensaje)

// POST-ES6
const mensaje = `Línea 1
línea 2`
console.log(mensaje)