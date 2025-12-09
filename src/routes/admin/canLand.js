import express from 'express';
import { selectSql, createSql, updateSql, deleteSql } from '../../database/sql';

const router = express.Router();

router.get('/admin/control/canLand', async function (req, res) {
    const canLand_res = await selectSql.getCanLand();
    res.render('controlCanLand', {
        main_title: "Control CanLand table",
        canLand_res,
    });
});

router.post('/admin/control/canLand/add', async function (req, res) {
    const vars = req.body;
    const data = {
        airplane_type_name: vars.airplane_type_name,
        airport_code: vars.airport_code,
    }
    await createSql.addCanLand(data);
    res.redirect('/admin/control/canLand');
});

router.post('/admin/control/canLand/update', async function (req, res) {
    const vars = req.body;
    const data = {
        Old_airplane_type_name: vars.old_airplane_type_name,
        Old_airport_code: vars.old_airport_code,
        Airplane_type_name: vars.airplane_type_name,
        Airport_code: vars.airport_code,
    }
    await updateSql.updateCanLand(data);
    res.redirect('/admin/control/canLand');
});

router.post('/admin/control/canLand/delete', async function (req, res) {
    const vars = req.body;
    const airport_code = vars.airport_code;
    const airplane_type_name = vars.airplane_type_name;
    await deleteSql.deleteCanLand(airport_code, airplane_type_name);
    res.redirect('/admin/control/canLand');
});