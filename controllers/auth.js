const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

const Role = require('../models/Role');
const User = require('../models/User');

const generateAccessToken = ({ id, roles }) => {
  const payload = { id , roles };

  return jwt.sign(payload, 'secret', { expiresIn: '1h' });
}

class AuthController {
  async registration(req, res) {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).send(errors.array()[0].msg);
      }

      const { username, password } = req.body;

      const candidate = await User.findOne({ username });

      if (candidate) {
        return res.status(400).send('User already exists');
      }

      const passwordHash = bcrypt.hashSync(password, 7);
      const userRole = await Role.findOne({ value: 'user' });
      const user = new User({ username, password: passwordHash, roles: [userRole.value] });
      await user.save();

      return res.send('User registered');
    } catch (error) {
      console.log(error);
      res.status(400).send('Registration error');
    }
  }

  async login(req, res) {
    try {
      const { username, password } = req.body;

      const user = await User.findOne({ username });

      if (!user) {
        return res.status(400).send('User not found');
      }

      const isValidPassword = bcrypt.compareSync(password, user.password);
      
      if (!isValidPassword) {
        return res.status(400).send('Incorrect password');
      }

      const token = generateAccessToken(user);

      return res.send(token);
    } catch (error) {
      console.log(error);
      res.status(400).send('Login error');
    }
  }

  async getUsers(req, res) {
    try {
      const users = await User.find();

      res.json(users);
    } catch (error) {
      console.log(error);
      res.status(400).send('Cannot get users error');
    }
  }
}

module.exports = new AuthController();
