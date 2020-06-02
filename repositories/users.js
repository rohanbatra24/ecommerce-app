const fs = require('fs');

const crypto = require('crypto');

const util = require('util');

const Repository = require('./repository');

const scrypt = util.promisify(crypto.scrypt);

class UsersRepository extends Repository {
	async create(attrs) {
		// attrs = {email: '', password: ''}

		const records = await this.getAll();

		attrs.id = this.randomId();

		const salt = crypto.randomBytes(8).toString('hex');

		// using promisify util to return a prmise from scrypt instead of callback
		const buf = await scrypt(attrs.password, salt, 64);

		const record = { ...attrs, password: `${buf.toString('hex')}.${salt}` };

		records.push(record);

		await this.writeAll(records);

		return record;
	}

	async comparePasswords(saved, supplied) {
		// saved = password saved in our database like 'hashed.salt'
		// supplied = password given by current user to sign in

		// array destructuring
		const [ hashed, salt ] = saved.split('.');

		const hashedSuppliedBuf = await scrypt(supplied, salt, 64);

		return hashed === hashedSuppliedBuf.toString('hex');
	}
}

module.exports = new UsersRepository('users.json');
