import express from "express";
import { selectSql} from "../database/sql";

const router = express.Router();

router.get('/', async function (req, res) {   
    if (req.session.user.role == undefined) {
        res.redirect('/');
    } else if (req.session.user.role == 'admin') {
        res.redirect('/admin');
    } else if (req.session.user.role == 'auser') {
        res.redirect('/user');
    }
})

router.get('/admin', async function (req, res) {
    const userEmail = req.cookies.user_email;
    const airport = await selectSql.getAirportV();
    const airplane = await selectSql.getAirplaneV();
    const flight = await selectSql.getFlightV();
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
        res.render('/')
    }
});

router.get('/admin/control', async function (req, res) {
    const userEmail = req.cookies.user_email;
    const getAirport = await selectSql.getAirport();
    const getAirplane = await selectSql.getAirplane();
    const getAirplaneType = await selectSql.getAirplaneType();
    const getCanLand = await selectSql.getCanLand();
    const getFlight = await selectSql.getFlight();
    const getFare = await selectSql.getFare();
    const getFlightLeg = await selectSql.getFlightLeg();
    const getLegInstance = await selectSql.getLegInstance();
    
    if (userEmail) {
        res.render(`control`, {
            user: req.cookies.user_email,
            main_title: "CONTROL for admin",
            title: "airport",
            title2: "airplane",
            title3: "airplaneType",
            title4: "canLand",
            title5: "flight",
            title6: "fare",
            title7: "flightLeg",
            title8: "legInstance",
            getAirport,
            getAirplane,
            getAirplaneType,
            getCanLand,
            getFlight,
            getFare,
            getFlightLeg,
            getLegInstance
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
        res.render('/')
    }
});

module.exports = router;