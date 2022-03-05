const incompleteBookshelfList = [];
const RENDER_EVENT = 'render-book';
document.addEventListener('DOMContentLoaded', function () {
  const submitBook = document.getElementById('inputBook');
  submitBook.addEventListener('submit', function (event) {
    event.preventDefault();
    addBook();
  });
  if (isStorageExist()) {
    loadDataFromStorage();
  }
});
function addBook() {
  const textBook = document.getElementById('inputBookTitle').value;
  const textAuthor = document.getElementById('inputBookAuthor').value;
  const timestamp = document.getElementById('inputBookYear').value;
  const checkButtonFinished = document.getElementById('inputBookIsComplete').checked;

  const generatedID = generatedId();
  const bookObject = generatedBookObject(generatedID, textBook, textAuthor, timestamp, checkButtonFinished, false);
  incompleteBookshelfList.push(bookObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveBook();
}
function generatedId() {
  return +new Date();
}
function generatedBookObject(id, title, author, year, isCompleted) {
  return {
    id,
    title,
    author,
    year,
    isCompleted,
  };
}
document.addEventListener(RENDER_EVENT, function () {
  const uncompletedBOOKList = document.getElementById('incompleteBookshelfList');
  uncompletedBOOKList.innerHTML = '';

  const completedBOOKList = document.getElementById('completeBookshelfList');
  completedBOOKList.innerHTML = '';

  for (bookItem of incompleteBookshelfList) {
    const bookElement = makeBook(bookItem);
    uncompletedBOOKList.append(bookElement);
    if (bookItem.isCompleted == false) uncompletedBOOKList.append(bookElement);
    else completedBOOKList.append(bookElement);
  }
});
function makeBook(bookObject) {
  const textTitle = document.createElement('h2');
  textTitle.innerText = bookObject.title;

  const textPenulis = document.createElement('h3');
  textPenulis.innerText = bookObject.author;

  const textTimestamp = document.createElement('p');
  textTimestamp.innerText = bookObject.year;

  const textBookShelf = document.createElement('div');
  textBookShelf.classList.add('inner');
  textBookShelf.append(textTitle, textPenulis, textTimestamp);

  const book_shelf = document.createElement('div');
  book_shelf.classList.add('input_section', 'book_shelf');
  book_shelf.append(textBookShelf);
  book_shelf.setAttribute('id', `book-${bookObject.id}`);

  if (bookObject.isCompleted) {
    const undoButton = document.createElement('button');
    undoButton.classList.add('undo-button');
    undoButton.addEventListener('click', function () {
      undoTaskFromCompleted(bookObject.id);
    });
    const trashButton = document.createElement('button');
    trashButton.classList.add('trash-button');
    trashButton.addEventListener('click', function () {
      removeTaskFromCompleted(bookObject.id);
      // localStorage.removeItem(STORAGE_KEY);
    });
    book_shelf.append(undoButton, trashButton);
  } else {
    const checkButton = document.createElement('button');
    checkButton.classList.add('check-button');
    checkButton.addEventListener('click', function () {
      addTaskToCompleted(bookObject.id);
    });
    const trashButton = document.createElement('button');
    trashButton.classList.add('trash-button');
    trashButton.addEventListener('click', function () {
      removeTaskFromCompleted(bookObject.id);
      // localStorage.removeItem(STORAGE_KEY);
    });
    book_shelf.append(checkButton, trashButton);
  }
  return book_shelf;
}
function addTaskToCompleted(bookId) {
  const bookTarget = findBook(bookId);
  if (bookTarget == null) return;

  bookTarget.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveBook();
}
function findBook(bookId) {
  for (bookItem of incompleteBookshelfList) {
    if (bookItem.id === bookId) {
      return bookItem;
    }
  }
  return null;
}
function removeTaskFromCompleted(bookId) {
  let reason = prompt('Tuliskan alasan kenapa menghapusnya?');
  alert('Anda menghapusnya dengan alasan' + ' ' + reason + '!');
  const bookTarget = findBookIndex(bookId);
  if (bookTarget === -1) return;
  incompleteBookshelfList.splice(bookTarget, 1);
  localStorage.removeItem(STORAGE_KEY);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveBook();
}
function undoTaskFromCompleted(bookId) {
  const bookTarget = findBook(bookId);
  if (bookTarget == null) return;

  bookTarget.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveBook();
}
function findBookIndex(bookId) {
  for (index in incompleteBookshelfList) {
    if (incompleteBookshelfList[index].id === bookId) {
      return index;
    }
  }
  return -1;
}
function saveBook() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(incompleteBookshelfList);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}
const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'BOOK_SHELF';

function isStorageExist() {
  if (typeof Storage === undefined) {
    alert('Sorry, local storage unsupported!');
    return false;
  }
  return true;
}
document.addEventListener(SAVED_EVENT, function () {
  console.log(localStorage.getItem(STORAGE_KEY));
});
function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);

  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (book of data) {
      incompleteBookshelfList.push(book);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}
const searchList = document.querySelector('#searchBookTitle');
searchList.addEventListener('keyup', searchBook);

function searchBook(bookItem) {
  const searchList = bookItem.target.value.toLowerCase();
  let bookList = document.querySelectorAll('.book_list');
  bookList.forEach((item) => {
    const valueItem = item.textContent.toLocaleLowerCase();
    if (valueItem.indexOf(searchList) != -1) {
      item.setAttribute('style', 'display: block;');
    } else {
      item.setAttribute('style', 'display: none !important;');
    }
  });
}
