import express from 'express';
import { selectSql, createSql, updateSql, deleteSql } from '../../database/sql';

const router = express.Router();

router.get('/admin/control/airplaneType', async function (req, res) {
    const airplaneType_res = await selectSql.getAirplaneType();
    res.render('controlAirplaneType', {
        main_title: "Control AirplaneType table",
        airplaneType_res,
    });
});

router.post('/admin/control/airplaneType/add', async function (req, res) {
    const vars = req.body;
    const data = {
        Airplane_type_name: vars.airplane_type_name,
        Max_seats: vars.max_seats,
        Company: vars.company,
    }
    await createSql.addAirplaneType(data);
    res.redirect('/admin/control/airplaneType');
});

router.post('/admin/control/airplaneType/update', async function (req, res) {
    const vars = req.body;
    const data = {
        Airplane_type_name: vars.airplane_type_name,
        Max_seats: vars.max_seats,
        Company: vars.company,
    }
    await updateSql.updateAirplaneType(data);
    res.redirect('/admin/control/airplaneType');
});

router.post('/admin/control/airplaneType/delete', async function (req, res) {
    const vars = req.body;
    const id = vars.airplane_type_name;
    await deleteSql.deleteAirplaneType(id);
    res.redirect('/admin/control/airplaneType');
});