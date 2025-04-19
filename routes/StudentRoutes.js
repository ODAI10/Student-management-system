
const express = require('express');
const router = express.Router();
const connection = require('../db');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

const authenticate = require("../middleware/middleware");

//get  Student profile
router.get("/profile/:id",(req,res)=>{
    const studentId = req.params.id

    const query = "SELECT * FROM students WHERE id=?"
    connection.query(query,[studentId],(err,result)=>{
        if(err){
            return res.status(400).json({Message:"Error show profile data"})
        }
        res.status(200).json(result)
    })

})

// get student grades
router.get("/grades/:id", (req, res) => {
    console.log("Request params:", req.params); // تحقق مما يتم إرساله
    const studentId = req.params.id;
    console.log("Extracted Student ID:", studentId);  

    if (!studentId) {
        return res.status(400).json({ message: "Invalid student ID" });
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
            return res.status(400).json({ message: "Error retrieving grades" });
        }
        res.status(200).json(result);
    });
});


// get Student courses
router.get("/courses-student/:id", (req, res) => {
    const studentId = req.params.id;
    console.log(studentId)
    const query = `
        SELECT c.id, c.name, c.department, c.credits
        FROM student_courses sc
        JOIN courses c ON sc.course_id = c.id
        WHERE sc.student_id = ?
    `;
    console.log(studentId)
    connection.query(query, [studentId], (err, result) => {
        if (err) {
            return res.status(400).json({ message: "Error fetching student courses", error: err });
        }

        if (result.length === 0) {
            return res.status(404).json({ message: "No courses found for this student" });
        }

        res.status(200).json(result);
    });
});




module.exports = router;