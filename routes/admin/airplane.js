import express from 'express';
import { selectSql, createSql, updateSql, deleteSql } from '../../database/sql';

const router = express.Router();

router.get('/', async function (req, res) {
    const airplane_res = await selectSql.getAirplane();
    res.render('airplane', {
        main_title: "Control Airplane table",
        airplane_res,
    });
});

router.post('/', async function (req, res) {
    if (req.body._method === 'PUT') {
        const vars = req.body;
        const data = {
            Airplane_id: vars.airplane_id,
            Total_number_of_seats: vars.total_number_of_seats,
            Airplane_type: vars.airplane_type,
        }
        await updateSql.updateAirplane(data);
        res.redirect('/airplane');
    }

    if (req.body._method === 'DELETE') {
        const vars = req.body;
        const stringId = vars.airplane_id;
        if (!stringId) {
            console.error("오류: 삭제 ID가 전달되지 않았습니다.");
            return res.redirect('/airplane'); 
        }
        const id = parseInt(stringId, 10);
        await deleteSql.deleteAirplane(id);
        res.redirect('/airplane');
    }
    const vars = req.body;
    const data = {
        airplane_id: vars.airplane_id,
        Total_number_of_seats: vars.total_number_of_seats,
        airplane_type: vars.airplane_type,
    }
    await createSql.addAirplane(data);
    res.redirect('/airplane');
});

module.exports = router;