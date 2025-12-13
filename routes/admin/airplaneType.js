import express from 'express';
import { selectSql, createSql, updateSql, deleteSql } from '../../database/sql';

const router = express.Router();

router.get('/', async function (req, res) {
    const airplaneType_res = await selectSql.getAirplaneType();
    res.render('airplaneType', {
        main_title: "Control AirplaneType table",
        airplaneType_res,
    });
});

router.post('/', async function (req, res) {
    if (req.body._method === 'PUT') {
        const vars = req.body;
        const data = {
            Airplane_type_name: vars.airplane_type_name,
            Max_seats: vars.max_seats,
            Company: vars.company,
        }
        await updateSql.updateAirplaneType(data);
        res.redirect('/airplaneType');
    }

    if (req.body._method === 'DELETE') {
        const vars = req.body;
        try {
            console.log("DELETE Request Body (vars):", vars); 
            
               const Airplane_type_name = vars.airplane_type_name; 

            if (!Airplane_type_name) {
                console.error("Error: ID (airplane_type_name) is missing in request body.");
                return res.redirect('/airplaneType'); 
            }
            
            await deleteSql.deleteAirplaneType(Airplane_type_name);
            
            return res.redirect('/airplaneType'); 
            
        } catch (error) {
            console.error("Delete Handler Catch Error:", error);
            return res.redirect('/airplaneType'); 
        }
    }

    const vars = req.body;
    const data = {
        Airplane_type_name: vars.airplane_type_name,
        Max_seats: vars.max_seats,
        Company: vars.company,
    }
    await createSql.addAirplaneType(data);
    res.redirect('/airplaneType');
});

module.exports = router;