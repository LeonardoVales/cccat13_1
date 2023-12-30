import crypto from 'crypto'
import RideDAO from './RideDAO'
import RideDAODatabase from './RideDAODatabase'
import AccountDAO from './AccountDAO'
import AccountDAODatabase from './AccountDAODatabase'

export default class RideService {
  //inversão de dependência
  constructor(
    readonly rideDAO: RideDAO = new RideDAODatabase(),
    readonly accountDAO: AccountDAO = new AccountDAODatabase()
  ) {

  }

  async requestRide(input: any) {
    const account = await this.accountDAO.getById(input.passengerId)
    if (!account.is_passenger) {
      throw new Error('Account is not from a passenger')
    }
    const activeRides = await this.rideDAO.getActiveRidesByPassengerId(input.passengerId)
    if (activeRides.length > 0) {
      throw new Error('This passenger already has a not completed')
    }

    const rideId = crypto.randomUUID()
    const ride = {
      rideId,
      passengerId: input.passengerId,
      status: "requested",
      date: new Date(),
      from: {
        lat: input.from.lat,
        long: input.from.long,
      },
      to: {
        lat: input.to.lat,
        long: input.to.long,
      }
    }

    await this.rideDAO.save(ride)
    return {
      rideId
    }
  }

  async getRide(rideId: string) {
    const ride = await this.rideDAO.getById(rideId)
    // console.log('aqui', ride)
    return ride
  }

  async acceptRide (input: any) {
    const ride = await this.getRide(input.rideId)
    // console.log(ride)
    ride.driverId = input.driverId
    ride.rideId = input.rideId
    ride.status = 'accepted'
    // console.log(ride)
    await this.rideDAO.update(ride)
  }
}