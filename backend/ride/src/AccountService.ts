import crypto from "crypto";
import pgp from "pg-promise";
import Account from "./Account";
import AccountDAODatabase from "./AccountDAODatabase";
import AccountDAO from "./AccountDAODatabase";
import CpfValidator from "./CpfValidator";
import MailerGateway from "./MailerGateway";

export default class AccountService {
	cpfValidator: CpfValidator;
	mailerGateway: MailerGateway;

	// criando uma porta para que um ou mais adapters implementem, permitindo ue eu varie o comportamento
	constructor (readonly accountDAO: AccountDAO = new AccountDAODatabase()) {
		this.cpfValidator = new CpfValidator();
		this.mailerGateway = new MailerGateway()
	}

	//port
	async signup (input: any) {
		const existingAccount = await this.accountDAO.getByEmail(input.email)
		if (existingAccount) {
			throw new Error("Account already exists");
		}

		const account = Account.create(
			input.name,
			input.email,
			input.cpf,
			input.isPassenger,
			input.isDriver,
			input.carPlate
		)
		await this.accountDAO.save(account)
		await this.mailerGateway.send(account.email, "Verification", `Please verify your code at first login ${account.verificationCode}`);
		return {
			accountId: account.accountId
		}
	}

	//port
	async getAccount (accountId: string) {
		const account = await this.accountDAO.getById(accountId)
		return account;
	}
}
