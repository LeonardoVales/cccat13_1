import RideRepository from '../repository/RideRepository'
import AccountRepository from '../repository/AccountRepository'
import Ride from '../../domain/Ride'
import RepositoryFactory from '../factory/RepositoryFactory'

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

  private readonly rideRepository: RideRepository
  private readonly accountRepository: AccountRepository

  //inversão de dependência
  constructor(readonly repositoryFactory: RepositoryFactory) {
    this.accountRepository = repositoryFactory.createAccountRepository()
    this.rideRepository = repositoryFactory.createRideRepository()
  }

  async execute(input: Input) {
    // Essa validação aqui não deve ficar dentro da Ride
    // Pois eu não tenho account dentro da Ride.
    // Isso aqui sim é uma regra do useCase
    const account = await this.accountRepository.getById(input.passengerId)
    if (!account?.isPassenger) {
      throw new Error('Account is not from a passenger')
    }

    //Essa regra também não é responsabilidade da Ride
    // A ride não tem que saber se existem outras corridas ou não
    const activeRides = await this.rideRepository.getActiveRidesByPassengerId(input.passengerId)
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

    await this.rideRepository.save(ride)
    return {
      rideId: ride.rideId,
    }
  }

  
}