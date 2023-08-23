/* ARRAYS. */ {
    const array = [ 1, 2, 3, 4, 5 ];

    /* You can access the firsts elements of the array by doing: */
    {
        const [uno, dos, tres ] = array;
        console.log(uno, dos, tres); /* 1 2 3 */
    }
    {
        /* If we only want to acces a certain possition we can also do: */
        const [,, tres, cuatro, cinco] = array;
        console.log(tres, cuatro, cinco); /* 3 4 5 */
    }
}



/*  FUNCTION RETURNS. */ {
    function updateValue(value){
        return [value, value ** 2];
    }

    /* Without Destructuring. */ {
        const state = updateValue(3);
        const value = state[0];
        const updatedValue = state[1];
        console.log(value, updatedValue);
    }

    /* With Destructuring. */ {
        const [value, updatedValue] = updateValue(3);
    }
}

/* OBJECTS. */ {
    var usuario = { nombre: "Andres", edad: 23, plataforma: "Platzi" };

    /* Without Destructuring */ {
        const nombre = usuario.nombre;
        const edad = usuario.edad;
        const plataforma = usuario["plataforma"];
        console.log(nombre, edad, plataforma);  // 'Andres' 23 'Platzi'    
    }
    
    /* With Destructuring */ {
    const { nombre, edad, plataforma } = usuario;
    console.log(nombre, edad, plataforma); // 'Andres' 23 'Platzi'
    }
}