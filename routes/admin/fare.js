import express from 'express';
import { selectSql, createSql, updateSql, deleteSql } from '../../database/sql';

const router = express.Router();

router.get('/', async function (req, res) {
    const fare_res = await selectSql.getFare();
    res.render('fare', {
        main_title: "Control Fare table",
        fare_res,
    });
});

router.post('/', async function (req, res) {
    if (req.body._method === 'PUT') {
        const vars = req.body;
        const data = {
            Flight_number: vars.flight_number,
            Fare_code: vars.fare_code,
            Amount: vars.amount,
            Restrictions: vars.restrictions,
        }
        await updateSql.updateFare(data);
        res.redirect('/fare');
    }

    if (req.body._method === 'DELETE') {
        const vars = req.body;
        const id = vars.fare_code;
        console.error(vars.fare_code);
        await deleteSql.deleteFare(id);
        res.redirect('/fare');
    }
    
    const vars = req.body;
    const data = {
        Flight_number: vars.flight_number,
        Fare_code: vars.fare_code,
        Amount: vars.amount,
        Restrictions: vars.restrictions,
    }
    await createSql.addFare(data);
    res.redirect('/fare');
});

module.exports = router;