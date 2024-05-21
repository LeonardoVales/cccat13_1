import { sign } from 'jsonwebtoken'
import Account from "./Account";

/**
 * Isso é um domain service
 */
export default class TokenGenerator {
  static generate (account: Account, date: Date) {
    const token = sign({
      cpf: account.cpf.getValue(),
      iat: date.getTime(),
      expiresIn: 1000000000,
    }, 'secret')

    return token
  }
}