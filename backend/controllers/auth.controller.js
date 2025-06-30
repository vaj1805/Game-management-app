import User from "../models/user.model.js"
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import Owner from '../models/owner.model.js';

export function showAdmin(req,res) {
    res.render("auth/adminlogin" , {
      error : null,
      formData : {email : "" , role : "Admin"}
    })
}

export async function adminLogin(req,res,next) {
    const {email , password} = req.body;
    try {
        if(email === "admin@gmail.com" && password === "admin123") {
            return res.render("dashboard/admin" , {user : "admin"})
        } else {
          return res.status(404).render("error" , {error : "Wrong credentials"});
        }
    } catch(error) {
      next(error);
    }
}

export function showRegister(req, res) {
  res.render("auth/register", {
    error: null,
    formData: { name: "", email: "", role: "Player" }
  });
}

export async function register(req, res, next) {
  try {
    const { name, email, password, confirmPassword, role, phoneNum, city } = req.body;

    console.log('Registration attempt:', { name, email, role, city });

    // Validation
    if (!name || !email || !password || !confirmPassword || !role || !city) {
      return res.status(400).render("auth/register", { 
        error: "All required fields must be filled", 
        formData: req.body 
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).render("auth/register", { 
        error: "Passwords do not match", 
        formData: req.body 
      });
    }

    if (password.length < 6) {
      return res.status(400).render("auth/register", { 
        error: "Password must be at least 6 characters long", 
        formData: req.body 
      });
    }

    // Check if user already exists in either collection
    const existingUser = await User.findOne({ email });
    const existingOwner = await Owner.findOne({ email });

    if (existingUser || existingOwner) {
      return res.status(400).render("auth/register", { 
        error: "User with this email already exists", 
        formData: req.body 
      });
    }

    console.log('Creating user with role:', role);

    // Create user based on role
    if (role === 'Owner') {
      // Do NOT hash password here, let pre-save hook handle it
      const owner = new Owner({
        name,
        email,
        password, // plain password
        phoneNum,
        city
      });
      await owner.save();
      console.log('Owner created successfully:', owner._id);
    } else {
      // For User, keep manual hashing (since User model does not have pre-save hook)
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      const user = new User({
        name,
        email,
        password: hashedPassword,
        phoneNum,
        city
      });
      await user.save();
      console.log('User created successfully:', user._id);
    }

    // Redirect to login with success message
    req.session.success = 'Registration successful! Please login.';
    return res.redirect('/auth/login');

  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).render("auth/register", { 
      error: "Registration failed. Please try again.", 
      formData: req.body 
    });
  }
}

export function showLogin(req, res) {
  if (req.session.user) {
    return res.redirect('/dashboard');
  }
  res.render('auth/login', { 
    title: 'Login - Player Finder',
    error: req.session.error,
    success: req.session.success
  });
  // Clear flash messages
  delete req.session.error;
  delete req.session.success;
}

export async function login(req, res) {
  try {
    const { email, password, role } = req.body;

    console.log('Login attempt:', { email, role });

    if (!email || !password || !role) {
      req.session.error = 'All fields are required';
      return res.redirect('/auth/login');
    }

    let user;
    if (role === 'Owner') {
      user = await Owner.findOne({ email }).select('+password');
      console.log('Owner lookup result:', user ? 'Found' : 'Not found');
    } else {
      user = await User.findOne({ email }).select('+password');
      console.log('User lookup result:', user ? 'Found' : 'Not found');
    }

    if (!user) {
      console.log('No user found with email:', email);
      req.session.error = 'Invalid credentials';
      return res.redirect('/auth/login');
    }

    console.log('User found:', {
      id: user._id,
      name: user.name,
      email: user.email,
      hasPassword: !!user.password
    });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log('Password validation:', isPasswordValid);

    if (!isPasswordValid) {
      req.session.error = 'Invalid credentials';
      return res.redirect('/auth/login');
    }

    // Create session with proper role
    req.session.user = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: role,
      city: user.city
    };

    console.log('Login successful:', {
      id: user._id,
      name: user.name,
      email: user.email,
      role: role
    });

    // Redirect based on role
    if (role === 'Owner') {
      res.redirect('/dashboard/owner');
    } else {
      res.redirect('/dashboard/player');
    }

  } catch (error) {
    console.error('Login error:', error);
    req.session.error = 'Login failed. Please try again.';
    res.redirect('/auth/login');
  }
}

export const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
    }
    res.redirect('/');
  });
}



