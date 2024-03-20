//driver
//adapter - A api é uma adaptação para o uso da aplicação, ela é uma forma de se chegar até a aplicação
import express from 'express'
import ExpressAdapter from './infra/http/ExpressAdapter'
import GetAccount from './application/usecase/GetAccount'
import MainController from './infra/controller/MainController'
import PgPromiseAdapter from './infra/database/PgPromiseAdapter'
import Signup from './application/usecase/Signup'
import RequestRide from './application/usecase/RequestRide'
import GetRide from './application/usecase/GetRide'
import AccountRepositoryDatabase from './infra/repository/AccountRepositoryDatabase'
import RideRepositoryDatabase from './infra/repository/RideRepositoryDatabase'
import RepositoryDatabaseFactory from './infra/factory/RepositoryDatabaseFactory'

const app = express()
const connection = new PgPromiseAdapter()
const accountRepository = new AccountRepositoryDatabase(connection)
const rideRepository = new RideRepositoryDatabase(connection)
const repositoryFactory = new RepositoryDatabaseFactory(connection)
const signup = new Signup(accountRepository)
const getAccount = new GetAccount(accountRepository)
const requestRide = new RequestRide(repositoryFactory)
const getRide = new GetRide(rideRepository, accountRepository)
const httpServer = new ExpressAdapter()
new MainController(httpServer, signup, getAccount, requestRide, getRide )
httpServer.listen(3000)
