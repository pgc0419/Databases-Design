import express from 'express';
import { selectSql, createSql, updateSql, deleteSql } from '../../database/sql';

const router = express.Router();

router.get('/', async function (req, res) {
    const airport_res = await selectSql.getAirport();
    res.render('airport', {
        main_title: "Control Airport table",
        airport_res,
    });
});

router.post('/', async function (req, res) {
    if (req.body._method === 'PUT') {
        const vars = req.body;
        const data = {
            Airport_code: vars.airport_code,
            Name: vars.name,
            City: vars.city,
            State: vars.state,
        }
        await updateSql.updateAirport(data);
        res.redirect('/airport');
    }

    if (req.body._method === 'DELETE') {
        const vars = req.body;
        res.redirect('/airport');
        try {
            console.log("DELETE Request Body (vars):", vars); 
            
               const Airport_code = vars.airport_code; 

            if (!Airport_code) {
                console.error("Error: ID (airport_code) is missing in request body.");
                return res.redirect('/airport'); 
            }
            
                await deleteSql.deleteAirport(Airport_code);

            return res.redirect('/airport'); 
            
        } catch (error) {
            console.error("Delete Handler Catch Error:", error);
            return res.redirect('/airport'); 
        }
    }

    const vars = req.body;
    const data = {
        Airport_code: vars.airport_code,
        Name: vars.name,
        City: vars.city,
        State: vars.state,
    }
    await createSql.addAirport(data);
    res.redirect('/airport');
});

module.exports = router;