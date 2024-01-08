import Ride from "../../src/domain/Ride"


test('Deve criar uma ride', () => {
  const ride = Ride.create('', 0, 0, 0, 0)
  expect(ride.rideId).toBeDefined()
})