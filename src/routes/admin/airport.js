import express from 'express';
import { selectSql, createSql, updateSql, deleteSql } from '../../database/sql';

const router = express.Router();

router.get('/admin/control/airport', async function (req, res) {
    const airport_res = await selectSql.getAirpirt();
    res.render('controlAirport', {
        main_title: "Control Airport table",
        airport_res,
    });
});

router.post('/admin/control/airport/add', async function (req, res) {
    const vars = req.body;
    const data = {
        Airport_code: vars.airport_code,
        Name: vars.name,
        City: vars.city,
        State: vars.state,
    }
    await createSql.addAirport(data);
    res.redirect('/admin/control/airport');
});

router.post('/admin/control/airport/update', async function (req, res) {
    const vars = req.body;
    const data = {
        Airport_code: vars.airport_code,
        Name: vars.name,
        City: vars.city,
        State: vars.state,
    }
    await updateSql.addAirport(data);
    res.redirect('/admin/control/airport');
});

router.post('/admin/control/airport/delete', async function (req, res) {
    const vars = req.body;
    const id = vars.airport_code;
    await deleteSql.addAirport(id);
    res.redirect('/admin/control/airport');
});