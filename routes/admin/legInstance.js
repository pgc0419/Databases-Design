import express from 'express';
import { selectSql, createSql, updateSql, deleteSql } from '../../database/sql';

const router = express.Router();

router.get('/', async function (req, res) {
    const legInstance_res = await selectSql.getLegInstance();
    res.render('legInstance', {
        main_title: "Control LegInstance table",
        legInstance_res,
    });
});

router.post('/', async function (req, res) {
    if (req.body._method === 'PUT') {
        const vars = req.body;
        const data = {
            Flight_number: vars.flight_number,
            Leg_number: vars.leg_number,
            Date: vars.date,
            Number_of_available_seats: vars.number_of_available_seats,
            Airplane_id: vars.airplane_id,
            Departure_airport_code: vars.departure_airport_code,
            Departure_time: vars.departure_time,
            Arrival_airport_code: vars.arrival_airport_code,
            Arrival_time: vars.arrival_time,
        }
        await updateSql.updateLegInstance(data);
        res.redirect('/legInstance');
    }

    if (req.body._method === 'DELETE') {
        const vars = req.body;
        const id = vars.date;
        await deleteSql.deleteLegInstance(id);
        res.redirect('/legInstance');
    }

    const vars = req.body;
    const data = {
        Flight_number: vars.flight_number,
        Leg_number: vars.leg_number,
        Date: vars.date,
        Number_of_available_seats: vars.number_of_available_seats,
        Airplane_id: vars.airplane_id,
        Departure_airport_code: vars.departure_airport_code,
        Departure_time: vars.departure_time,
        Arrival_airport_code: vars.arrival_airport_code,
        Arrival_time: vars.arrival_time,
    }
    await createSql.addLegInstance(data);
    res.redirect('/legInstance');
});

module.exports = router;