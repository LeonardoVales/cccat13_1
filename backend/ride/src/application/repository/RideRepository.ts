import Ride from "../../domain/Ride"

// Na arquitetura limpa, isso é um interface adapter
export default interface RideRepository {
  save(ride: Ride): Promise<void>
  update(ride: Ride): Promise<void>
  getById(rideId: string): Promise<Ride>
  getActiveRidesByPassengerId(passengerId: string): Promise<string>
  getActiveRidesByDriverId(driverId: string): Promise<string>
}