const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// User Schema
const userSchema = new mongoose.Schema(
  {
    name: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    password: { 
        type: String, 
        required: true 
    },
    role: { 
        type: String, 
        enum: ["Reader", "Author"], 
        default: "Reader",
        required: true 
    },
    // only upto 5 books can be taken by a reader
    borrowedBooks: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Book" , 
        max: 5
    }], // Readers
    booksWritten: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Book" 
    }], // Authors
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("User", userSchema);
