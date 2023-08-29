class Banda {
    constructor({nombre, generos = []}) {
      this.nombre = nombre;
      this.generos = generos;
      this.integrantes = [];
    }
  
    agregarIntegrante(integranteNuevo) {
      
      if (this.integrantes.every(integrante => integrante.instrumento !== 'Bateria'))
        this.integrantes.push(integranteNuevo);
  
    }
  }
  
  //Crear clase Integrante
  class Integrante {
    constructor({nombre, instrumento}) {
      this.nombre = nombre;
      this.instrumento = instrumento;
    }
  }
  
  
  export {
    Banda,
    Integrante,
  }
  