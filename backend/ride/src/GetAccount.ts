import AccountDAODatabase from "./AccountDAODatabase";
import AccountDAO from "./AccountDAODatabase";

export default class GetAccount {

	// criando uma porta para que um ou mais adapters implementem, permitindo ue eu varie o comportamento
	constructor (readonly accountDAO: AccountDAO = new AccountDAODatabase()) {

	}

	//port
	async execute (accountId: string) {
		const account = await this.accountDAO.getById(accountId)
		return account;
	}
}
