class User {
    constructor (name, surname, books, pets){
        this.name = name
        this.surname = surname
        this.books = books
        this.pets = pets
    }
    getFullName(){
        console.log(`Tu nombre es ${this.name} ${this.surname}`)
    }
    addPet(newPet){
        this.pets.push(newPet)
        console.log(this.pets)
    }
    countPets(){
        console.log(this.pets.length)
    }
    addBook(newTitle, newAuthor){
        this.books.push({title: newTitle, author: newAuthor})
        console.log(this.books)
    }
    getBookNames(){
        let allBookNames = this.books.map(a => a.title);
        console.log(allBookNames)
    }
}

const Leandro = new User ("Leandro", "Waserman", [{title: "El señor de los anillos", author: "JR Tolkien"},{title:"Harry Potter", author: "JK Rowling"}], ["Bart", "Homero", "Marge", "Lisa"    ])

Leandro.getFullName()
Leandro.addPet("Maggie")
Leandro.countPets()
Leandro.addBook("Rayuela", "Julio Cortazar")
Leandro.getBookNames()