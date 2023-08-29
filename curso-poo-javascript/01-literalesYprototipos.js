/*
    Esta sintaxis permite crear objetos 'únicos'. Es decir, si se quieren crear dos objetos parecidos al objeto 'natalia' se deberá duplicar
    el código comprendido entre las líneas [5, 15] y modificar los valores necesarios.
*/
const natalia = {
    name: "Natalia",
    age: 20,
    cursosAprobados: [
      "Curso Definitivo de HTML y CSS",
      "Curso Práctico de HTML y CSS",
    ],
    aprobarCurso(nuevoCursito) {
      this.cursosAprobados.push(nuevoCursito);
    },
  };
  

  /*
    Esta es la primera aproximación a la sintaxis de clases empleada en Java para crear objetos.
    La primera parte se destina a la creación de atributos y a la asignación de valores para los mismos.
    La segunda parte se destina a la creación de las funciones asociadas al atributo.
        En este apartado es importante distinguir las dos maneras en que se pueden añadir funciones a los objetos.
        1. this.aprobarCurso = function (nuevoCursito). => Como una función anidada dentro de la declaración del tipo de objeto Student.
        2. Student.prototype.aprobarCurso = function (nuevoCursito). => Como una función externa a la declaración anterior.
            Es importante entender que la declaración debe estar dentro del mismo fichero *.js que se cró la function Student.
  */
  function Student(name, age, cursosAprobados) {
    this.name = name;
    this.age = age;
    this.cursosAprobados = cursosAprobados;
    // this.aprobarCurso = function (nuevoCursito) {
    //   this.cursosAprobados.push(nuevoCursito);
    // }
  }
  Student.prototype.aprobarCurso = function (nuevoCursito) {
    this.cursosAprobados.push(nuevoCursito);
  }
  

  /*
    Instanciamiento de una entidad de tipo Student.
  */
  const juanita = new Student("Juanita Alejandra", 15, ["Curso de Introducción a la Producción de Videojuegos", "Curso de Creación de Personajes",]);
  
  