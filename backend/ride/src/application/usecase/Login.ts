import TokenGenerator from "../../domain/TokenGenerator";
import AccountRepository from "../repository/AccountRepository";

type Input = {
  email: string,
  password: string,
}

type Output = {
  token: string
}

export default class Login {
  constructor(readonly accountRepository: AccountRepository) { }

  async execute(input: Input): Promise<Output> {
    const account = await this.accountRepository.getByEmail(input.email)
    if (!account) {
      throw new Error("Authentication failed")
    }

    if (!account.password.validate(input.password)) {
      throw new Error("Authentication failed")
    }
    const token = TokenGenerator.generate(account, new Date())
    return {
      token,
    }
  }
}