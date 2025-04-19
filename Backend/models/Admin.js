const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const adminSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "First name is required"],
  },
  lastName: {
    type: String,
    required: [true, "Last name is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      "Please enter a valid email",
    ],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: 6,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  // Admin-specific fields
  adminLevel: {
    type: String,
    enum: ["superAdmin", "moderator"],
    default: "moderator",
  },
  permissions: {
    manageUsers: { type: Boolean, default: true },
    manageDieticians: { type: Boolean, default: true },
    viewReports: { type: Boolean, default: true },
    systemSettings: { type: Boolean, default: false },
  },
  lastLogin: {
    type: Date,
  },
});

// Hash password before saving
adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare passwords
adminSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin;
