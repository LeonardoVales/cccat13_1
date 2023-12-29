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
    passangerId: outputSignup.accountId,
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

test.only("Deve solicitar e consultar uma corrida", async function () {
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
  expect(outputGetRide.date).toBeDefined()
})