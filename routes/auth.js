/**
 * author: larry amiel tablando
 * link: github.com/larryamiel
 * description: exporting the router for the authentication routes.
 */

const router = require('express').Router();
const AuthService = require(__basedir + '/services/AuthService');

// Register Route
router.post('/register', AuthService.register);

// Login Route
router.post('/login', AuthService.login);

// // Authenticated Route
// router.get('/authenticate', AuthService.authenticate);

// // Login Route
// router.post('/logout', AuthService.logout);

module.exports = router;