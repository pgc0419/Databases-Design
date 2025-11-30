import express from "express";
import { selectSql, createSql } from "../database/sql";

const router = express.Router();

router.get('/', async function (req, res) {
    // TODO
    const studentId = req.cookies.user;
    const classes = await selectSql.getClasses(studentId);
    const allClass = await selectSql.getAllClasses(studentId);
    if (req.cookies.user) {
        res.render('select', { 
            user: req.cookies.user,
            title: "classes",
            title2: "allClass",
            classes, 
            allClass
        });
    } else {
        res.render('/')
    }

});

router.post('/', async(req, res) => {
    // TODO
    const data = {
        cId: req.body.applyBtn,
        sId: req.cookies.user,
    };
    if (await selectSql.checkDuplicationClass(data.cId, data.sId) == 1) {
        console.log ("중복 수강신청 불가.");
        res.redirect('/sugang');
    } else if (await selectSql.checkZeroRemainClass(data.cId) == 1) {
        console.log ("잔여 없음.");
        res.redirect('/sugang');
    } else {
        await createSql.addClass(data);
        res.redirect('/sugang');
    }
});

module.exports = router;