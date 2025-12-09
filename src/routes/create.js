import express from "express";
import { callTransaction, createSql} from "../database/sql";

const router = express.Router();

router.post('/student', async (req, res) => {
    const vars = req.body;
    const data = {
        Id: vars.id,
        Name: vars.name,
        Email: vars.email,
        PhoneNumber: vars.phonenumber,
        Major: vars.major,
    }
    await updateSql.updateStudent(data);

    res.redirect('/update/student');
});

router.post('/addAirport', async function (req, res) {
    const userEmail = req.cookies.user_email;
    const vars = req.body;
    const data = {
        Airport_code: vars.airport_code,
        Name: vars.name,
        City: vars.city,
        State: vars.state,
    }
    
    if (userEmail) {
        await createSql.addAirport(data);

        res.render(`create`, {
            user: req.cookies.user_email,
            title: "addAirport",
            addAirport,
        });
    } else {
        res.render('/admin/control')
    }
});

router.post('/create', async function (req, res) {
    const userEmail = req.cookies.user_email;
    const addAirport = await createSql.addAirport();
    const addAirplane = await createSql.addAirplane();
    const addAirplaneType = await createSql.addAirplaneType();
    const addCanLand = await createSql.addCanLand();
    const addFlight = await createSql.addFlight();
    const addFare = await createSql.addFare();
    const addFlightLeg = await createSql.addFlightLeg();
    const addLegInstance = await createSql.addLegInstance();
    
    if (userEmail) {
        res.render(`create`, {
            user: req.cookies.user_email,
            main_title: "ADD for admin",
            title: "airport",
            title2: "airplane",
            title3: "airplaneType",
            title4: "canLand",
            title5: "flight",
            title6: "fare",
            title7: "flightLeg",
            title8: "legInstance",
            addAirport,
            addAirplane,
            addAirplaneType,
            addCanLand,
            addFlight,
            addFare,
            addFlightLeg,
            addLegInstance
        });
    } else {
        res.render('/admin/control')
    }
});

router.post('/create', async function (req, res) {
    const userEmail = req.cookies.user_email;
    const addLegInstance = await createSql.addLegInstance(leg_number, airplane_id);
    const addSeatReservation = await callTransaction.bookSeat(date, user_id);
    
    if (userEmail) {
        res.render('select', { 
            user: req.cookies.user_email,
            title: "addLegInstance",
            title2: "addSeatReservation",
            addLegInstance,
            addSeatReservation
        });
    } else {
        res.render('/')
    }
});

module.exports = router;