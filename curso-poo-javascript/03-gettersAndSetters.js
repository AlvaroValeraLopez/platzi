/*
    Cuando se trabaja con clases y objetos es de vital importancia el uso del encapsulamiento para evitar que los valores de ciertos
    atributos puedan verse modificados desde lugares en los que no deberían. Para ello se usan los atributos privados y los getters and setters.
*/
class Student{
    /* 
        Todos aquellos atributos que tengan el numeral '#' al inicio de su declaración serán considerados como atributos privados
        y no podrán ser accedidos fuera de la clase en la que fueron declarados.
    */
    constructor(name, age, cursosAprobados){
        this.#name = name;
        this.#age = age;
        this.#cursosAprobados = cursosAprobados;
    }

    constructor({name, cursosAprobados = [], age, email}) {
        this.#name = name;
        this.#email = email;
        this.#age = age;
        this.#cursosAprobados = cursosAprobados;
    }

    /* Función especial get. */
    get name(){
        return this.name;
    }

    /* Función espcial set. */
    set name(newName){
        this.name = newName;
    }
}