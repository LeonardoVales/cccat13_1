// port
export default interface AccountDAO {
  save(account: any): Promise<void>
  getByEmail(email: string): Promise<any | undefined>
  getById(accountId: string): Promise<any>
}