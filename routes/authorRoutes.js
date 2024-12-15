const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const allowAuthorOnly = require('../middlewares/authorOnlyMW');
const Book = require('../models/bookModel');
const User = require('../models/userModel');

const router = express.Router();

/*
    @desc endpoint for creating a book
    @route POST /api/v1/author/books/create
    @access Private - Author only
    @takes title, genre, stock
    @returns created book
 */
router.post('/books/create', authMiddleware, allowAuthorOnly, async (req, res) => {
  const { title, genre, stock } = req.body;

  try {
    const newBook = new Book({
      title,
      genre,
      stock,
      author: req.user.id,
    });

    await newBook.save();

    // Add the book to the author's list of written books
    const author = await User.findById(req.user.id);
    author.booksWritten.push(newBook._id);
    await author.save();

    res.status(201).json({ message: 'Book created successfully', book: newBook });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

/*
@desc endpoint for fetching all books written by the author
@route GET /api/v1/author/books
@access Private - Author only
@takes nothing
@returns list of books with borrow status
*/
router.get('/books', authMiddleware, allowAuthorOnly, async (req, res) => {
    try {
    const books = await Book.find({ author: req.user.id }).populate('borrowedBy', 'name email');

    res.status(200).json({ books });
} catch (error) {
    res.status(500).json({ error: 'Internal server error' });
}
});



/*
@desc endpoint for deleting a book
@route DELETE /api/v1/author/books/delete
@access Private - Author only
@takes bookId
@returns success message
*/
router.delete('/books/delete', authMiddleware, allowAuthorOnly, async (req, res) => {
    const { bookId } = req.body;
    console.log("called delete book");
    console.log(bookId, req.user.id);
    try {
        const book = await Book.findOne({ _id: bookId, author: req.user.id });
        if (!book) {
        return res.status(404).json({ error: 'Book not found or not owned by you' });
    }
    //use delerte one method to delete this book
    await Book.deleteOne({ _id: bookId });
    // Remove the book from the author's list of written books
    const author = await User.findById(req.user.id);
    author.booksWritten = author.booksWritten.filter((id) => id.toString() !== bookId);
    await author.save();
    
    res.status(200).json({ book, message: 'Above Book deleted successfully' });
} catch (error) {
    res.status(500).json({ error: 'Internal server error' });
}
});

/*
@desc endpoint for updating a book
@route PUT /api/v1/author/books/update
@access Private - Author only
@takes bookId, updated details (title, genre, stock)
@returns updated book
*/
router.put('/books/update', authMiddleware, allowAuthorOnly, async (req, res) => {
    const { bookId, title, genre, stock } = req.body;
    
    try {
        const book = await Book.findOne({ _id: bookId, author: req.user.id });
        //inedpendent copy not by refernce the fetched book to oldbook to send as response
        const oldBook = JSON.parse(JSON.stringify(book));
        if (!book) {
      return res.status(404).json({ error: 'Book not found or not owned by you' });
    }

    if (title) book.title = title;
    if (genre) book.genre = genre;
    if (stock) book.stock = stock;
    
    await book.save();
    
    res.status(200).json({ message: 'Book updated successfully',oldBook, book });
} catch (error) {
    res.status(500).json({ error: 'Internal server error' });
}
});

module.exports = router;
