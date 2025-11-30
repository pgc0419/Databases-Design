import mysql from "mysql2";

const pool = mysql.createPool(
  process.env.JAWSDB_URL ?? {
    host: 'localhost',
    user: 'root',
    database: 'finalproject',
    password: '0000',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  }
);

const promisePool = pool.promise();

export const selectSql = {
  getUser: async () => {
    const sql = `select * from user`;
    const [result] = await promisePool.query(sql);
    return result;
  },

  getAirport: async () => {
    const sql = `
      SELECT
        a.Airport_code,
        a.Name,
        a.City,
        a.State,
        at.Airplane_type_name,
        at.Max_seats,
        at.Company
      FROM airport a
      JOIN can_land cl ON a.Airport_code = cl.Airport_code
      JOIN airplane_type at ON cl.Airplane_type_name = at.Airplane_type_name
    `;
    const [result] = await promisePool.query(sql);
    return result;
  },

  getAirplane: async () => {
    const sql = `
      SELECT
        ap.Airplane_id,
        ap.Total_number_of_seats,
        ap.Airplane_type,
        at.Company
      FROM airplane ap
      JOIN airplane_type at ON at.airplane_type_name = ap.Airplane_type
    `;
    const [result] = await promisePool.query(sql);
    return result;
  },

  getFlight: async () => {
    const sql = `
      SELECT
        f.Flight_number,
        f.Airline,
        f.Weekdays,
        fa.Fare_code,
        fa.Amount,
        fa.Restrictions
      FROM flight f
      JOIN fare fa ON fa.Flight_number = f.Flight_number
    `;
    const [result] = await promisePool.query(sql);
    return result;
  },

  getFlightLeg: async (flight_number) => {
    const sql = `
      SELECT 
        Leg_number,
        Departure_airport_code,
        Scheduled_departure_time,
        Arrival_airport_code,
        Scheduled_arrival_time
      FROM flight_leg
      WHERE Flight_number = ?
    `;
    const [result] = await promisePool.query(sql, [flight_number]);
    return result;
  },

  getLegInstance: async (leg_number, airplane_id) => {
    const sql = `
      SELECT
        Date,
        Number_of_available_seats,
        Airplane_id,
        Departure_airport_code,
        Departure_time,
        Arrival_airport_code,
        Arrival_time
      FROM leg_instance
      WHERE Leg_number = ? and Airplane_id = ?
    `;
    const [result] = await promisePool.query(sql, [leg_number, airplane_id]);
    return result;
  },

  getSeatReservation: async(date, user_id) => {
    const sql = `
      SELECT
        Seat_number,
        Customer_name,
        Customer_phone,
        User_id
      FROM seat_reservation
      WHERE Date = ? and User_id = ?
    `;
    const [result] = await promisePool.query(sql, [date, user_id]);
    return result;
  }
}

export const createSql = {

}

export const updateSql = {

}

export const deleteSql = {
    
}