//driver
// import AccountService from "../src/AccountService";
import sinon from 'sinon'
import AccountDAO from "../../src/infra/repository/AccountDAODatabase";
import MailerGateway from "../../src/infra/gateway/MailerGateway";
import AccountDAOMemory from "../../src/infra/repository/AccountDAOMemory";
import Account from "../../src/domain/Account";
import Connection from '../../src/infra/database/Connection';
import RideDAO from '../../src/application/repository/RideRepository';
import Signup from '../../src/application/usecase/Signup';
import GetAccount from '../../src/application/usecase/GetAccount';
import PgPromiseAdapter from '../../src/infra/database/PgPromiseAdapter';
import RideDAODatabase from '../../src/infra/repository/RideDAODatabase';

let connection: Connection
let accountDAO: AccountDAO
let rideDAO: RideDAO
let signup: Signup
let getAccount: GetAccount

beforeEach(() => {
  connection = new PgPromiseAdapter()
  accountDAO = new AccountDAO(connection)
  rideDAO = new RideDAODatabase(connection)
  signup = new Signup(accountDAO)
  getAccount = new GetAccount(accountDAO)
})

afterEach(async () => {
  await connection.close()
})

test("Deve criar um passageiro", async function () {
	const input: any = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "95818705552",
		isPassenger: true
	}

	
	const output = await signup.execute(input);
	const account = await getAccount.execute(output.accountId);

	expect(account?.accountId).toBeDefined();
	expect(account?.name).toBe(input.name);
	expect(account?.email).toBe(input.email);
	expect(account?.cpf).toBe(input.cpf);
});

test("Não deve criar um passageiro com cpf inválido", async function () {
	const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "95818705500",
		isPassenger: true,
    isDriver: false,
    carPlate: '',
	}
	
	await expect(() => signup.execute(input)).rejects.toThrow(new Error("Invalid cpf"));
});

test("Não deve criar um passageiro com nome inválido", async function () {
	const input = {
		name: "John",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "95818705552",
		isPassenger: true,
    isDriver: false,
    carPlate: '',
	}
	
	await expect(() => signup.execute(input)).rejects.toThrow(new Error("Invalid name"));
});

test("Não deve criar um passageiro com email inválido", async function () {
	const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}@`,
		cpf: "95818705552",
		isPassenger: true,
    isDriver: false,
    carPlate: '',
	}
	
	await expect(() => signup.execute(input)).rejects.toThrow(new Error("Invalid email"));
});

test("Não deve criar um passageiro com conta existente", async function () {
	const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "95818705552",
		isPassenger: true,
    isDriver: false,
    carPlate: '',
	}
	
	await signup.execute(input)
	await expect(() => signup.execute(input)).rejects.toThrow(new Error("Account already exists"));
});

test("Deve criar um motorista", async function () {
	const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "95818705552",
		carPlate: "AAA9999",
		isDriver: true,
    isPassenger: false,
	}
	
	const output = await signup.execute(input);
	expect(output.accountId).toBeDefined();
});

test("Não deve criar um motorista com place do carro inválida", async function () {
	const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "95818705552",
		carPlate: "AAA999",
		isDriver: true,
    isPassenger: false,
	}
	
	await expect(() => signup.execute(input)).rejects.toThrow(new Error("Invalid plate"));
});

test("Deve criar um passageiro com stub", async function () {
	const input: any = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "95818705552",
		isPassenger: true
	}

	const stubSave = sinon.stub(AccountDAO.prototype, 'save').resolves()
	const stubGetByEmail = sinon.stub(AccountDAO.prototype, 'getByEmail').resolves()

	const output = await signup.execute(input);
	input.account_id = output.accountId
	const stubGetById = sinon.stub(AccountDAO.prototype, 'getById').resolves(
		Account.create(
			input.name,
			input.email,
			input.cpf,
			input.isPassenger,
			false,
			'',
		)
	)
	const account = await getAccount.execute(output.accountId);

	expect(account?.accountId).toBeDefined();
	expect(account?.name).toBe(input.name);
	expect(account?.email).toBe(input.email);
	expect(account?.cpf).toBe(input.cpf);

	stubSave.restore()
	stubGetByEmail.restore()
	stubGetById.restore()
});

test("Deve criar um passageiro com spy", async function () {
	const spy = sinon.spy(MailerGateway.prototype, 'send')
	const input: any = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "95818705552",
		isPassenger: true
	}

	const stubSave = sinon.stub(AccountDAO.prototype, 'save').resolves()
	const subGetByEmail = sinon.stub(AccountDAO.prototype, 'getByEmail').resolves()

	
	const output = await signup.execute(input);
	input.account_id = output.accountId
	const stubgetById = sinon.stub(AccountDAO.prototype, 'getById').resolves(input)
	// const account = await getAccount.execute(output.accountId);

	expect(spy.calledOnce).toBeTruthy()
	expect(spy.calledWith(input.email)).toBeTruthy()
	spy.restore()

	stubSave.restore()
	subGetByEmail.restore()
	stubgetById.restore()
});

test.skip("Deve criar um passageiro com mock", async function () {

	const input: any = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "95818705552",
		isPassenger: true
	}

	const mock = sinon.mock(MailerGateway.prototype)
	mock.expects("send").withArgs(input.email, 'Verification').calledOnce;

	const mockAccountDAO = sinon.mock(AccountDAO.prototype);
	mockAccountDAO.expects('save').resolves()
	mockAccountDAO.expects('getByEmail').resolves()

	
	const output = await signup.execute(input);
	input.account_id = output.accountId

	mockAccountDAO.expects('getById').resolves(input)
	const account = await getAccount.execute(output.accountId);
	mock.verify()
	mock.restore()
});


// test("Deve criar um passageiro con fake", async function () {
// 	const accountDAO = new AccountDAOMemory()
// 	const input: any = {
// 		name: "John Doe",
// 		email: `john.doe${Math.random()}@gmail.com`,
// 		cpf: "95818705552",
// 		isPassenger: true
// 	}

// 	const accountService = new AccountService(accountDAO);
// 	const output = await signup.execute(input);
// 	const account = await getAccount.execute(output.accountId);

// 	expect(account?.accountId).toBeDefined();
// 	expect(account?.name).toBe(input.name);
// 	expect(account?.email).toBe(input.email);
// 	expect(account?.cpf).toBe(input.cpf);
// });1