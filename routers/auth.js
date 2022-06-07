const { Router } = require('express');
const { body } = require('express-validator');

const authController = require('../controllers/auth');
const authMiddleware = require('./authMiddleware');
const roleMiddleware = require('./roleMiddleware');

const authRouter = new Router();

authRouter.post('/registration',[
  body('username', 'Password cannot be empty').notEmpty(),
  body('password', 'Password must be at least 5 characters long').isLength({ min: 5 })
], authController.registration);

authRouter.post('/login', authController.login);

authRouter.get('/users', roleMiddleware(['admin']), authController.getUsers);

module.exports = authRouter;
