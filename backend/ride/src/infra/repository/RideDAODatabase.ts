// resource
// adapter
import Connection from "../database/Connection";
import Ride from "../../domain/Ride";
import RideDAO from "../../application/repository/RideDAO";
import Position from "../../domain/Position";
import Coord from "../../domain/Coord";

export default class RideDAODatabase implements RideDAO {
  constructor(readonly connection: Connection) {

  }

  async save(ride: Ride) {
    await this.connection.query(
      "insert into cccat13.ride (ride_id, passenger_id, from_lat, from_long, to_lat, to_long, status, date) values ($1, $2, $3, $4, $5, $6, $7, $8)",
      [ride.rideId, ride.passengerId, ride.from.getLat(), ride.from.getLong(), ride.to.getLat(), ride.to.getLong(), ride.getStatus(), ride.date]
    );
  }

  async update(ride: any) {
    await this.connection.query(
      "update cccat13.ride set driver_id = $1, status = $2, distance = $3 where ride_id = $4",
      [ride.driverId, ride.status.getStatus(), ride.getDistance(), ride.rideId]
    );
    // for (const position of ride.positions) {
    //   await this.connection.query("insert into cccat13.position (position_id, ride_id, lat, long, date) values ($1, $2, $3, $4, $5) on conflict do nothing", [
    //     position.positionId, ride.rideId, position.coord.getLat(), position.coord.getLong(), position.date
    //   ])
    // }
  }

  async getById(rideId: string) {
    const [rideData] = await this.connection.query("select * from cccat13.ride where ride_id = $1", [rideId]);
    const ride = Ride.restore(
      rideData.ride_id,
      rideData.passenger_id,
      rideData.driver_id,
      rideData.status,
      parseFloat(rideData.from_lat),
      parseFloat(rideData.from_long),
      parseFloat(rideData.to_lat),
      parseFloat(rideData.to_long),
      rideData.date,
      parseFloat(rideData.distance)
    )

    // const positionsData = await this.connection.query("select * from cccat13.position where ride_id = $1", [rideId])
    // for (const positionData of positionsData) {
    //   ride.positions.push(
    //     new Position(
    //       positionData.position_id,
    //       new Coord(parseFloat(positionData.lat), parseFloat(positionData.long)),
    //       positionData.date
    //     )
    //   )
    // }
    return ride
  }

  async getActiveRidesByPassengerId(passengerId: string) {
    const ridesData = await this.connection.query(
      "select * from cccat13.ride where passenger_id = $1 and status in ('requested', 'accepted', 'in_progress')",
      [passengerId]
    );
    return ridesData
  }

  async getActiveRidesByDriverId(driverId: string) {
    const ridesData = await this.connection.query(
      "select * from cccat13.ride where passenger_id = $1 and status in ('accepted', 'in_progress')",
      [driverId]
    );
    return ridesData
  }
}