//driver
//adapter - A api é uma adaptação para o uso da aplicação, ela é uma forma de se chegar até a aplicação
import express from 'express'
import AccountDAODatabase from './AccountDAODatabase'
import ExpressAdapter from './ExpressAdapter'
import GetAccount from './GetAccount'
import MainController from './MainController'
import PgPromiseAdapter from './PgPromiseAdapter'
import Signup from './Signup'

const app = express()
const connection = new PgPromiseAdapter()
const accountDAO = new AccountDAODatabase(connection)
const signup = new Signup(accountDAO)
const getAccount = new GetAccount(accountDAO)
const httpServer = new ExpressAdapter()
new MainController(httpServer, signup, getAccount)
httpServer.listen(3000)
