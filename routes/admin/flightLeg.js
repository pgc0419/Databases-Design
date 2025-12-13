import express from 'express';
import { selectSql, createSql, updateSql, deleteSql } from '../../database/sql';

const router = express.Router();

router.get('/', async function (req, res) {
    const flightLeg_res = await selectSql.getFlightLeg();
    res.render('flightLeg', {
        main_title: "Control FlightLeg table",
        flightLeg_res,
    });
});

router.post('/', async function (req, res) {
    if (req.body._method === 'PUT') {
        const vars = req.body;
        const data = {
            Flight_number: vars.flight_number,
            Leg_number: vars.leg_number,
            Departure_airport_code: vars.departure_airport_code,
            Scheduled_departure_time: vars.scheduled_departure_time,
            Arrival_airport_code: vars.arrival_airport_code,
            Scheduled_arrival_time: vars.scheduled_arrival_time,
        }
        console.log(vars.departure_airport_code);
        console.log(vars.arrival_airport_code);
        console.log(data.Arrival_airport_code);
        console.log(data.Departure_airport_code);
        await updateSql.updateFlightLeg(data);
        res.redirect('/flightLeg');
    }
    if (req.body._method === 'DELETE') {
        const vars = req.body;
        const id = vars.leg_number;
        await deleteSql.deleteFlightLeg(id);
        res.redirect('/flightLeg');
    }

    const vars = req.body;
    const data = {
        flight_number: vars.flight_number,
        leg_number: vars.leg_number,
        Departure_airport_code: vars.departure_airport_code,
        Scheduled_departure_time: vars.scheduled_departure_time,
        Arrival_airport_code: vars.arrival_airport_code,
        Scheduled_arrival_time: vars.scheduled_arrival_time,
    }
    await createSql.addFlightLeg(data);
    res.redirect('/flightLeg');
});

module.exports = router;