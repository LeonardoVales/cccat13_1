import AccountDAO from "./AccountDAO";

export default class GetAccount {

	// criando uma porta para que um ou mais adapters implementem, permitindo ue eu varie o comportamento
	constructor (readonly accountDAO: AccountDAO) {

	}

	//port
	async execute (accountId: string) {
		const account = await this.accountDAO.getById(accountId)
		return account;
	}
}
