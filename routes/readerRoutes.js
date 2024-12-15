// routes/readerRoutes.js
const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const Book = require('../models/bookModel');
const User = require('../models/userModel');

const router = express.Router();

/*
    @desc Borrow a book
    @route POST /api/v1/reader/books/borrow
    @access Private - Reader only
    @takes bookId
    @returns success message and updated borrowed books list
 */
router.post('/books/borrow', authMiddleware, async (req, res) => {
  const { bookId } = req.body;

  if (req.user.role !== 'Reader') {
    return res.status(403).json({ error: 'Only readers can borrow books' });
  }

  try {
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    if (book.stock <= 0) {
      return res.status(400).json({ error: 'Book is out of stock' });
    }

    const reader = await User.findById(req.user.id);
    if (reader.borrowedBooks.length >= 5) {
      return res.status(400).json({ error: 'Borrowing limit exceeded (max 5 books)' });
    }

    // Add book to reader's borrowed list only if its the first time 
    if (!reader.borrowedBooks.includes(bookId)) {
        reader.borrowedBooks.push(bookId);
    }
    // add user to borrowedBy list of book only if its the first time
    if (!book.borrowedBy.includes(reader._id)) {
         book.borrowedBy.push(reader._id);
         book.stock -= 1;
    }

    await reader.save();
    await book.save();

    res.status(200).json({ 
      message: `Book borrowed successfully from ${ book.author }`, 
      borrowedBooks: reader.borrowedBooks 
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

/*
    @desc Return a book
    @route POST /api/v1/reader/books/return
    @access Private - Reader only
    @takes bookId
    @returns success message and updated borrowed books list
 */
router.post('/books/return', authMiddleware, async (req, res) => {
  const { bookId } = req.body;

  if (req.user.role !== 'Reader') {
    return res.status(403).json({ error: 'Only readers can return books' });
  }

  try {
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    const reader = await User.findById(req.user.id);
    if (!reader.borrowedBooks.includes(bookId)) {
      return res.status(400).json({ error: 'This book is not in your borrowed list' });
    }

    // Remove book from reader's borrowed list and increment stock 
    reader.borrowedBooks = reader.borrowedBooks.filter((id) => id.toString() !== bookId);
    //increase stock of book only if this reader exists in the list
    if (book.borrowedBy.includes(reader._id)) {
        book.borrowedBy = book.borrowedBy.filter((id) => id.toString() !== reader._id.toString());
        book.stock += 1;
    }

    await reader.save();
    await book.save();

    res.status(200).json({ 
      message: `Book returned successfully to ${ book.author }`, 
      borrowedBooks: reader.borrowedBooks 
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

/*
    @desc View borrowed books list of reader
    @route GET /api/v1/reader/books
    @access Private - Reader only
    @takes nothing
    @returns list of borrowed books
 */
router.get('/books', authMiddleware, async (req, res) => {
  if (req.user.role !== 'Reader') {
    return res.status(403).json({ error: 'Only readers can view borrowed books' });
  }

  try {
    const reader = await User.findById(req.user.id).populate('borrowedBooks', 'title author genre');
    if (!reader) {
      return res.status(404).json({ error: 'Reader not found' });
    }

    res.status(200).json({ borrowedBooks: reader.borrowedBooks });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
