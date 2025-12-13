import express from "express";
import { selectSql } from "../database/sql";

const router = express.Router();

router.get('/', (req, res) => {
    res.render('login');
});

router.post('/', async (req, res) => {
    const vars = req.body;
    const users = await selectSql.getUser();

    users.map((user) => {
        console.log('id :', user.User_id);
        console.log('email :', user.Email);
        console.log('pwd :', user.Password);
        console.log('vars.email :', vars.email);
        console.log('vars.pwd :', vars.password);
        if (vars.email === user.Email && vars.password === String(user.Password)) {
            console.log('login success!');
            req.session.user = { id: user.User_id, name: user.Name, phone: user.Phone, role: user.Role, checkLogin: true };
        }
    });

    if (req.session.user == undefined) {
        console.log('login failed!');
        res.send(`<script>
                    alert('login failed!');
                    location.href='/';
                </script>`)
    } else if (req.session.user.checkLogin && req.session.user.role === 'admin') {
        res.redirect('/admin');
    } else if (req.session.user.checkLogin && req.session.user.role === 'user') {
        res.redirect('/user');
    }
});

module.exports = router;