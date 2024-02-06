import AccountDAO from "../repository/AccountDAO";

export default class GetAccount {

	// criando uma porta para que um ou mais adapters implementem, permitindo ue eu varie o comportamento
	constructor (readonly accountDAO: AccountDAO) {

	}

	//port
	async execute (accountId: string): Promise<Output> {
		const account = await this.accountDAO.getById(accountId)
		if (!account) {
			throw new Error('Account is not found')
		}
		return {
			name: account?.name.getValue(),
			accountId: accountId,
			email: account.email.getValue(),
			cpf: account.cpf.getValue(),
			carPlate: account.carPlate.getValue(),
			isPassenger: account.isPassenger,
			isDriver: account.isDriver,
		}
	}
}

type Output = {
	accountId: string,
	name: string,
	email: string,
	cpf: string,
	carPlate: string,
	isPassenger: boolean,
	isDriver: boolean,
}
