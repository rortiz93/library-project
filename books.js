const myLibrary = JSON.parse(window.localStorage.getItem("library"));

var libraryTable = document.querySelector("tbody");
const addBookDialog = document.querySelector("#add-book-dialog");
const addBookBtn = document.querySelector(".add-book");
const confirmBtn = document.querySelector("#confirmBtn");
const closeBtn = document.getElementById("closeDialog");
const modal = document.querySelector(".modal");
let activeRow;

addBookBtn.addEventListener("click", () => {
    modal.className = "modal active";
    let bookName = document.getElementById("book_name")
    let bookAuthor = document.getElementById("author")
    let bookPages = document.getElementById("pages")
    const readBox = document.querySelector('input[name="read"]');
    bookName.value = "";
    bookAuthor.value = "";
    bookPages.value = "";
    readBox.checked = false;
    addBookDialog.showModal();
  });

addBookDialog.addEventListener("close", (event) => {
    modal.className = "modal";
    let bookName = document.getElementById("book_name").value;
    let bookAuthor = document.getElementById("author").value;
    let bookPages = document.getElementById("pages").value;
    const readBox = document.querySelector('input[name="read"]');
    
    let selectedOption;
    console.log(readBox);
    if (readBox.checked)
    {
        selectedOption = "read"
    }else{
        selectedOption = "unread"
    }
    if (event.target.returnValue == "Submit"){
        
        const newBook = new Book(bookName, bookAuthor, bookPages, selectedOption);
        
        addBookToLibrary(newBook);
        console.log(myLibrary)
        localStorage.setItem("library", JSON.stringify(myLibrary));
        console.log(JSON.parse(localStorage.getItem('library')));
       
    }else if (event.target.returnValue == "Update"){
        const newBook = new Book(bookName, bookAuthor, bookPages, selectedOption);
        console.log(activeRow);
        myLibrary[activeRow-1] = newBook;
        localStorage.setItem("library", JSON.stringify(myLibrary));
        libraryTable.innerHTML = "";
        displayBooks();
        
    }
    
  
    
  });


function Book(title, author, pages, read){
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
    this.info = function(){
        return (this.title + " by " + this.author + ", " + this.pages + " pages," + (this.read?" read":" not read yet"))
    };
}

function addBookToLibrary(book,rowNum){

    myLibrary.push(book);
    libraryTable.innerHTML = "";
    displayBooks();
    

}

function addRowToTable(book, row){
   
    
    newRow = document.createElement("tr");
    newRow.className = "book-row"
    newRow.setAttribute('data-index', row)

    nameCell = document.createElement("td");
    nameCell.innerHTML= book.title;
    newRow.appendChild(nameCell);

    authorCell = document.createElement("td");
    authorCell.innerHTML = book.author;
    newRow.appendChild(authorCell);

    pagesCell = document.createElement("td");
    pagesCell.innerHTML = book.pages;
    newRow.appendChild(pagesCell);

    readCell = document.createElement("td");
    console.log(book.read);
    readCell.innerHTML = book.read == "read" ? "&#10003" : "";
    newRow.appendChild(readCell);

    editCell = document.createElement("td");
    var btn = document.createElement('input');
    btn.type = "button";
    btn.className = "editBtn material-symbols-outlined";
    btn.value = "edit";
    editCell.appendChild(btn);

    var deleteBtn = document.createElement('input');
    deleteBtn.type = "button";
    deleteBtn.className = "deleteBtn material-symbols-outlined";
    deleteBtn.value = "delete";

    editCell.appendChild(deleteBtn);

    newRow.appendChild(editCell);
    return newRow;

}

function displayBooks(){
    var i = 1;
    
    let test = JSON.parse(localStorage.getItem("library"));
    console.log(test)
    for (const book in myLibrary) {

        row = addRowToTable(myLibrary[book], i);
        libraryTable.appendChild(row);
        i++;
    }
    

  
   
}
function closeDialog(){
    event.preventDefault(); 
    addBookDialog.close(); 
  }
displayBooks();


libraryTable.addEventListener('click', (event) =>{
    
    if (event.target.className.includes('deleteBtn')){
        index = 1 - event.target.parentNode.parentNode.dataset.index;
        myLibrary.splice(index , 1);
        localStorage.setItem("library", JSON.stringify(myLibrary));
        let td = event.target.parentNode;
        let tr = td.parentNode;
        tr.parentNode.removeChild(tr);
    }else if (event.target.className.includes('editBtn')){
        activeRow = event.target.parentNode.parentNode.rowIndex;
        
        confirmBtn.value = "Update"
        let bookName = document.getElementById("book_name");
        let bookAuthor = document.getElementById("author");
        let bookPages = document.getElementById("pages");
        row = event.target.parentNode.parentNode;
        let title = row.cells[0];
        let author = row.cells[1];
        let pages = row.cells[2];
        

        addBookDialog.showModal();
        bookName.value = title.innerHTML;
        bookAuthor.value = author.innerHTML;
        bookPages.value = pages.innerHTML;

    }
        

    
});

