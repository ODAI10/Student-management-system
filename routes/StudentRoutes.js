
const express = require('express');
const router = express.Router();
const connection = require('../db');



//get  Student profile
router.get("/profile/:id",(req,res)=>{
    const studentId = req.params.id
    if (!studentId) {
        return res.status(400).json({ message: " غير موجود id"  });
    }
    const query = "SELECT * FROM students WHERE id=?"
    connection.query(query,[studentId],(err,result)=>{
        if(err){
            return res.status(400).json({ message: "حدث خطأ أثناء جلب بيانات الملف الشخصي" });
        }
        res.status(200).json(result)
        
    })

})

// get student grades
router.get("/grades/:id", (req, res) => {
    const studentId = req.params.id;

    if (!studentId) {
        return res.status(400).json({ message: "غير موجود ID" });
    }

    const query = `
        SELECT grades.id, 
               students.full_name AS student_name, 
               courses.name AS course_name,
               grades.midterm, grades.final, grades.total, grades.status
        FROM grades
        JOIN students ON grades.student_id = students.id
        JOIN courses ON grades.course_id = courses.id
        WHERE grades.student_id = ?
    `;

    connection.query(query, [studentId], (err, result) => {
        if (err) {
            return res.status(400).json({ message: "حدث خطأ أثناء جلب العلامات" });
        }
        res.status(200).json(result);
    });
});


// get Student courses
router.get("/courses-student/:id", (req, res) => {
    const studentId = req.params.id;
    if (!studentId) {
        return res.status(400).json({ message: "غير موجود  ID" });
    }
    const query = `
       SELECT course.id, course.name, course.department, course.credits
        FROM student_courses 
        JOIN courses course ON student_courses.course_id = course.id 
        WHERE student_courses.student_id = ?

    `;
     connection.query(query, [studentId], (err, result) => {
        if (err) {
            return res.status(400).json({ message: "حدث خطأ أثناء جلب المواد المسجلة" });
        }

        if (result.length === 0) {
            return res.status(404).json({ message: "لا توجد مواد مسجلة لهذا الطالب" });
        }

        res.status(200).json(result);
    });
});




module.exports = router;