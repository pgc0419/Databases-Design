import express from 'express';
import { selectSql, createSql, updateSql, deleteSql } from '../../database/sql';

const router = express.Router();

router.get('/admin/control/flightLeg', async function (req, res) {
    const flightLeg_res = await selectSql.getFlightLeg();
    res.render('controlFlightLeg', {
        main_title: "Control FlightLeg table",
        flightLeg_res,
    });
});

router.post('/admin/control/flightLeg/add', async function (req, res) {
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
    res.redirect('/admin/control/flightLeg');
});

router.post('/admin/control/flightLeg/update', async function (req, res) {
    const vars = req.body;
    const data = {
        Flight_number: vars.flight_number,
        Leg_number: vars.leg_number,
        Departure_airport_code: vars.departure_airport_code,
        Scheduled_departure_time: vars.scheduled_departure_time,
        Arrival_airport_code: vars.arrival_airport_code,
        Scheduled_arrival_time: vars.scheduled_arrival_time,
    }
    await updateSql.updateFlightLeg(data);
    res.redirect('/admin/control/flightLeg');
});

router.post('/admin/control/flightLeg/delete', async function (req, res) {
    const vars = req.body;
    const id = vars.leg_number;
    await deleteSql.deleteFlightLeg(id);
    res.redirect('/admin/control/flightLeg');
});