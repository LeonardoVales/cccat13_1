import Account from "../../domain/Account";
import AccountDAO from "../repository/AccountRepository";
import MailerGateway from "../../infra/gateway/MailerGateway";

type Input = {
	name: string,
	email: string,
	cpf: string,
	isPassenger: boolean,
	isDriver: boolean,
	carPlate: string,
	password?: string,
}

export default class Signup {
	mailerGateway: MailerGateway;

	// criando uma porta para que um ou mais adapters implementem, permitindo ue eu varie o comportamento
	constructor (readonly accountDAO: AccountDAO) {
		this.mailerGateway = new MailerGateway()
	}

	//port
	async execute (input: Input) {
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
			input.carPlate,
			input.password,
		)
		await this.accountDAO.save(account)
		await this.mailerGateway.send(account.email.getValue(), "Verification", `Please verify your code at first login ${account.verificationCode}`);
		return {
			accountId: account.accountId
		}
	}

}
