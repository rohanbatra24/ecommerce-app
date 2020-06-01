const express = require('express');

const bodyParser = require('body-parser');

const cookieSession = require('cookie-session');

const usersRepo = require('./repositories/users');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.use(
	cookieSession({
		keys : [ 'gfi76gkilhg7f8' ]
	})
);

app.get('/signup', (req, res) => {
	res.send(`
    <div>   
    Your id is: ${req.session.userId}
        <form method='POST'>
        <input name='email' placeholder='email'>
        <input name='password' placeholder='password'>
        <input name='passwordConfirmation' placeholder='password confirmation'>
        <button>Sign Up</button>
        </form>
    </div>`);
});

app.post('/signup', async (req, res) => {
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

app.listen(3000, () => {
	console.log('listening on 3000');
});
