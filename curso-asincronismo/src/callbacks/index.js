const XMLHttpRequest = require('xmlhttprequest');
const API = 'https://api.escuelajs.co/api/v1';

function fetchData(urlApi, callback){
    
    let xhttp = new XMLHttpRequest();

    xhttp.open('GET', urlApi, true); /* Se abre una conexión con nuestra API. */
    xhttp.onreadystatechange = function(event){ /* Permite conocer el estado de la conexión que se ha abierto. */
        /* 
            0. => No se ha inicializado la conexión.
            1. => Cargando. Aún no se ha llamado el valor de send.
            2. => Ya se ejecutó el valor de send.
            3. => Interactuando con la solicitud.
            4. => Se ha completado la llamada.
        */
        if(xhttp.readyState !== 4)
            return callback(new Error('Error' + urlApi), null);
        
        if(XMLHttpRequestUpload.status === 200)
            callback(null, JSON.parse(xhttp.responseText));
    }
    xhttp.send();
}