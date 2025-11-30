import cookieParser from "cookie-parser";
import express from "express";
import expressSession from 'express-session';
import { selectSql } from "../database/sql";

const router = express.Router();

router.use(cookieParser());
router.use(expressSession({
    secret: 'dilab',
    resave: true,
    saveUninitialized: true,
}))

router.get('/', async (req, res) => {
    const userEmail = req.cookies.user_email;
    if (userEmail) {
        const user = await selectSql.getUserByEmail(userEmail);

        if (user && user.role == "user") {
            res.render('user', { 
                'user': user,
            });
        } else if (user && user.role == "admin"){
            res.render('admin', {
                'user': user,
            })
        } else {
            res.clearCookie('user_email');
            res.render('login');
        }
        
    } else {
        res.render('login');
    }
});

router.get('/logout', (req, res) => {
    if (req.cookies.user) {
        res.clearCookie('user')
        res.redirect("/");
    } else {
        res.redirect("/");
    }
})

router.post('/', async (req, res) => {
    const vars = req.body;
    const users = await selectSql.getUsers();
    var whoAmI = 1;
    let checkLogin = false;

    users.map((user) => {
        if (vars.id == user.email && vars.password === user.password) {
            checkLogin = true;
            whoAmI = user.email;
        }
    })

    if (checkLogin) {
        res.cookie('user_email', whoAmI, {
            expires: new Date(Date.now() + 3600000), // ms 단위 (3600000: 1시간 유효)
            httpOnly: true
        })
        res.redirect('/');
    } else {
        res.redirect('/');
    }
})

module.exports = router;