import Account from "./Account"

// port
export default interface AccountDAO {
  save(account: Account): Promise<void>
  getByEmail(email: string): Promise<Account>
  getById(accountId: string): Promise<Account>
}