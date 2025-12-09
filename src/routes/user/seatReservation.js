import express from 'express';
import { selectSql, callTransaction } from '../../database/sql';

const router = express.Router();

router.get('/admin/control/seatReservation', async function (req, res) {
    const seatReservation_res = await selectSql.getSeatReservation();
    res.render('controlSeatReservation', {
        main_title: "Control SeatReservation table",
        seatReservation_res,
    });
});

router.post('/admin/control/seatReservation/add', async function (req, res) {
    const vars = req.body;
    const User_id = req.cookies.user;
    const data = {
        flight_number: vars.flight_number,
        leg_number: vars.leg_number,
        Date: vars.date,
        Seat_number: vars.old_seat_number,
        User_id: User_id,
    }
    await callTransaction.bookSeat(data);
    res.redirect('/admin/control/seatReservation');
});

router.post('/admin/control/seatReservation/update', async function (req, res) {
    const vars = req.body;
    const User_id = req.cookies.user;
    const data = {
        Flight_number: vars.flight_number,
        Leg_number: vars.leg_number,
        Date: vars.date,
        Old_Seat_number: vars.old_seat_number,
        New_Seat_number: vars.new_seat_number,
        User_id: User_id,
    }
    await callTransaction.updateSeatReservation(data);
    res.redirect('/admin/control/seatReservation');
});

router.post('/admin/control/seatReservation/delete', async function (req, res) {
    const vars = req.body;
    const data = {
        Flight_number: vars.flight_number,
        Leg_number: vars.leg_number,
        Date: vars.date,
        Seat_number: vars.seat_number,
    }
    await callTransaction.deleteSeatReservation(data);
    res.redirect('/admin/control/seatReservation');
});