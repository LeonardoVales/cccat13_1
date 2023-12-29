import crypto from 'crypto'
import RideDAO from './RideDAO'
import RideDAODatabase from './RideDAODatabase'

export default class RideService {
  //inversão de dependência
  constructor(readonly rideDAO: RideDAO = new RideDAODatabase()) {

  }

  async requestRide(input: any) {
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
}