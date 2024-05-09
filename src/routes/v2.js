const express = require('express');
const jwt = require('jsonwebtoken');
const secretKey = 'your_secret_key';  

const router = express.Router();


function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; 

    if (token == null) return res.sendStatus(401); 
    jwt.verify(token, secretKey, (err, user) => {
        if (err) return res.sendStatus(403); 
        req.user = user;
        next();
    });
}

function checkCapability(capability) {
    return (req, res, next) => {
        if (req.user && req.user.capabilities && req.user.capabilities.includes(capability)) {
            next();
        } else {
            res.status(403).json({ message: "Forbidden - Insufficient permissions" });
        }
    };
}

router.get('/resource', authenticateToken, (req, res) => {
    res.json({ message: "Access granted for GET" });
});

router.post('/resource', authenticateToken, checkCapability('create'), (req, res) => {
    res.json({ message: "Access granted for POST" });
});

router.put('/resource', authenticateToken, checkCapability('update'), (req, res) => {
    res.json({ message: "Access granted for PUT" });
});

router.delete('/resource', authenticateToken, checkCapability('delete'), (req, res) => {
    res.json({ message: "Access granted for DELETE" });
});

// Export the router
module.exports = router;
