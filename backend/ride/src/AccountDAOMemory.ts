import AccountDAO from "./AccountDAO";

export default class AccountDAOMemory implements AccountDAO {

  accounts: any = [];

  async save(account: any): Promise<void> {
    this.accounts.push(account)
  }
  getByEmail(email: string): Promise<any | undefined> {
    const account = this.accounts.find((account: any) => account.email === email)
    // account.account_id = account.accountId ?? undefined
    return account
  }
  getById(accountId: string): Promise<any> {
    const account = this.accounts.find((account: any) => account.accountId === accountId)
    account.account_id = account.accountId
    return account
  }

}