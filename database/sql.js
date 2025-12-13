import mysql from 'mysql2';

require("dotenv").config();

const pool = mysql.createPool({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '0000',
    database: 'airline',
});

const promisePool = pool.promise();

export const selectSql = {
  getUser: async () => {
    const sql = `select * from user`;
    const [result] = await promisePool.query(sql);
    return result;
  },

  getUserByEmail: async (userEmail) => {
    const sql = `select * from user where email = ?`;
    const [result] = await promisePool.query(sql, [userEmail]);
    return result;
  },

  getAirportV: async () => {
    const sql = `SELECT * FROM airport_landing_v`;
    const [result] = await promisePool.query(sql);
    return result;
  },

  getAirplaneV: async () => {
    const sql = `SELECT * FROM airplane_detail_v`;
    const [result] = await promisePool.query(sql);
    return result;
  },

  getFlightV: async () => {
    const sql = `SELECT * FROM flight_fare_v`;
    const [result] = await promisePool.query(sql);
    return result;
  },

  getAirport: async () => {
    const sql = `SELECT * FROM airport`;
    const [result] = await promisePool.query(sql);
    return result;
  },

  getAirplane: async () => {
    const sql = `SELECT * FROM airplane`;
    const [result] = await promisePool.query(sql);
    return result;
  },

  getAirplaneType: async () => {
    const sql = `SELECT * FROM airplane_type`;
    const [result] = await promisePool.query(sql);
    return result;
  },

  getCanLand: async () => {
    const sql = `SELECT * FROM can_land`;
    const [result] = await promisePool.query(sql);
    return result;
  },

  getFlight: async () => {
    const sql = `SELECT * FROM flight`;
    const [result] = await promisePool.query(sql);
    return result;
  },

  getFare: async () => {
    const sql = `SELECT * FROM fare`;
    const [result] = await promisePool.query(sql);
    return result;
  },

  getFlightLeg: async () => {
    const sql = `SELECT * FROM flight_leg`;
    const [result] = await promisePool.query(sql);
    return result;
  },

  getLegInstance: async () => {
    const sql = `SELECT * FROM Leg_instance`;
    const [result] = await promisePool.query(sql);
    return result;
  },

  getSeatReservation: async(user_id) => {
    const sql = `
      SELECT
        sr.Flight_number,
        sr.Leg_number,
        sr.Date,
        sr.Seat_number,
        u.Name,
        u.Phone,
        sr.User_id
      FROM seat_reservation sr
      JOIN user u ON u.user_id = sr.User_id
      JOIN leg_instance l ON l.date = sr.date
      WHERE u.User_id = ?
    `;
    const [result] = await promisePool.query(sql, [user_id]);
    return result;
  }
}

