// Para strings
const array = [ ..."Hola"]    // [ 'H', 'o', 'l', 'a' ]

/* En arrays */{
    const otherArray = [ ...array]   //[ 'H', 'o', 'l', 'a' ]
    // Copies of arrays are created as a memory reference. This means that every change we make in the copy of the array will instead, update the values of the original array.
    {
        const originalArray = [1,2,3,4,5]
        const copyArray = originalArray
        copyArray[0] = 0

        /* originalArray // [0,2,3,4,5] */
        /* originalArray === copyArray  // true */
    }

    /* How to copy arrays using the spread operator. */{
        const originalArray = [1,2,3,4,5]
        const copyArray = [...originalArray]
        copyArray[0] = 0

        /* originalArray // [1,2,3,4,5] */
        /* copyArray // [0,2,3,4,5] */
        /* originalArray === copyArray  // false */ 
    }

    /* How to join arrays and add elements using the spread operator */{
        const array1 = [1,2,3]
        const number = 4
        const array2 = [5,6,7]

        const otherArray = [ ...array1, number, ...array2 ]

        /* otherArray // [1,2,3,4,5,6,7] */
    }

    /* ⚠️ Spread operator will only copy the elements in the first deep level ⚠️ */{
        const originalArray = [1, [2,3] ,4,5]
        const copyArray = [...originalArray]
    
        /* originalArray[1] === copyArray[1] // true */ 
        
        /* But there is a new Function called "structuredClone" which allows to make in deep copies of the arrays. */
        /* In order to use structuresClone you will need to check browser support */{
            const originalArray = [1, [2,3] ,4,5]
            const copyArray = structuredClone(originalArray)

            /* originalArray === copyArray  // false */
            /* originalArray[1] === copyArray[1] // false */
        }

    }

}



