// resource
// adapter
import pgp from "pg-promise";
import RideDAO from "./RideDAO";

export default class RideDAODatabase implements RideDAO {
  constructor() {

  }

  async save(ride: any) {
    const connection = pgp()("postgresql://getrak:getrak@localhost:5432/postgres");
    await connection.query(
      "insert into cccat13.ride (ride_id, passenger_id, from_lat, from_long, to_lat, to_long, status, date) values ($1, $2, $3, $4, $5, $6, $7, $8)",
      [ride.rideId, ride.passengerId, ride.from.lat, ride.from.long, ride.to.lat, ride.to.long, ride.status, ride.date]
    );
    await connection.$pool.end();
  }

  async update(ride: any) {
    const connection = pgp()("postgresql://getrak:getrak@localhost:5432/postgres");
    await connection.query(
      "update cccat13.ride set driver_id = $1, status = $2 where ride_id = $3",
      [ride.driverId, ride.status, ride.rideId]
    );
    await connection.$pool.end();
  }

  async getById(rideId: string) {
    const connection = pgp()("postgresql://getrak:getrak@localhost:5432/postgres");
    const [rideData] = await connection.query("select * from cccat13.ride where ride_id = $1", [rideId]);
    await connection.$pool.end();

    return rideData
  }

  async getActiveRidesByPassengerId(passengerId: string) {

    // try {
    //   const connection = pgp()("postgresql://getrak:getrak@localhost:5432/postgres");
    //   const ridesData = await connection.query(
    //     "select * from cccat13.ride where passenger_id = $1 and status in ('requested', 'accepted', 'in_progress')",
    //     [passengerId]
    //   );
    //   await connection.$pool.end();
      
    //   return ridesData
    // } catch(e) {
    //   console.log(e)
    // }

    const connection = pgp()("postgresql://getrak:getrak@localhost:5432/postgres");
    const ridesData = await connection.query(
      "select * from cccat13.ride where passenger_id = $1 and status in ('requested', 'accepted', 'in_progress')",
      [passengerId]
    );
    await connection.$pool.end();
    
    return ridesData
  }
}