export const createSql = {
  addAirport: async(data) => {
    const sql = `INSERT INTO airport VALUES (?, ?, ?, ?)`;
    const [result] = await promisePool.query(sql, [data.Airport_code, data.Name, data.City, data.State]);
    return result[0];
  },

  addAirplaneType: async(data) => {
    const sql = `INSERT INTO airplane_type VALUES (?, ?, ?)`;
    const [result] = await promisePool.query(sql, [data.Airplane_type_name, data.Max_seats, data.Company]);
    return result[0];
  },

  addCanLand: async(data) => {
    const {airplane_type_name, airport_code} = data;
    try {
      const [typeCheck] = await promisePool.query(
        `SELECT COUNT(*) AS count FROM airplane_type WHERE airplane_type_name = ?`, [airplane_type_name]
      );
      if (typeCheck[0].count == 0) {
        throw new Error(`Error: Airplane Type does not exist`)
      }

      const [airportCheck] = await promisePool.query(
        `SELECT COUNT(*) AS count FROM airport WHERE airport_code = ?`, [airport_code]
      );
      if (airportCheck[0].count == 0) {
        throw new Error(`Error: Airport Code does not exist`)
      }

      const [result] = await promisePool.query(
        `INSERT INTO can_land VALUES (?, ?)`, [airplane_type_name, airport_code]
      );

      return result;
    } catch (error) {
      throw error;
    }
  },

  addAirplane: async(data) => {
    const {airplane_id, Total_number_of_seats, airplane_type} = data;
    try {
      const [typeCheck] = await promisePool.query(
        `SELECT COUNT(*) AS count FROM airplane_type WHERE airplane_type_name = ?`, [airplane_type]
      );
      if (typeCheck[0].count == 0) {
        throw new Error(`Error: Airplane Type does not exist`)
      }

      const [seatsCheck] = await promisePool.query(
        `SELECT max_seats AS seats FROM airplane_type WHERE airplane_type_name = ?`, [airplane_type]
      );
      if (seatsCheck[0].seats != Total_number_of_seats) {
        throw new Error(`Error: seats does not match`)
      }

      const [result] = await promisePool.query(
        `INSERT INTO airplane VALUES (?, ?, ?)`, [airplane_id, Total_number_of_seats, airplane_type]
      );

      return result;
    } catch (error) {
      throw error;
    }
  },

  addFlight: async(data) => {
    const sql = `INSERT INTO flight VALUES (?, ?, ?)`;
    const [result] = await promisePool.query(sql, [data.Flight_number, data.Airline, data.Weekdays]);
    return result[0];
  },

  addFare: async(data) => {
    const {Flight_number, Fare_code, Amount, Restrictions} = data;
    try {
      const [numCheck] = await promisePool.query(
        `SELECT COUNT(*) AS count FROM flight WHERE flight_number = ?`, [Flight_number]
      );
      if (numCheck[0].count == 0) {
        throw new Error(`Error: addFare flight number does not exist`)
      }

      const [result] = await promisePool.query(
        `INSERT INTO fare VALUES (?, ?, ?, ?)`, [Flight_number, Fare_code, Amount, Restrictions]
      );

      return result;
    } catch (error) {
      throw error;
    }
  },

  addFlightLeg: async(data) => {
    const {
      flight_number, leg_number, 
      Departure_airport_code, Scheduled_departure_time, 
      Arrival_airport_code, Scheduled_arrival_time
    } = data;

    try {
      const [numCheck] = await promisePool.query(
        `SELECT COUNT(*) AS count FROM flight WHERE flight_number = ?`, [flight_number]
      );
      if (numCheck[0].count == 0) {
        throw new Error(`Error: addFlightLeg flight number does not exist`)
      }

      const [airportCheck1] = await promisePool.query(
        `SELECT COUNT(*) AS count FROM airport WHERE airport_code = ?`, [Departure_airport_code]
      );
      const [airportCheck2] = await promisePool.query(
        `SELECT COUNT(*) AS count FROM airport WHERE airport_code = ?`, [Arrival_airport_code]
      );
      if (airportCheck1[0].count == 0 || airportCheck2[0].count == 0) {
        throw new Error(`Error: Airport Code does not exist`)
      }

      const [result] = await promisePool.query(
        `INSERT INTO flight_leg VALUES (?, ?, ?, ?, ?, ?)`, [
          flight_number, leg_number, 
          Departure_airport_code, Scheduled_departure_time, 
          Arrival_airport_code, Scheduled_arrival_time
        ]
      );

      return result;
    } catch (error) {
      throw error;
    }
  },

  addLegInstance: async(data) => {
    const {
      Flight_number, Leg_number, Date,
      Number_of_available_seats, Airplane_id,
      Departure_airport_code, Departure_time, 
      Arrival_airport_code, Arrival_time
    } = data;

    try {

      const [seatsCheck] = await promisePool.query(
        `SELECT total_number_of_seats AS seats FROM airplane WHERE airplane_id = ?`, [Airplane_id]
      );
      if (seatsCheck[0].seats < Number_of_available_seats) {
        throw new Error(`Error: seats are too many`)
      }

      const [airportCheck1] = await promisePool.query(
        `SELECT COUNT(*) AS count FROM airport WHERE airport_code = ?`, [Departure_airport_code]
      );
      const [airportCheck2] = await promisePool.query(
        `SELECT COUNT(*) AS count FROM airport WHERE airport_code = ?`, [Arrival_airport_code]
      );
      if (airportCheck1[0].count == 0 || airportCheck2[0].count == 0) {
        throw new Error(`Error: Airport Code does not exist`)
      }

      const [result] = await promisePool.query(
        `INSERT INTO leg_instance VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
          Flight_number, Leg_number, Date,
          Number_of_available_seats, Airplane_id,
          Departure_airport_code, Departure_time, 
          Arrival_airport_code, Arrival_time
        ]
      );

      return result;
    } catch (error) {
      throw error;
    }
  },
}

// 좌석 예약
export const callTransaction = {
    bookSeat: async (data) => {
      const {Flight_number, Leg_number, Date, Seat_number, User_id} = data;
      const sql = `CALL P_BOOK_SEAT(?, ?, ?, ?, ?)`;
      const [result] = await promisePool.query(sql, [
        Flight_number, Leg_number, Date, Seat_number, User_id
      ]);

      return result[0];
    },
    // update transaction
    updateSeatReservation: async (data) => {
        const {
            Flight_number, Leg_number, Date, 
            Seat_number, User_id
        } = data;
        
        let connection;
        try {
            connection = await pool.getConnection();
            await connection.beginTransaction();

            await connection.query(
                `UPDATE LEG_INSTANCE
                 SET Number_of_available_seats = Number_of_available_seats + 1
                 WHERE Flight_number = ? AND Leg_number = ? AND Date = ?`,
                [Flight_number, Leg_number, Date]
            );
            
            const [newResult] = await connection.query(
                `UPDATE LEG_INSTANCE
                 SET Number_of_available_seats = Number_of_available_seats - 1
                 WHERE Flight_number = ? AND Leg_number = ? AND Date = ?
                   AND Number_of_available_seats > 0`,
                [Flight_number, Leg_number, Date]
            );

            if (newResult.affectedRows === 0) {
                throw new Error('Reservation update failed: New seat is not available.');
            }

            await connection.query(
                `DELETE FROM SEAT_RESERVATION
                 WHERE Flight_number = ? AND Leg_number = ? AND Date = ? AND Seat_number = ? AND User_id = ?`,
                [Flight_number, Leg_number, Date, Seat_number, User_id]
            );

            await connection.query(
                `INSERT INTO SEAT_RESERVATION (
                    Flight_number, Leg_number, Date, Seat_number, User_id
                ) VALUES (?, ?, ?, ?, ?)`,
                [
                    Flight_number, Leg_number, Date, Seat_number, User_id
                ]
            );

            await connection.commit();
            return { message: `Reservation successfully updated from seat to ${Seat_number}.` };

        } catch (error) {
            if (connection) {
                await connection.rollback();
            }
            throw new Error(`Transaction failed: ${error.message}`);
        } finally {
            if (connection) {
                connection.release();
            }
        }
    },
    deleteSeatReservation: async (data) => {
      const sql = `
        DELETE FROM seat_reservation
        WHERE
          Flight_number = ? AND
          Leg_number = ? AND
          Date = ? AND
          Seat_number = ?;
      `;
      const [result] = await promisePool.query(sql, [
        data.flight_number, 
        data.leg_number, 
        data.date, 
        data.seat_number
    ]);
    
      return result;
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

  // updateCanLand: async(data) => {
  //   const {Old_Airplane_type_name, Old_Airport_code, Airplane_type_name, Airport_code} = data;
  //   const [typeCheck] = await promisePool.query(
  //     `SELECT COUNT(*) AS count FROM airplane_type WHERE airplane_type_name = ?`, [Airplane_type_name]
  //   );
  //   if (typeCheck[0].count == 0) {
  //     throw new Error(`Error: Airplane Type does not exist`)
  //   }

  //   const [airportCheck] = await promisePool.query(
  //     `SELECT COUNT(*) AS count FROM airport WHERE airport_code = ?`, [Airport_code]
  //   );
  //   if (airportCheck[0].count == 0) {
  //     throw new Error(`Error: Airport Code does not exist`)
  //   }
  //   const params = [Old_Airplane_type_name, Old_Airport_code, Airplane_type_name, Airport_code];
  //   const sql = `
  //     UPDATE can_land
  //     SET
  //       Airplane_type_name = ?,
  //       Airport_code = ?
  //     WHERE
  //       Airplane_type_name = ? AND Airport_code = ?;
  //   `;
  //   const [result] = await promisePool.query(sql, params);
  //   return result;
  // },

  updateAirplane: async(data) => {
    const {Airplane_id, Total_number_of_seats, Airplane_type} = data;
    const [typeCheck] = await promisePool.query(
      `SELECT COUNT(*) AS count FROM airplane_type WHERE airplane_type_name = ?`, [Airplane_type]
    );
    if (typeCheck[0].count == 0) {
      throw new Error(`Error: Airplane Type does not exist`)
    }

    const [seatsCheck] = await promisePool.query(
      `SELECT max_seats AS seats FROM airplane_type WHERE airplane_type_name = ?`, [Airplane_type]
    );
    if (seatsCheck[0].seats != Total_number_of_seats) {
      throw new Error(`Error: seats does not match`)
    }
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
    const [numCheck] = await promisePool.query(
      `SELECT COUNT(*) AS count FROM flight WHERE flight_number = ?`, [Flight_number]
    );
    if (numCheck[0].count == 0) {
      throw new Error(`Error: New Flight number does not exist`);
    }
    const params = [Amount, Restrictions, Flight_number, Fare_code];
    const sql = `
      UPDATE fare
      SET
        Amount = ?,
        Restrictions = ?
      WHERE
        Flight_number = ? AND Fare_code = ?;
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
    const [numCheck] = await promisePool.query(
      `SELECT COUNT(*) AS count FROM flight WHERE flight_number = ?`, [Flight_number]
    );
    if (numCheck[0].count == 0) {
      throw new Error(`Error: New Flight number does not exist`);
    }
    const [airpotCheck1] = await promisePool.query (
      `SELECT COUNT(*) AS count FROM airport WHERE airport_code = ?`, [Departure_airport_code]
    );
    const [airpotCheck2] = await promisePool.query (
      `SELECT COUNT(*) AS count FROM airport WHERE airport_code = ?`, [Arrival_airport_code]
    );
    if (airpotCheck1[0].count == 0 || airpotCheck2[0].count == 0 ) {
      throw new Error(`Error: New Airport code does not exist`);
    }

    const params = [
      Departure_airport_code, Scheduled_departure_time, 
      Arrival_airport_code, Scheduled_arrival_time,
      Flight_number, Leg_number
    ];
    const sql = `
      UPDATE flight_leg
      SET
        Departure_airport_code = ?,
        Scheduled_departure_time = ?,
        Arrival_airport_code = ?,
        Scheduled_arrival_time = ?
      WHERE
        Flight_number = ? AND Leg_number = ?;
    `;
    const [result] = await promisePool.query(sql, params);
    return result;
  },

  updateLegInstance: async(data) => {
    const {
      Flight_number, Leg_number, Date,
      Number_of_available_seats, Airplane_id,
      Departure_airport_code, Departure_time, 
      Arrival_airport_code, Arrival_time
    } = data;
    const [numCheck1] = await promisePool.query(
      `SELECT COUNT(*) AS count FROM flight WHERE flight_number = ?`, [Flight_number]
    );
    const [numCheck2] = await promisePool.query(
      `SELECT COUNT(*) AS count FROM flight_leg WHERE leg_number = ?`, [Leg_number]
    );
    const [numCheck3] = await promisePool.query(
      `SELECT COUNT(*) AS count FROM airplane WHERE airplane_id = ?`, [Airplane_id]
    );
    if (numCheck1[0].count == 0 || numCheck2[0].count == 0 || numCheck3[0].count == 0 ) {
      throw new Error(`Error: FK does not exist`)
    }

    const [seatsCheck] = await promisePool.query(
      `SELECT total_number_of_seats AS seats FROM airplane WHERE airplane_id = ?`, [Airplane_id]
    );
    if (seatsCheck[0].seats < Number_of_available_seats) {
      throw new Error(`Error: seats are too many`)
    }

    const [airportCheck1] = await promisePool.query(
      `SELECT COUNT(*) AS count FROM airport WHERE airport_code = ?`, [Departure_airport_code]
    );
    const [airportCheck2] = await promisePool.query(
      `SELECT COUNT(*) AS count FROM airport WHERE airport_code = ?`, [Arrival_airport_code]
    );
    if (airportCheck1[0].count == 0 || airportCheck2[0].count == 0) {
      throw new Error(`Error: Airport Code does not exist`)
    }
    const params = [ 
      Number_of_available_seats, Airplane_id,
      Departure_airport_code, Departure_time, 
      Arrival_airport_code, Arrival_time,
      Flight_number, Leg_number, Date
    ];
    const sql = `
      UPDATE leg_instance
      SET
        Number_of_available_seats = ?,
        Airplane_id = ?,
        Departure_airport_code = ?,
        Departure_time = ?,
        Arrival_airport_code = ?,
        Arrival_time = ?
      WHERE
        Flight_number = ? AND  Leg_number = ? AND Date = ?;
    `;
    const [result] = await promisePool.query(sql, params);
    return result;
  },
}

export const deleteSql = {
  deleteAirport: async (id) => {
    const sql = `
      DELETE FROM airport WHERE airport_code = ?
    `;
    const [result] = await promisePool.query(sql, [id]);
    return result;
  },

  deleteAirplaneType: async (id) => {
    const sql = `
      DELETE FROM airplane_type WHERE airplane_type_name = ?
    `;
    const [result] = await promisePool.query(sql, [id]);
    return result;
  },

  deleteCanLand: async (airplane_type_name, airport_code) => {
    const sql = `
      DELETE FROM can_land WHERE airplane_type_name = ? and airport_code = ?
    `;
    const [result] = await promisePool.query(sql, [airplane_type_name, airport_code]);
    return result;
  },

  deleteAirplane: async (id) => {
    const sql = `
      DELETE FROM airplane WHERE airplane_id = ?
    `;
    const [result] = await promisePool.query(sql, [id]);
    return result;
  },

  deleteFare: async (id) => {
    const sql = `
      DELETE FROM fare WHERE fare_code = ?
    `;
    const [result] = await promisePool.query(sql, [id]);
    return result;
  },

  deleteFlight: async (id) => {
    const sql = `
      DELETE FROM Flight WHERE flight_number = ?
    `;
    const [result] = await promisePool.query(sql, [id]);
    return result;
  },

  deleteFlightLeg: async (id) => {
    const sql = `
      DELETE FROM flight_leg WHERE leg_number = ?
    `;
    const [result] = await promisePool.query(sql, [id]);
    return result;
  },

  deleteLegInstance: async (id) => {
    const sql = `
      DELETE FROM leg_instance WHERE date = ?
    `;
    const [result] = await promisePool.query(sql, [id]);
    return result;
  },
    
}