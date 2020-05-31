const express = require('express');

const app = express();

app.get('/', (req, res) => {
	res.send(`
    <div>
        <form method='POST'>
        <input name='email' placeholder='email'>
        <input name='password' placeholder='password'>
        <input name='passwordConfirmation' placeholder='password confirmation'>
        <button>Sign Up</button>
        </form>
    </div>`);
});

const bodyParser = () => {
	//get access to email,password,passconfirm
	req.on('data', (data) => {
		const parsed = data.toString('utf8').split('&');
		const formData = {};
		for (let pair of parsed) {
			//array destructuring
			const [ key, value ] = pair.split('=');
			formData[key] = value;
		}
		console.log(formData);
	});
};

app.post('/', (req, res) => {
	res.send('account created');
});

app.listen(3000, () => {
	console.log('listening on 3000');
});
