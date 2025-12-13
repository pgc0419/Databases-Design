import express from 'express';
import { selectSql, createSql, updateSql, deleteSql } from '../../database/sql';

const router = express.Router();

router.get('/admin/control/flight', async function (req, res) {
    const flight_res = await selectSql.getFlight();
    res.render('controlFlight', {
        main_title: "Control Flight table",
        flight_res,
    });
});

router.post('/admin/control/flight/add', async function (req, res) {
    const vars = req.body;
    const data = {
        Flight_number: vars.flight_number,
        Airline: vars.airline,
        Weekdays: vars.weekdats,
    }
    await createSql.addFlight(data);
    res.redirect('/admin/control/flight');
});

router.post('/admin/control/flight/update', async function (req, res) {
    const vars = req.body;
    const data = {
        Flight_number: vars.flight_number,
        Airline: vars.airline,
        Weekdays: vars.weekdats,
    }
    await updateSql.updateFlight(data);
    res.redirect('/admin/control/flight');
});

router.post('/admin/control/flight/delete', async function (req, res) {
    const vars = req.body;
    const id = vars.flight_number;
    await deleteSql.deleteFlight(id);
    res.redirect('/admin/control/flight');
});

module.exports = router;