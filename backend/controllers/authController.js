const bcrypt = require("bcrypt");
const generateToken = require("../utils/generateToken");

const {
  createUser,
  findUserByEmail,
  findUserByPhone
} = require("../models/userModel");

const registerUser = async (req, res) => {
  try {
    const { full_name, email, phone, password, date_of_birth, address } =
      req.body;

    // Check if email already exists
    const existingUser = await findUserByEmail(email);

    if (existingUser) {
      return res.status(400).json({
        message: "Email already exists"
      });
    }

    // Check if phone already exists
    const existingPhone = await findUserByPhone(phone);

    if (existingPhone) {
      return res.status(400).json({
        message: "Phone number already exists"
      });
    }

    // Encrypt password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user in database
    const user = await createUser(
      full_name,
      email,
      phone,
      hashedPassword,
      date_of_birth,
      address
    );

    res.status(201).json({
      message: "User Registered Successfully",
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        phone: user.phone
      }
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Registration Failed"
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await findUserByEmail(email);

    // Check user exists
    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    // Wrong Password
    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid password"
      });
    }

    // generate JWT Token
    const token = generateToken(user);

    // Login successful
    res.status(200).json({
      message: "Login Successful",
      token,
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Login Failed"
    });
  }
};

module.exports = {
  registerUser,
  loginUser
};
