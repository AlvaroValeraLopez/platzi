/* 
    Los modulos en JS permiten encapsular ficheros completo.
    Se pueden exportar elementos concretos de la clase, ya sean funciones, constantes...
    Para poder hacer uso de esta funcionalidad se emplean las palabras reservadas:
        export => Permite exportar los elementos deseados de los módulos.
        import => Permite importar los elementos exportados de otros módulos en el fichero.    
*/
export class PlatziClass {
  constructor({ name, videoID }) {
    this.name = name;
    this.videoID = videoID;
  }

  reproducir() {
    videoPlay(this.videoID);
  }

  pausar() {
    videoStop(this.videoID);
  }
}