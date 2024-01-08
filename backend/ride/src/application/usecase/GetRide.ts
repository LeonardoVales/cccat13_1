import RideDAO from '../repository/RideDAO'
import RideDAODatabase from '../../infra/repository/RideDAODatabase'

export default class GetRide {
  //inversão de dependência
  constructor(
    readonly rideDAO: RideDAO,
  ) {

  }

  async execute(rideId: string) {
    const ride = await this.rideDAO.getById(rideId)
    return ride
  }
}