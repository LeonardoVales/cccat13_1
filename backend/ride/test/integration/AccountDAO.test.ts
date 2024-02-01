import Account from '../../src/domain/Account'
import AccountDAODatabase from '../../src/infra/repository/AccountDAODatabase'
import AccountDAO from "../../src/infra/repository/AccountDAODatabase"
import Connection from '../../src/infra/database/Connection'
import PgPromiseAdapter from '../../src/infra/database/PgPromiseAdapter'

let connection: Connection
let accountDAO: AccountDAO

beforeEach(() => {
  connection = new PgPromiseAdapter()
  accountDAO = new AccountDAODatabase(connection)
})

afterEach(async function () {
  await connection.close()
})

test("Deve criar um registro na tabela account e consultar por email", async function () {
  const account = Account.create(
    "John Doe",
    `john.doe${Math.random()}@gmail.com`,
    "95818705552",
    true,
    false,
    '',
  )

  await accountDAO.save(account)
  const savedAccount = await accountDAO.getByEmail(account.email)

  expect(savedAccount?.accountId).toBeDefined()
  expect(savedAccount?.name).toBe(account.name)
  expect(savedAccount?.email).toBe(account.email)
  expect(savedAccount?.cpf.getValue()).toBe(account.cpf.getValue())
  expect(savedAccount?.isPassenger).toBeTruthy()
  expect(savedAccount?.date).toBeDefined()
})

test("Deve criar um registro na tabela account e consultar por account Id", async function () {
  const account = Account.create(
    "John Doe",
    `john.doe${Math.random()}@gmail.com`,
    "95818705552",
    true,
    false,
    '',
  )

  await accountDAO.save(account)
  const savedAccount = await accountDAO.getById(account.accountId)

  expect(savedAccount?.accountId).toBeDefined()
  expect(savedAccount?.name).toBe(account.name)
  expect(savedAccount?.email).toBe(account.email)
  expect(savedAccount?.cpf.getValue()).toBe(account.cpf.getValue())
  expect(savedAccount?.isPassenger).toBeTruthy()
  expect(savedAccount?.date).toBeDefined()
})