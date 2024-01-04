import Account from '../src/Account'
import AccountDAO from "../src/AccountDAODatabase"

test("Deve criar um registro na tabela account e consultar por email", async function () {
  const accountDAO = new AccountDAO()
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
  expect(savedAccount?.cpf).toBe(account.cpf)
  expect(savedAccount?.isPassenger).toBeTruthy()
  expect(savedAccount?.date).toBeDefined()
})

test("Deve criar um registro na tabela account e consultar por account Id", async function () {
  const accountDAO = new AccountDAO()
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
  expect(savedAccount?.cpf).toBe(account.cpf)
  expect(savedAccount?.isPassenger).toBeTruthy()
  expect(savedAccount?.date).toBeDefined()
})