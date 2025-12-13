import express from 'express';
import { selectSql, createSql, updateSql, deleteSql } from '../../database/sql';

const router = express.Router();

router.get('/admin/control/legInstance', async function (req, res) {
    const legInstance_res = await selectSql.getLegInstance();
    res.render('controlLegInstance', {
        main_title: "Control LegInstance table",
        legInstance_res,
    });
});

router.post('/admin/control/legInstance/add', async function (req, res) {
    const vars = req.body;
    const data = {
        flight_number: vars.flight_number,
        leg_number: vars.leg_number,
        Date: vars.date,
        Number_of_available_seats: vars.number_of_available_seats,
        Airplane_id: vars.airplane_id,
        Departure_airport_code: vars.departure_airport_code,
        Departure_time: vars.departure_time,
        Arrival_airport_code: vars.arrival_airport_code,
        Arrival_time: vars.arrival_time,
    }
    await createSql.addLegInstance(data);
    res.redirect('/admin/control/legInstance');
});

router.post('/admin/control/legInstance/update', async function (req, res) {
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
    res.redirect('/admin/control/legInstance');
});

router.post('/admin/control/legInstance/delete', async function (req, res) {
    const vars = req.body;
    const id = vars.leg_number;
    await deleteSql.deleteLegInstance(id);
    res.redirect('/admin/control/legInstance');
});

module.exports = router;