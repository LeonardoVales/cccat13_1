import Ride from "./Ride"

export default interface RideDAO {
  save(ride: Ride): Promise<void>
  update(ride: any): Promise<void>
  getById(rideId: string): Promise<Ride>
  getActiveRidesByPassengerId(passengerId: string): Promise<string>
  getActiveRidesByDriverId(driverId: string): Promise<string>
}