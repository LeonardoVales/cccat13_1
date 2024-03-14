import PositionRepository from "../application/repository/PositionRepository";
import RideDAO from "../application/repository/RideRepository";

type Input = {
  rideId: string
}

export default class FinishRide {
  constructor(
    readonly rideDAO: RideDAO,
    readonly positionRepository: PositionRepository
  ) { }

  async execute(input: Input) {
    const ride = await this.rideDAO.getById(input.rideId)
    const positions = await this.positionRepository.getByRideId(input.rideId)
    ride.finish(positions)
    await this.rideDAO.update(ride)
  }
}