class Banda {
    constructor({nombre, generos = []}) {
      this.nombre = nombre;
      this.generos = generos;
      this.integrantes = [];
    }
  
    agregarIntegrante(integranteNuevo) {
      
      if (integranteNuevo.getInstrumento() === "Bateria") {
        for (let i = 0; i < this.integrantes.length; i++){
          if (this.integrantes[i].getInstrumento() === "Bateria")
            return false;
        }
      } 
      this.integrantes.push(integranteNuevo);
      return true;
  
    }
  }
  
  //Crear clase Integrante
  class Integrante {
    constructor({nombre, instrumento}) {
      this.nombre = nombre;
      this.instrumento = instrumento;
    }
  
    getInstrumento() {
      return this.instrumento;
    }
  }
  
  
  export {
    Banda,
    Integrante,
  }
  