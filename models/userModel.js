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
    borrowedBooks: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Book" , 
        max : 5
    }], // For Readers
    booksWritten: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Book" 
    }], // For Authors
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
