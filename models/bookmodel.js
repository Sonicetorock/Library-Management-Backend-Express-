const mongoose = require("mongoose");

// Book Schema
const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    genre: {
      type: String,
      required: true,
    },
    stock: { 
        type: Number, required: true, 
        min: 0 
    },
    borrowedBy: [{ 
        type: mongoose.Schema.Types.ObjectId,
        ref: "User" 
    }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Book", bookSchema);
