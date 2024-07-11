const jwt = require('jsonwebtoken');
const { User, Organization } = require('../models');
require('dotenv').config();

const generateToken = (user) => {
    const payload = { userId: user.userId };
    const secret = process.env.JWT_SECRET;
    const options = {
      expiresIn: process.env.JWT_EXPIRES_IN,
    };
  
    return jwt.sign(payload, secret, options);
  };

exports.register = async (req, res) => {
  const { firstName, lastName, email, password, phone } = req.body;

  try {
    const user = await User.create({ firstName, lastName, email, password, phone });

    const orgName = `${firstName}'s Organization`;
    const organization = await Organization.create({ name: orgName });

    await user.addOrganization(organization);

    const token = generateToken(user);

    res.status(201).json({
      status: 'success',
      message: 'Registration successful',
      data: {
        accessToken: token,
        user: {
          userId: user.userId,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
        },
      },
    });
  } catch (err) {
    console.error('Registration error:', err);
    if (err.name === 'SequelizeValidationError') {
      const errors = err.errors.map(e => ({ field: e.path, message: e.message }));
      return res.status(422).json({
        errors,
      });
    }
    res.status(400).json({
      status: 'Bad request',
      message: 'Registration unsuccessful',
      statusCode: 400,
    });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user || !(await user.validPassword(password))) {
      return res.status(401).json({
        status: 'Bad request',
        message: 'Authentication failed',
        statusCode: 401,
      });
    }

    const token = generateToken(user);

    res.status(200).json({
      status: 'success',
      message: 'Login successful',
      data: {
        accessToken: token,
        user: {
          userId: user.userId,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
        },
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(401).json({
      status: 'Bad request',
      message: 'Authentication failed',
      statusCode: 401,
    });
  }
};
