import RideDAO from '../repository/RideDAO'

type Input = {
  rideId: string,
}

export default class StartRide {
  //inversão de dependência
  constructor(
    readonly rideDAO: RideDAO,
  ) {

  }
  
  async execute (input: Input) {
    const ride = await this.rideDAO.getById(input.rideId)
    ride.start()

    await this.rideDAO.update(ride)
  }
}