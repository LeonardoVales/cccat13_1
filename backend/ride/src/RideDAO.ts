import Ride from "./Ride"

// Na arquitetura limpa, isso é um interface adapter
export default interface RideDAO {
  save(ride: Ride): Promise<void>
  update(ride: any): Promise<void>
  getById(rideId: string): Promise<Ride>
  getActiveRidesByPassengerId(passengerId: string): Promise<string>
  getActiveRidesByDriverId(driverId: string): Promise<string>
}