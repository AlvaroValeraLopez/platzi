/*
    Esta es la sintais standar para la declaración de clases en JS. Es la misma que se emplea en otros lenguajes de programación orientados a objetos.
*/
class Student{
    /* Método constructor de la case Student. */
    constructor(name, age, cursosAprobados){
        this.name = name;
        this.age = age;
        this.cursosAprobados = cursosAprobados;
    }

    /*
        Método constructor de la clase Student que recibe como parámetro un objeto con los valores de los atributos de la clase.
    */
    constructor({
        name,
        cursosAprobados = [],
        age,
        email,
    }) {
        this.name = name;
        this.email = email;
        this.age = age;
        this.cursosAprobados = cursosAprobados;
    }

    /* Declaración de funciones para la clase Student. */
    aprobarCurso(nuevoCursito){
        this.cursosAprobados.push(nuevoCursito);
    }
}

  
  /*
    Cuando se usa la sintaxis de objectos en el constructor de la clase, al instanciar objetos de la misma se deberá  crear un objeto cuyos atributos
    sean iguales a los definidos en la clase. Si el nombre de los atributos del objeto no es el mismo que el de la clase, no se asociarán correctamente.
  */
  const miguelito = new Student2({
    name: "Miguel",
    age: 28,
    email: "miguelito@platzi.com",
  });