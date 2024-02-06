// resource
// adapter
import pgp from "pg-promise";
import Connection from "../database/Connection";
import Ride from "../../domain/Ride";
import RideDAO from "../../application/repository/RideDAO";

export default class RideDAODatabase implements RideDAO {
  constructor(readonly connection: Connection) {

  }

  async save(ride: Ride) {
    // const connection = pgp()("postgresql://getrak:getrak@localhost:5432/postgres");
    await this.connection.query(
      "insert into cccat13.ride (ride_id, passenger_id, from_lat, from_long, to_lat, to_long, status, date) values ($1, $2, $3, $4, $5, $6, $7, $8)",
      [ride.rideId, ride.passengerId, ride.from.getLat(), ride.from.getLong(), ride.to.getLat(), ride.to.getLong(), ride.getStatus(), ride.date]
    );
    // await connection.$pool.end();
  }

  async update(ride: any) {
    // const connection = pgp()("postgresql://getrak:getrak@localhost:5432/postgres");
    await this.connection.query(
      "update cccat13.ride set driver_id = $1, status = $2 where ride_id = $3",
      [ride.driverId, ride.status.value, ride.rideId]
    );
    // await connection.$pool.end();
  }

  async getById(rideId: string) {
    // const connection = pgp()("postgresql://getrak:getrak@localhost:5432/postgres");
    const [rideData] = await this.connection.query("select * from cccat13.ride where ride_id = $1", [rideId]);
    // await connection.$pool.end();
    return Ride.restore(
      rideData.ride_id,
      rideData.passenger_id,
      rideData.driver_id,
      rideData.status,
      parseFloat(rideData.from_lat),
      parseFloat(rideData.from_long),
      parseFloat(rideData.to_lat),
      parseFloat(rideData.to_long),
      rideData.date,
    )
  }

  async getActiveRidesByPassengerId(passengerId: string) {
    // const connection = pgp()("postgresql://getrak:getrak@localhost:5432/postgres");
    const ridesData = await this.connection.query(
      "select * from cccat13.ride where passenger_id = $1 and status in ('requested', 'accepted', 'in_progress')",
      [passengerId]
    );
    // await connection.$pool.end();

    return ridesData
  }

  async getActiveRidesByDriverId(driverId: string) {
    // const connection = pgp()("postgresql://getrak:getrak@localhost:5432/postgres");
    const ridesData = await this.connection.query(
      "select * from cccat13.ride where passenger_id = $1 and status in ('accepted', 'in_progress')",
      [driverId]
    );
    // await connection.$pool.end();

    return ridesData
  }
}