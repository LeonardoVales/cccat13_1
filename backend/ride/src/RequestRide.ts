import RideDAO from './RideDAO'
import RideDAODatabase from './RideDAODatabase'
import AccountDAO from './AccountDAO'
import AccountDAODatabase from './AccountDAODatabase'
import Ride from './Ride'

// Um contrato de entrada
type Input = {
  passengerId: string,
  from: {
    lat: number,
    long: number,
  },
  to: {
    lat: number,
    long: number,
  }
}

export default class RequestRide {
  //inversão de dependência
  constructor(
    readonly rideDAO: RideDAO = new RideDAODatabase(),
    readonly accountDAO: AccountDAO = new AccountDAODatabase()
  ) {

  }

  async execute(input: Input) {
    // Essa validação aqui não deve ficar dentro da Ride
    // Pois eu não tenho account dentro da Ride.
    // Isso aqui sim é uma regra do useCase
    const account = await this.accountDAO.getById(input.passengerId)
    if (!account?.isPassenger) {
      throw new Error('Account is not from a passenger')
    }

    //Essa regra também não é responsabilidade da Ride
    // A ride não tem que saber se existem outras corridas ou não
    const activeRides = await this.rideDAO.getActiveRidesByPassengerId(input.passengerId)
    if (activeRides.length > 0) {
      throw new Error('This passenger already has a not completed')
    }

    const ride = Ride.create(
      input.passengerId, 
      input.from.lat, 
      input.from.long, 
      input.to.lat, 
      input.to.long
    )

    await this.rideDAO.save(ride)
    return {
      rideId: ride.rideId,
    }
  }

  
}