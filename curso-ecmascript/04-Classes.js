class User {

    constructor (name){
        this.name = name; 
    }

    getName(){
        return this.name;
    }

    setName(name){
        this.name = name;
    }

    speak(){
        return `Hello, I'm ${this.name}`;
    }
    
    greet(name){
        return `Hello ${name}`;
    }
}

const alvaro = new User('Alvaro');
console.log(alvaro.speak());
alvaro.setName('Francisco');
console.log(alvaro.speak());
console.log(alvaro.greet('Marta'));