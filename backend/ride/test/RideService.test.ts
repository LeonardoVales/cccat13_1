import AccountService from "../src/AccountService";
import RideService from "../src/RideService";

test("Deve solicitar uma corrida e receber uma rideId", async function () {
  const inputSignup: any = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "95818705552",
		isPassenger: true
	}

	const accountService = new AccountService();
	const outputSignup = await accountService.signup(inputSignup);

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
  const rideService = new RideService()
  const outputRequestRide = await rideService.requestRide(inputRequestRide)
  expect(outputRequestRide.rideId).toBeDefined()
})

test("Deve solicitar e consultar uma corrida", async function () {
  const inputSignup: any = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "95818705552",
		isPassenger: true
	}

	const accountService = new AccountService();
	const outputSignup = await accountService.signup(inputSignup);
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

  const rideService = new RideService()
  const outputRequestRide = await rideService.requestRide(inputRequestRide)
  const outputGetRide = await rideService.getRide(outputRequestRide.rideId)

  expect(outputGetRide.status).toBe("requested")
  expect(outputGetRide.passenger_id).toBe(outputSignup.accountId)
  expect(parseFloat(outputGetRide.from_lat)).toBe(inputRequestRide.from.lat)
  expect(outputGetRide.date).toBeDefined()
})

test("Deve solicitar uma corrida e aceitar uma corrida", async function () {
  const accountService = new AccountService();

  const inputSignupPassenger: any = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "95818705552",
		isPassenger: true
	}
	const outputSignupPassenger = await accountService.signup(inputSignupPassenger);

  const inputSignupDriver: any = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "95818705552",
		isDriver: true,
    carPlate: 'AAA9999'
	}
	const outputSignupDriver = await accountService.signup(inputSignupDriver);


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

  const rideService = new RideService()
  const outputRequestRide = await rideService.requestRide(inputRequestRide)
  const inputAcceptRide = {
    rideId: outputRequestRide.rideId,
    driverId: outputSignupDriver.accountId,
  }
  await rideService.acceptRide(inputAcceptRide)
  const outputGetRide = await rideService.getRide(outputRequestRide.rideId)
  expect(outputGetRide.status).toBe('accepted')
  expect(outputGetRide.driver_id).toBe(outputSignupDriver.accountId)

})

test("Caso uma corrida seja solicitada por uma conta que não seja de passageiro deve lançar um erro", async function () {
  const inputSignup: any = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "95818705552",
		isDriver: true,
    carPlate: 'AAA9999'
	}

	const accountService = new AccountService();
	const outputSignup = await accountService.signup(inputSignup);

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
  const rideService = new RideService()
  await expect(() => rideService.requestRide(inputRequestRide))
    .rejects.toThrow(new Error('Account is not from a passenger'))
})

test("Caso uma corrida seja solicitada por um passageiro e ele já tenha outra corrida em andamento deve lançar um erro", async function () {
  const inputSignup: any = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "95818705552",
		isPassenger: true,
	}

	const accountService = new AccountService();
	const outputSignup = await accountService.signup(inputSignup);

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
  const rideService = new RideService()
  await rideService.requestRide(inputRequestRide)
  await expect(() => rideService.requestRide(inputRequestRide))
    .rejects.toThrow(new Error('This passenger already has a not completed'))
})


test("Não deve aceitar uma corrida se a account não for driver", async function () {
  const accountService = new AccountService();

  const inputSignupPassenger: any = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "95818705552",
		isPassenger: true
	}
	const outputSignupPassenger = await accountService.signup(inputSignupPassenger);

  const inputSignupDriver: any = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "95818705552",
		isPassenger: true,
	}
	const outputSignupDriver = await accountService.signup(inputSignupDriver);

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

  const rideService = new RideService()
  const outputRequestRide = await rideService.requestRide(inputRequestRide)
  const inputAcceptRide = {
    rideId: outputRequestRide.rideId,
    driverId: outputSignupDriver.accountId,
  }
  await expect(() => rideService.acceptRide(inputAcceptRide))
    .rejects.toThrow('Account is not from a driver')
})