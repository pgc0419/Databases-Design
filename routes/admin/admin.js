import express from "express";
import { selectSql} from "../../database/sql";

const router = express.Router();

router.get('/', async function (req, res) {
    
    if (req.session.user == undefined) {
        res.redirect('/');
    } else if (req.session.user.role === 'admin') {
        const airport = await selectSql.getAirportV();
        const airplane = await selectSql.getAirplaneV();
        const flight = await selectSql.getFlightV();
        const flightLeg = await selectSql.getFlightLeg();
        const legInstance = await selectSql.getLegInstance();
        res.render('admin', { 
            title1: "airport",
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
        res.redirect('/admin');
    }
});

router.get('/control', async function (req, res) {
    if (req.session.user == undefined) {
        res.redirect('/');
    } else if (req.session.user.role === 'admin') {
        const getAirport = await selectSql.getAirport();
        const getAirplane = await selectSql.getAirplane();
        const getAirplaneType = await selectSql.getAirplaneType();
        const getCanLand = await selectSql.getCanLand();
        const getFlight = await selectSql.getFlight();
        const getFare = await selectSql.getFare();
        const getFlightLeg = await selectSql.getFlightLeg();
        const getLegInstance = await selectSql.getLegInstance();
        res.render(`control`, {
            title1: "airport",
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
        res.redirect('/control');
    }
});

module.exports = router;