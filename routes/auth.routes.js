// routes/auth.routes.js
const { Router } = require('express');
const router = new Router();
const bcryptjs = require('bcryptjs');
const User = require('../models/User.model');
const saltRounds = 10;

// GET route ==> to display the signup form to users
router.get('/', (req, res) => 
    res.render('sign-up')
);

router.post('/', async (req, res, next) => {
    const { username, password } = req.body;
    if (!username || !password) {
        res.render('sign-up', { errorMessage: 'All fields are mandatory. Please provide your username and password.' });
        return;
      }
      
    const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    if (!regex.test(password)) {
        res
          .status(500)
          .render('sign-up', { errorMessage: 'Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter.' });
        return;
      }

    try {
        const salt = await bcryptjs.genSalt(saltRounds);
        const hashedPassword = await bcryptjs.hash(password, salt);
        const userFromDB = await User.create({
        username,
        passwordHash: hashedPassword
      });
      res.send('Welcome!');
   
      console.log('Newly created user is: ', userFromDB);
   
      // Send response, etc.
    } catch(error) {
        if (error instanceof mongoose.Error.ValidationError) {
            res.status(500).render('sign-up', { errorMessage: error.message });
          } else if (error.code === 11000) {
            res.status(500).render('sign-up', {
               errorMessage: 'Username needs to be unique. Username is already used.'
            });
          } else {
            console.log(error);
        }
    }
  });
  
// POST route ==> to process form data

module.exports = router;
