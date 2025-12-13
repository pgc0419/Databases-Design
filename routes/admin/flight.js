import express from 'express';
import { selectSql, createSql, updateSql, deleteSql } from '../../database/sql';

const router = express.Router();

router.get('/', async function (req, res) {
    const flight_res = await selectSql.getFlight();
    res.render('flight', {
        main_title: "Control Flight table",
        flight_res,
    });
});

router.post('/', async function (req, res) {
    if (req.body._method === 'PUT') {
        const vars = req.body;
        const data = {
            Flight_number: vars.flight_number,
            Airline: vars.airline,
            Weekdays: vars.weekdays,
        }
        await updateSql.updateFlight(data);
        res.redirect('/flight');
    }

    if (req.body._method === 'DELETE') {
        const vars = req.body;
        try {
            console.log("DELETE Request Body (vars):", vars); 
            
               const Flight_number = vars.flight_number;

            if (!Flight_number) {
                console.error("Error: ID (Flight_number) is missing in request body.");
                return res.redirect('/flight'); 
            }
            
                await deleteSql.deleteFlight(Flight_number);

            return res.redirect('/flight'); 
            
        } catch (error) {
            console.error("Delete Handler Catch Error:", error);
            return res.redirect('/flight'); 
        }
    }

    const vars = req.body;
    const data = {
        Flight_number: vars.flight_number,
        Airline: vars.airline,
        Weekdays: vars.weekdays,
    }
    await createSql.addFlight(data);
    res.redirect('/flight');
});

module.exports = router;