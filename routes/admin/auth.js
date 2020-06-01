const express = require('express');

const usersRepo = require('../../repositories/users');

const signupTemplate = require('../../views/admin/auth/signup');

const router = express.Router();

router.get('/signup', (req, res) => {
	res.send(signupTemplate({ req }));
});

router.post('/signup', async (req, res) => {
	console.log(req.body);

	const { email, password, passwordConfirmation } = req.body;

	const existingUser = await usersRepo.getOneBy({ email });

	if (existingUser) {
		return res.send('Email in use');
	}

	if (password !== passwordConfirmation) {
		return res.send('Passwords must match');
	}

	// create a user in the user repo
	const user = await usersRepo.create({ email, password });

	// store the id of that user inside the user's cookie
	req.session.userId = user.id;

	res.send('account created');
});

router.get('/signout', (req, res) => {
	req.session = null;
	res.send('You are logged out');
});

router.get('/signin', (req, res) => {
	res.send(`
    <div>   
        <form method='POST'>
        <input name='email' placeholder='email'>
        <input name='password' placeholder='password'>
        <button>Sign In</button>
        </form>
    </div>`);
});

router.post('/signin', async (req, res) => {
	const { email, password } = req.body;

	const user = await usersRepo.getOneBy({ email });

	if (!user) {
		return res.send('Email not found');
	}

	const validPassword = await usersRepo.comparePasswords(user.password, password);

	if (!validPassword) {
		return res.send('Invalid password');
	}

	req.session.userId = user.id;

	res.send('You are signed in');
});

module.exports = router;
