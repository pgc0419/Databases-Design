import express from 'express';
import { selectSql, createSql, updateSql, deleteSql } from '../../database/sql';

const router = express.Router();

router.get('/admin/control/airplane', async function (req, res) {
    const airplane_res = await selectSql.getAirplane();
    res.render('controlAirplane', {
        main_title: "Control Airplane table",
        airplane_res,
    });
});

router.post('/admin/control/airplane/add', async function (req, res) {
    const vars = req.body;
    const data = {
        airplane_id: vars.airplane_id,
        Total_number_of_seats: vars.total_number_of_seats,
        airplane_type: vars.airplane_type,
    }
    await createSql.addAirplane(data);
    res.redirect('/admin/control/airplane');
});

router.post('/admin/control/airplane/update', async function (req, res) {
    const vars = req.body;
    const data = {
        Airplane_id: vars.airplane_id,
        Total_number_of_seats: vars.total_number_of_seats,
        Airplane_type: vars.airplane_type,
    }
    await updateSql.updateAirplane(data);
    res.redirect('/admin/control/airplane');
});

router.post('/admin/control/airplane/delete', async function (req, res) {
    const vars = req.body;
    const id = vars.airplane_id;
    await deleteSql.deleteAirplane(id);
    res.redirect('/admin/control/airplane');
});