import express from 'express';
import { selectSql, createSql, updateSql, deleteSql } from '../../database/sql';

const router = express.Router();

router.get('/admin/control/fare', async function (req, res) {
    const fare_res = await selectSql.getFare();
    res.render('controlFare', {
        main_title: "Control Fare table",
        fare_res,
    });
});

router.post('/admin/control/fare/add', async function (req, res) {
    const vars = req.body;
    const data = {
        flight_number: vars.flight_number,
        fare_code: vars.fare_code,
        Amount: vars.amount,
        Restrictions: vars.restrictions,
    }
    await createSql.addFare(data);
    res.redirect('/admin/control/fare');
});

router.post('/admin/control/fare/update', async function (req, res) {
    const vars = req.body;
    const data = {
        Flight_number: vars.flight_number,
        Fare_code: vars.fare_code,
        Amount: vars.amount,
        Restrictions: vars.restrictions,
    }
    await updateSql.updateFare(data);
    res.redirect('/admin/control/fare');
});

router.post('/admin/control/fare/delete', async function (req, res) {
    const vars = req.body;
    const id = vars.fare_code;
    await deleteSql.deleteFare(id);
    res.redirect('/admin/control/fare');
});

module.exports = router;