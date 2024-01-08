// resource
// adapter
import pgp from "pg-promise";
import Account from "../../domain/Account";
import AccountDAO from "../../application/repository/AccountDAO";
import Connection from "../database/Connection";

export default class AccountDAODatabase implements AccountDAO {
  constructor(readonly connection: Connection) {

  }

  async save(account: Account) {
    // const connection = pgp()("postgresql://getrak:getrak@localhost:5432/postgres"); //O postgres é um "framework and driver", ele é uma lib específica
    await this.connection.query("insert into cccat13.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver, date, is_verified, verification_code) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)", [account.accountId, account.name, account.email, account.cpf, account.carPlate, !!account.isPassenger, !!account.isDriver, account.date, false, account.verificationCode]);
    // await connection.$pool.end();
  }

  async getByEmail(email: string) {
    // const connection = pgp()("postgresql://getrak:getrak@localhost:5432/postgres");
    const [accountData] = await this.connection.query("select * from cccat13.account where email = $1", [email]);
    // await connection.$pool.end();

    if (!accountData) {
      return
    }

    return Account.restore(
      accountData.account_id,
      accountData.name,
      accountData.email,
      accountData.cpf,
      accountData.is_passenger,
      accountData.is_driver,
      accountData.car_plate,
      accountData.date,
      accountData.verification_code,
    )
  }

  async getById(accountId: string) {
    // const connection = pgp()("postgresql://getrak:getrak@localhost:5432/postgres");
    const [accountData] = await this.connection.query("select * from cccat13.account where account_id = $1", [accountId]);
    // await connection.$pool.end();

    if (!accountData) {
      return
    }

    return Account.restore(
      accountData.account_id,
      accountData.name,
      accountData.email,
      accountData.cpf,
      accountData.is_passenger,
      accountData.is_driver,
      accountData.car_plate,
      accountData.date,
      accountData.verification_code,
    )
  }
}