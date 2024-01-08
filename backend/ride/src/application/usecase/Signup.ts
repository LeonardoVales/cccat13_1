import Account from "../../Account";
import AccountDAO from "../../AccountDAO";
import CpfValidator from "../../CpfValidator";
import MailerGateway from "../../MailerGateway";

type Input = {
	name: string,
	email: string,
	cpf: string,
	isPassenger: boolean,
	isDriver: boolean,
	carPlate: string,
}

export default class Signup {
	cpfValidator: CpfValidator;
	mailerGateway: MailerGateway;

	// criando uma porta para que um ou mais adapters implementem, permitindo ue eu varie o comportamento
	constructor (readonly accountDAO: AccountDAO) {
		this.cpfValidator = new CpfValidator();
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
			input.carPlate
		)
		await this.accountDAO.save(account)
		await this.mailerGateway.send(account.email, "Verification", `Please verify your code at first login ${account.verificationCode}`);
		return {
			accountId: account.accountId
		}
	}

}
