import AcceptRide from "../src/application/usecase/AcceptRide";
import AccountDAO from "../src/AccountDAO";
import AccountDAODatabase from "../src/AccountDAODatabase";
import Connection from "../src/Connection";
import GetRide from "../src/application/usecase/GetRide";
import PgPromiseAdapter from "../src/PgPromiseAdapter";
import RequestRide from "../src/application/usecase/RequestRide";
import RideDAO from "../src/RideDAO";
import RideDAODatabase from "../src/RideDAODatabase";
import Signup from "../src/application/usecase/Signup";

let signup: Signup
let requestRide: RequestRide
let acceptRide: AcceptRide
let getRide: GetRide
let connection: Connection
let rideDAO: RideDAO
let accountDAO: AccountDAO

beforeEach(() => {
  connection = new PgPromiseAdapter()
  rideDAO = new RideDAODatabase(connection)
  accountDAO = new AccountDAODatabase(connection)
  signup = new Signup(accountDAO)
  requestRide = new RequestRide(rideDAO, accountDAO)
  acceptRide = new AcceptRide(rideDAO, accountDAO)
  getRide = new GetRide(rideDAO)
})

afterEach( async function () {
  await connection.close()
})

test("Deve solicitar uma corrida e receber uma rideId", async function () {
  const inputSignup: any = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "95818705552",
		isPassenger: true
	}

	const outputSignup = await signup.execute(inputSignup);

  const inputRequestRide = {
    passengerId: outputSignup.accountId,
    from: {
      lat: -19.839982762067386,
      long: -43.95080005999862,
    },
    to: {
      lat: -19.837812973735687,
      long: -43.94836456508952
    }
  }

  const outputRequestRide = await requestRide.execute(inputRequestRide)
  expect(outputRequestRide.rideId).toBeDefined()
})

test("Deve solicitar e consultar uma corrida", async function () {
  const inputSignup: any = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "95818705552",
		isPassenger: true
	}


	const outputSignup = await signup.execute(inputSignup);
  const inputRequestRide = {
    passengerId: outputSignup.accountId,
    from: {
      lat: -19.839982762067386,
      long: -43.95080005999862,
    },
    to: {
      lat: -19.837812973735687,
      long: -43.94836456508952
    }
  }

  const outputRequestRide = await requestRide.execute(inputRequestRide)
  const outputGetRide = await getRide.execute(outputRequestRide.rideId)
  expect(outputGetRide.getStatus()).toBe("requested")
  expect(outputGetRide.passengerId).toBe(outputSignup.accountId)
  expect(outputGetRide.fromLat).toBe(inputRequestRide.from.lat)
  expect(outputGetRide.date).toBeDefined()
})

test("Deve solicitar uma corrida e aceitar uma corrida", async function () {
  const inputSignupPassenger: any = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "95818705552",
		isPassenger: true
	}
	const outputSignupPassenger = await signup.execute(inputSignupPassenger);

  const inputSignupDriver: any = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "95818705552",
		isDriver: true,
    carPlate: 'AAA9999'
	}
	const outputSignupDriver = await signup.execute(inputSignupDriver);


  const inputRequestRide = {
    passengerId: outputSignupPassenger.accountId,
    from: {
      lat: -19.839982762067386,
      long: -43.95080005999862,
    }, 
    to: {
      lat: -19.837812973735687,
      long: -43.94836456508952
    }
  }

  const outputRequestRide = await requestRide.execute(inputRequestRide)
  const inputAcceptRide = {
    rideId: outputRequestRide.rideId,
    driverId: outputSignupDriver.accountId,
  }
  await acceptRide.execute(inputAcceptRide)
  const outputGetRide = await getRide.execute(outputRequestRide.rideId)
  expect(outputGetRide.getStatus()).toBe('accepted')
  expect(outputGetRide.driverId).toBe(outputSignupDriver.accountId)

})

test("Caso uma corrida seja solicitada por uma conta que não seja de passageiro deve lançar um erro", async function () {
  const inputSignup: any = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "95818705552",
		isDriver: true,
    carPlate: 'AAA9999'
	}

	const outputSignup = await signup.execute(inputSignup);

  const inputRequestRide = {
    passengerId: outputSignup.accountId,
    from: {
      lat: -19.839982762067386,
      long: -43.95080005999862,
    },
    to: {
      lat: -19.837812973735687,
      long: -43.94836456508952
    }
  }

  await expect(() => requestRide.execute(inputRequestRide))
    .rejects.toThrow(new Error('Account is not from a passenger'))
})

test("Caso uma corrida seja solicitada por um passageiro e ele já tenha outra corrida em andamento deve lançar um erro", async function () {
  const inputSignup: any = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "95818705552",
		isPassenger: true,
	}

	const outputSignup = await signup.execute(inputSignup);

  const inputRequestRide = {
    passengerId: outputSignup.accountId,
    from: {
      lat: -19.839982762067386,
      long: -43.95080005999862,
    },
    to: {
      lat: -19.837812973735687,
      long: -43.94836456508952
    }
  }

  await requestRide.execute(inputRequestRide)
  await expect(() => requestRide.execute(inputRequestRide))
    .rejects.toThrow(new Error('This passenger already has a not completed'))
})


test("Não deve aceitar uma corrida se a account não for driver", async function () {
  const inputSignupPassenger: any = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "95818705552",
		isPassenger: true
	}
	const outputSignupPassenger = await signup.execute(inputSignupPassenger);

  const inputSignupDriver: any = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "95818705552",
		isPassenger: true,
	}
	const outputSignupDriver = await signup.execute(inputSignupDriver);

  const inputRequestRide = {
    passengerId: outputSignupPassenger.accountId,
    from: {
      lat: -19.839982762067386,
      long: -43.95080005999862,
    }, 
    to: {
      lat: -19.837812973735687,
      long: -43.94836456508952
    }
  }

  const outputRequestRide = await requestRide.execute(inputRequestRide)
  const inputAcceptRide = {
    rideId: outputRequestRide.rideId,
    driverId: outputSignupDriver.accountId,
  }
  await expect(() => acceptRide.execute(inputAcceptRide))
    .rejects.toThrow('Account is not from a driver')
})