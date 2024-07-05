

// routes.js or wherever you manage your routes
const express = require('express');
//const users = require('../models/userModels'); // Adjust path as necessary
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'your_secret_key'; // Keep this secure
const router = express.Router();
const { ObjectId } = require('mongodb');
const { getUsersCollection } = require('../models/usermodels');


// verification of token

// Middleware to verify JWT and set req.user
const verifyToken = (req, res, next) => {
    const token = req.cookies.token;
    if (token) {
        jwt.verify(token, SECRET_KEY, (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: 'Unauthorized' });
            }
            req.user = decoded; // Assuming decoded token has user details
            console.log(req.user)
            next();
        });
    } else {
        next();
    }
};

// Use the middleware globally or on specific routes as needed
router.use(verifyToken);


// For registration 

// Hash password function
async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(password, salt);
  return hashed;
}

router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    // Hash the password
    const hashedPassword = await hashPassword(password);

    try {
        /*
        // Optional: Check if the user already exists
        const existingUser = await users.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        */
        // Insert the new user if they do not already exist
        const users = await getUsersCollection();
        const result = await users.insertOne({
            username,
            email,
            password: hashedPassword,
        });

        res.status(201).json({ message: 'User created successfully', userId: result.insertedId });
    } catch (error) {
        res.status(500).json({ message: 'Error registering new user', error: error.message });
    }
});


// For login

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find the user by email
        //const user = await users.findOne({ email });
        const users = await getUsersCollection();
        const user = await users.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        // Compare password with bcrypt
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
/*
        // Upon successful authentication, create a JWT token
        const token = jwt.sign({ userId: user._id.toString() }, SECRET_KEY, { expiresIn: '1h' });

        // Send the token in a cookie
        res.cookie('token', token, { httpOnly: true, sameSite: 'strict' });
        */
        // Respond to client indicating successful login
        res.json({ message: 'Login successful' });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error during login' });
    }
});


// to retrieve username for display on html page

// Assuming 'verifyToken' is your middleware to validate JWT tokens
router.get('/user/profile', verifyToken, async (req, res) => {
    if (!req.user || !req.user.userId) {
        // If there's no user info, respond with an appropriate status code
        // 401 Unauthorized or 403 Forbidden could be used here
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
         // Convert userId from string to ObjectId
         const userId = ObjectId.createFromHexString(req.user.userId);
        //const user = await users.findOne({ _id: userId });
        const users = await getUsersCollection();
        //const user = await users.findOne({ userId });
        const user = await users.findOne({ _id: userId });
        console.log(user)
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Return minimal user information
        res.json({ username: user.username });
    } catch (error) {
        console.error('Profile fetch error:', error);
        res.status(500).json({ message: 'Error fetching user profile' });
    }
});


// login-status

router.get('/auth/status', (req, res) => {
    // Check if the request has a valid JWT cookie
    // This requires middleware to verify JWTs, which sets req.user if authenticated
    if (req.user) {
        res.json({ isAuthenticated: true });
    } else {
        res.json({ isAuthenticated: false });
    }
});

router.get('/auth/checkToken', (req, res) => {
    const token = req.cookies.token;
    if (token) {
        // Ideally, verify the token's validity here
        res.json({ isAuthenticated: true });
    } else {
        res.json({ isAuthenticated: false });
    }
});

// sign out

router.post('/logout', (req, res) => {
    res.clearCookie('token');
    res.json({ message: 'You have been signed out' });
});


// For following/followers

// In routes.js
/*
// Search users by username
router.get('/search', async (req, res) => {
    const { query } = req.query; // Assume a query parameter named 'query'
    try {
        const users = await db.collection('users').find({
            username: { $regex: query, $options: 'i' } // Case-insensitive search
        }).toArray();

        res.json(users.map(user => ({
            id: user._id,
            username: user.username
        })));
    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ message: 'Error searching for users' });
    }
});

// Fetch user profile
router.get('/user/profile/:username', async (req, res) => {
    const { username } = req.params;
    try {
        const user = await db.collection('users').findOne({ username: username });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Simplify the response. In practice, you'd include more details.
        res.json({ 
            username: user.username,
            // Add other details as necessary
        });
    } catch (error) {
        console.error('Profile fetch error:', error);
        res.status(500).json({ message: 'Error fetching user profile' });
    }
}); */

// Search users by username
router.get('/search', async (req, res) => {
    const { query } = req.query;
    try {
        const users = await getUsersCollection();
        const searchResult = await users.find({
            username: { $regex: query, $options: 'i' } // Case-insensitive search
        }).toArray();

        res.json(searchResult.map(user => ({
            id: user._id,
            username: user.username
        })));
    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ message: 'Error searching for users' });
    }
});

// Fetch user profile by username
router.get('/user/profile/:username', async (req, res) => {
    const { username } = req.params;
    try {
        const users = await getUsersCollection();
        const user = await users.findOne({ username: username });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Simplify the response. In practice, you might want to include more details.
        res.json({
            username: user.username,
            followers: user.followers,
            following: user.following
            // You can add other user details as needed
        });
    } catch (error) {
        console.error('Profile fetch error:', error);
        res.status(500).json({ message: 'Error fetching user profile' });
    }
});

// Follow a user
router.post('/user/follow', verifyToken, async (req, res) => {
    const { followUserId } = req.body; // ID of the user to follow
    const userId = req.user.userId; // Extracted from JWT

    try {
        // Add followUserId to the following array of the current user
        // and userId to the followers array of the followUserId
        /*
        await db.collection('users').updateOne({ _id: ObjectId(userId) }, { $addToSet: { following: followUserId } });
        await db.collection('users').updateOne({ _id: ObjectId(followUserId) }, { $addToSet: { followers: userId } });
        */
        const users = await getUsersCollection(); // Get the users collection
        await users.updateOne({ _id: ObjectId(userId) }, { $addToSet: { following: followUserId } });
        await users.updateOne({ _id: ObjectId(followUserId) }, { $addToSet: { followers: userId } });
        res.json({ message: 'Followed successfully' });
    } catch (error) {
        console.error('Follow error:', error);
        res.status(500).json({ message: 'Error following the user' });
    }
});

// Similar implementation for unfollowing...



module.exports = router;



