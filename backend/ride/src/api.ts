//driver
//adapter - A api é uma adaptação para o uso da aplicação, ela é uma forma de se chegar até a aplicação
import express from 'express'
import AccountDAODatabase from './AccountDAODatabase'
import AccountService from './AccountService'
import GetAccount from './GetAccount'
import PgPromiseAdapter from './PgPromiseAdapter'
import Signup from './Signup'

const app = express()
const connection = new PgPromiseAdapter()
const accountDAO = new AccountDAODatabase(connection)

app.use(express.json())

//port 
// const accountService = new AccountService()

app.post('/signup', async function (req, res) {
  const input = req.body
  const signup = new Signup(accountDAO)
  const output = await signup.execute(input)
  res.json(output)
})

app.get('/accounts/:accountId', async function (req, res) {
  const getAccount = new GetAccount(accountDAO)
  const output = await getAccount.execute(req.params.accountId)
  res.json(output)
})

app.listen(3000)