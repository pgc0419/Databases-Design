import express from "express";
import logger from "morgan";
import path from "path";
import expressSession from "express-session";

import loginRouter from "../routes/login";
import adminRouter from '../routes/admin/admin';
import userRouter from '../routes/user';
import airplaneRouter from "../routes/admin/airplane";
import airplaneTypeRouter from "../routes/admin/airplaneType";
import airportRouter from "../routes/admin/airport";
import canLandRouter from "../routes/admin/canLand";
import fareRouter from "../routes/admin/fare"
import flightRouter from "../routes/admin/flight";;
import flightLegRouter from "../routes/admin/flightLeg";
import legInstanceRouter from "../routes/admin/legInstance";

const PORT = 3000;

const app = express();

app.use(express.static(path.join(__dirname, '/src')));
app.use(express.urlencoded({ extended: false }))
app.use(express.json());
app.use(
    expressSession({
        secret: "my key",
        resave: true,
        saveUninitialized: true,
    })
);

app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));

app.use("/", loginRouter);
app.use("/admin", adminRouter);
app.use("/user", userRouter);
app.use("/airplane", airplaneRouter);
app.use("/airplaneType", airplaneTypeRouter);
app.use("/airport", airportRouter);
app.use("/canLand", canLandRouter);
app.use("/fare", fareRouter);
app.use("/flight", flightRouter);
app.use("/flightLeg", flightLegRouter);
app.use("/legInstance", legInstanceRouter);

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
