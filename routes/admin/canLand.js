import express from 'express';
import { selectSql, createSql, updateSql, deleteSql } from '../../database/sql';

const router = express.Router();

router.get('/', async function (req, res) {
    const canLand_res = await selectSql.getCanLand();
    res.render('canLand', {
        main_title: "Control CanLand table",
        canLand_res,
    });
});

router.post('/', async function (req, res) {
    // if (req.body._method === 'PUT') {
    //     const vars = req.body;
    //     const data = {
    //         Old_Airplane_type_name: vars.old_airplane_type_name,
    //         Old_Airport_code: vars.old_airport_code,
    //         Airplane_type_name: vars.airplane_type_name,
    //         Airport_code: vars.airport_code,
    //     }
    //     await updateSql.updateCanLand(data);
    //     res.redirect('/canLand');
    // }

    if (req.body._method === 'DELETE') {
        const vars = req.body;
        try {
            console.log("DELETE Request Body (vars):", vars); 
            const Airplane_type_name = vars.airplane_type_name;
            const Airport_code = vars.airport_code;

            if (!Airplane_type_name || !Airport_code) {
                console.error("Error: ID (airport_code and airplane_type_name) is missing in request body.");
                return res.redirect('/canLand'); 
            }
            
            await deleteSql.deleteCanLand(Airplane_type_name, Airport_code); 

            return res.redirect('/canLand'); 
            
        } catch (error) {
            console.error("Delete Handler Catch Error:", error);
            return res.redirect('/canLand'); 
        }
    }

    const vars = req.body;
    const data = {
        airplane_type_name: vars.airplane_type_name,
        airport_code: vars.airport_code,
    }
    await createSql.addCanLand(data);
    res.redirect('/canLand');
});

module.exports = router;