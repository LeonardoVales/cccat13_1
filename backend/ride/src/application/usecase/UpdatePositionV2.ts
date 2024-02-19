import Position from "../../domain/Position";
import PositionRepository from "../repository/PositionRepository";
import RideDAO from "../repository/RideDAO";


export default class UpdatePositionV2 {
  constructor(
    readonly rideDAO: RideDAO,
    readonly positionRepository: PositionRepository
  ) {}

  async execute(input: Input) {

    // const ride = await this.rideDAO.getById(input.rideId)
    // ride.updatePosition(input.lat, input.long)
    // await this.rideDAO.update(ride)



    const ride = await this.rideDAO.getById(input.rideId)

    const position = Position.create(input.rideId, input.lat, input.long)
    await this.positionRepository.save(position)


  }
}

type Input = {
  rideId: string,
  lat: number,
  long: number,
}