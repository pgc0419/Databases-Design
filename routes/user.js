import express from "express";
import { selectSql, callTransaction} from "../database/sql";

const router = express.Router();

router.get('/', async function (req, res) {
    
    if (req.session.user == undefined) {
        res.redirect('/');
    } else if (req.session.user.role === 'user') {
        const id = req.session.user.id;
        const legInstance = await selectSql.getLegInstance();
        const seatReservation = await selectSql.getSeatReservation(id);
        res.render('user', { 
            title1: "legInstance",
            title2: "seatrservation",
            legInstance,
            seatReservation
        });
    } else {
        res.redirect('/user');
    }
});

router.post('/', async function (req, res) {
    if (req.body._method === 'PUT') {
        const vars = req.body;
        const data = {
            Flight_number: vars.flight_number,
            Leg_number: vars.leg_number,
            Date: vars.date,
            Seat_number: vars.seat_number,
            Name: req.session.user.name,
            Phone: req.session.user.phone,
            User_id: req.session.user.id
        }
        await callTransaction.bookSeat(data);
        res.redirect('/user');
    }

    if (req.body._method === 'DELETE') {
        const vars = req.body;
        try {
            console.log("DELETE Request Body (vars):", vars); 
            
               const data = {
                    Flight_number: vars.flight_number,
                    Leg_number: vars.leg_number,
                    Date: vars.date,
                    Seat_number: vars.seat_number
                }

            if (!data.Flight_number || !data.Leg_number || !data.Date || !data.Seat_number) {
                console.error("Error: 필수 예약 데이터 (Flight, Leg, Date, Seat)가 누락되었습니다.");
                return res.redirect('/user'); 
            }
            
            await callTransaction.deleteSeatReservation(data);

            return res.redirect('/user'); 
            
        } catch (error) {
            console.error("Delete Handler Catch Error:", error);
            return res.redirect('/user'); 
        }
    }

    const vars = req.body;
    const data = {
        Flight_number: vars.flight_number,
        Leg_number: vars.leg_number,
        Date: vars.date,
        Seat_number: vars.seat_number,
        Name: req.session.user.name,
        Phone: req.session.user.phone,
        User_id: req.session.user.id
    }
    await callTransaction.bookSeat(data);
    res.redirect('/user');
});

module.exports = router;