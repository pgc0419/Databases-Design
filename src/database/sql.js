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
  addAirport: async(data) => {
    const result = await promisePool.query(`INSERT INTO airport VALUES (${data.cId});`)
    return result[0];
  },

  addCanLand: async(data) => {
    const result = await promisePool.query(`INSERT INTO can_land VALUES (${data.cId});`)
    return result[0];
  },

  addAirplaneType: async(data) => {
    const result = await promisePool.query(`INSERT INTO airplane_type VALUES (${data.cId});`)
    return result[0];
  },

  addAirplane: async(data) => {
    const result = await promisePool.query(`INSERT INTO airplane VALUES (${data.cId});`)
    return result[0];
  },

  addFare: async(data) => {
    const result = await promisePool.query(`INSERT INTO fare VALUES (${data.cId});`)
    return result[0];
  },

  addFlight: async(data) => {
    const result = await promisePool.query(`INSERT INTO flight VALUES (${data.cId});`)
    return result[0];
  },

  addFlightLeg: async(data) => {
    const result = await promisePool.query(`INSERT INTO flight_leg VALUES (${data.cId});`)
    return result[0];
  },

  addLegInstance: async(data) => {
    const result = await promisePool.query(`INSERT INTO leg_instance VALUES (${data.cId});`)
    return result[0];
  },

  addSeatReservation: async(data) => {
    const result = await promisePool.query(`INSERT INTO seat_reservation VALUES (${data.cId});`)
    return result[0];
  },
}

export const updateSql = {
  updateAirport: async(data) => {
    const {Airport_code, Name, City, State} = data;
    const params = [Name, City, State, Airport_code];
    const sql = `
      UPDATE airport
      SET
        Name = ?,
        City = ?,
        State = ?
      WHERE
        Airport_code = ?;
    `;
    const [result] = await promisePool.query(sql, params);
    return result;
  },

  updateCanLand: async(data) => {
    const {Airplane_type_name, Airport_code} = data;
    const params = [Airplane_type_name, Airport_code];
    const sql = `
      UPDATE can_land
      SET
        Airplane_type_name = ?
      WHERE
        Airport_code = ?;
    `;
    const [result] = await promisePool.query(sql, params);
    return result;
  },

  updateAirplaneType: async(data) => {
    const {Airplane_type_name, Max_seats, Company} = data;
    const params = [Max_seats, Company, Airplane_type_name];
    const sql = `
      UPDATE airplane_type
      SET
        Max_seats = ?,
        Company = ?
      WHERE
        Airplane_type_name = ?;
    `;
    const [result] = await promisePool.query(sql, params);
    return result;
  },

  updateAirplane: async(data) => {
    const {Airplane_id, Total_number_of_seats, Airplane_type} = data;
    const params = [Total_number_of_seats, Airplane_type, Airplane_id];
    const sql = `
      UPDATE airplane
      SET
        Total_number_of_seats = ?,
        Airplane_type = ?
      WHERE
        Airplane_id = ?;
    `;
    const [result] = await promisePool.query(sql, params);
    return result;
  },

  updateFare: async(data) => {
    const {Flight_number, Fare_code, Amount, Restrictions} = data;
    const params = [Flight_number, Amount, Restrictions, Fare_code];
    const sql = `
      UPDATE fare
      SET
        Flight_number = ?,
        Amount = ?,
        Restrictions = ?
      WHERE
        Fare_code = ?;
    `;
    const [result] = await promisePool.query(sql, params);
    return result;
  },

  updateFlight: async(data) => {
    const {Flight_number, Airline, Weekdays} = data;
    const params = [Airline, Weekdays, Flight_number];
    const sql = `
      UPDATE flight
      SET
        Airline = ?,
        Weekdays = ?
      WHERE
        Flight_number = ?;
    `;
    const [result] = await promisePool.query(sql, params);
    return result;
  },

  updateFlightLeg: async(data) => {
    const {
      Flight_number, Leg_number, 
      Departure_airport_code, Scheduled_departure_time, 
      Arrival_airport_code, Scheduled_arrival_time
    } = data;
    const params = [
      Flight_number,
      Departure_airport_code, Scheduled_departure_time, 
      Arrival_airport_code, Scheduled_arrival_time,
      Leg_number
    ];
    const sql = `
      UPDATE flight_leg
      SET
        Flight_number = ?,
        Departure_airport_code = ?,
        Scheduled_departure_time,
        Arrival_airport_code,
        Scheduled_arrival_time
      WHERE
        Leg_number = ?;
    `;
    const [result] = await promisePool.query(sql, params);
    return result;
  },

  updateLegInstance: async(data) => {
    const {
      Flight_number, Leg_number, Date,
      Number_of_availabe_seats, Airplane_id,
      Departure_airport_code, Departure_time, 
      Arrival_airport_code, Arrival_time
    } = data;
    const params = [
      Flight_number, Leg_number, 
      Number_of_availabe_seats, Airplane_id,
      Departure_airport_code, Departure_time, 
      Arrival_airport_code, Arrival_time,
      Date
    ];
    const sql = `
      UPDATE leg_instance
      SET
        Flight_number = ?,
        Leg_number = ?,
        Number_of_availabe_seats = ?,
        Airplane_id = ?,
        Departure_airport_code = ?,
        Departure_time,
        Arrival_airport_code,
        Arrival_time
      WHERE
        Date = ?;
    `;
    const [result] = await promisePool.query(sql, params);
    return result;
  },

  updateSeatReservation: async(data) => {
    const {
      Flight_number, Leg_number, Date,
      Seat_number, Customer_name, Customer_phone,
      User_id
    } = data;
    const params = [
      Flight_number, Leg_number, Date,
      Customer_name, Customer_phone, User_id,
      Seat_number
    ];
    const sql = `
      UPDATE flight_leg
      SET
        Flight_number = ?,
        Leg_number = ?,
        Date = ?,
        Customer_name = ?,
        Customer_phone = ?,
        User_id = ?
      WHERE
        Seat_number;
    `;
    const [result] = await promisePool.query(sql, params);
    return result;
  },
}

export const deleteSql = {
    
}