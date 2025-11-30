import express from "express";
import { selectSql} from "../database/sql";

const router = express.Router();

router.get('/admin', async function (req, res) {
    const userEmail = req.cookies.user_email;
    const airport = await selectSql.getAirport();
    const airplane = await selectSql.getAirplane();
    const flight = await selectSql.getFlight();
    const flightLeg = await selectSql.getFlightLeg(flight_number);
    const legInstance = await selectSql.getLegInstance(leg_number, airplane_id);
    
    if (userEmail) {
        res.render('select', { 
            user: req.cookies.user_email,
            title: "airport",
            title2: "airplane",
            title3: "flight",
            title4: "flightLeg",
            title5: "legInstance",
            airport, 
            airplane,
            flight,
            flightLeg,
            legInstance
        });
    } else {
        res.render('/admin')
    }
});

router.get('/user', async function (req, res) {
    const userEmail = req.cookies.user_email;
    const legInstance = await selectSql.getLegInstance(leg_number, airplane_id);
    const seatReservation = await selectSql.getSeatReservation(date, user_id);
    
    if (userEmail) {
        res.render('select', { 
            user: req.cookies.user_email,
            title: "legInstance",
            title2: "seatReservation",
            legInstance,
            seatReservation
        });
    } else {
        res.render('/admin')
    }
});

module.exports = router;