import express from "express";
import { createSql} from "../database/sql";

const router = express.Router();

router.post('/admin', async function (req, res) {
    //data body 변환 로직 필요
    const data = {
        cId: req.body.applyBtn,
        sId: req.cookies.user,
    };

    const userEmail = req.cookies.user_email;
    const addAirport = await createSql.addAirport(data);
    const addAirplane = await createSql.addAirplane(data);
    const addFlight = await createSql.addFlight(data);
    const addFlightLeg = await createSql.addFlightLegO(data);
    const addLegInstance = await createSql.addLegInstance(data);
})

module.exports = router;