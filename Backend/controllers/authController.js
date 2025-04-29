const User = require("../models/User");
const Dietician = require("../models/Dietician");
const Admin = require("../models/Admin");

// @desc    Register a new user or dietitian
// @route   POST /api/auth/register
// @access  Public
exports.registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, confirmPassword, userType } =
      req.body;

    // Check if passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // Check which type of user to create
    if (userType === "dietitian") {
      // Check if dietician already exists
      const dieticianExists = await Dietician.findOne({ email });

      if (dieticianExists) {
        return res.status(400).json({ message: "Dietician already exists" });
      }

      // Create dietician
      const dietician = await Dietician.create({
        firstName,
        lastName,
        email,
        password,
      });

      if (dietician) {
        res.status(201).json({
          _id: dietician._id,
          firstName: dietician.firstName,
          lastName: dietician.lastName,
          email: dietician.email,
          role: "dietitian",
        });
      } else {
        res.status(400).json({ message: "Invalid dietician data" });
      }
    } else {
      // Check if user already exists
      const userExists = await User.findOne({ email });

      if (userExists) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Create user
      const user = await User.create({
        firstName,
        lastName,
        email,
        password,
      });

      if (user) {
        res.status(201).json({
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: "user",
        });
      } else {
        res.status(400).json({ message: "Invalid user data" });
      }
    }
  } catch (error) {
    console.error(error);

    // Improved error handling for validation errors
    if (error.name === "ValidationError") {
      const validationErrors = {};
      for (let field in error.errors) {
        validationErrors[field] = error.errors[field].message;
      }
      return res.status(400).json({
        message: "Validation failed",
        errors: validationErrors,
      });
    }

    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: "user",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Login dietitian
// @route   POST /api/auth/dietitian/login
// @access  Public
exports.loginDietitian = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find dietitian by email
    const dietitian = await Dietician.findOne({ email });

    if (!dietitian) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Check if password matches
    const isMatch = await dietitian.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.json({
      _id: dietitian._id,
      firstName: dietitian.firstName,
      lastName: dietitian.lastName,
      email: dietitian.email,
      role: "dietitian",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Login admin
// @route   POST /api/auth/admin/login
// @access  Public
exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find admin by email
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Check if password matches
    const isMatch = await admin.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.json({
      _id: admin._id,
      firstName: admin.firstName,
      lastName: admin.lastName,
      email: admin.email,
      adminLevel: admin.adminLevel,
      role: "admin",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get user by ID (for patient logs page)
// @route   GET /api/auth/user/:id
// @access  Public
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select(
      "firstName lastName email"
    );
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Create default admin if it doesn't exist
exports.createDefaultAdmin = async () => {
  try {
    const adminEmail = "admin@email.com";
    const adminExists = await Admin.findOne({ email: adminEmail });

    if (!adminExists) {
      await Admin.create({
        firstName: "Admin",
        lastName: "1",
        email: adminEmail,
        password: "admin123pasword",
        adminLevel: "superAdmin",
      });

      console.log("Default admin user created successfully");
    } else {
      console.log("Default admin user already exists");
    }
  } catch (error) {
    console.error("Error creating default admin user:", error);
  }
};
