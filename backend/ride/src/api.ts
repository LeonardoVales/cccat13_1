//driver
//adapter - A api é uma adaptação para o uso da aplicação, ela é uma forma de se chegar até a aplicação
import express from 'express'
import AccountDAODatabase from './infra/repository/AccountDAODatabase'
import ExpressAdapter from './infra/http/ExpressAdapter'
import GetAccount from './application/usecase/GetAccount'
import MainController from './infra/controller/MainController'
import PgPromiseAdapter from './infra/database/PgPromiseAdapter'
import Signup from './application/usecase/Signup'

const app = express()
const connection = new PgPromiseAdapter()
const accountDAO = new AccountDAODatabase(connection)
const signup = new Signup(accountDAO)
const getAccount = new GetAccount(accountDAO)
const httpServer = new ExpressAdapter()
new MainController(httpServer, signup, getAccount)
httpServer.listen(3000)
