const express = require("express");
const router = express.Router();
const connection = require("../db");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

const {
  authenticate,
  validateUserInput,
  checkEmailPhoneUnique,
} = require("../middleware/middleware");

// Admin Routes

// Get profile admin info
router.get("/profile", authenticate, (req, res) => {
  const adminId = req.user.id;
  const query = "SELECT * FROM admins WHERE id = ?";

  connection.query(query, [adminId], (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "خطأ في جلب صفحة الادمن", error: err });
    }
    res.json(result[0]);
  });
});

// Update profile admin info
router.put(
  "/profile",
  authenticate,
  validateUserInput,
  checkEmailPhoneUnique,
  (req, res) => {
    const adminId = req.user.id;
    const { full_name, email, phone, address } = req.body;

    const query =
      "UPDATE admins SET full_name = ?, email = ?, phone = ?,address = ? WHERE id = ?";
    connection.query(
      query,
      [full_name, email, phone, address, adminId],
      (err, result) => {
        if (err) {
          return res
            .status(500)
            .json({ message: "خطا في تحديث بيانات الادمن ", error: err });
        }
        res.json({ message: "" });
      }
    );
  }
);

// Add new admin
router.post(
  "/add-admin",
  validateUserInput,
  checkEmailPhoneUnique,
  (req, res) => {
    const { full_name, email, password, phone, address } = req.body;
    bcryptjs.hash(password, 10, (err, hashPassword) => {
      if (err) {
        return res.status(500).json({ message: "خطا في تشفير كلمة المرور" });
      }
      const query =
        "INSERT INTO admins (full_name, email, password, phone,address) VALUES (?, ?, ?, ?,?)";
      connection.query(
        query,
        [full_name, email, hashPassword, phone, address],
        (err, result) => {
          if (err) {
            return res
              .status(500)
              .json({ message: "خطا في اضافة الادمن في قاعدة البيانات", error: err });
          }

          return res.status(201).json({
            message: "تم اضافة الادمن بنجاح",
          });
        }
      );
    });
  }
);

// Just postman
// get all admins
router.get("/admins", (req, res) => {
  const query = "SELECT  * FROM admins ";
  connection.query(query, (err, result) => {
    if (err)
      return res.status(400).json({ message: "مشكلة في عرض جميع الاادمنز" });
    res.status(200).json(result);
  });
});
// Delete admin
router.delete("/profile/:id", (req, res) => {
  const adminId = req.params.id;
  const query = "DELETE FROM admins WHERE id=?";
  connection.query(query, [adminId], (err, result) => {
    if (err)
      return res
        .status(500)
        .json({ message: "Error deleting admin", error: err });

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Admin not found" });
    }
    res.status(200).json({ message: "deleted admin successfuly" });
  });
});

// Add new student
router.post(
  "/add-student",
  authenticate,  
  checkEmailPhoneUnique,
  validateUserInput,
  (req, res) => {
    const { full_name, email, phone, address, status, password } = req.body;

    bcryptjs.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        return res.status(500).json({ message: "مشكلة في تشفير كلمة السر" });
      }

      const query =
        "INSERT INTO students (full_name, email, phone, address, status, password) VALUES (?, ?, ?, ?, ?, ?)";
      connection.query(
        query,
        [full_name, email, phone, address, status, hashedPassword],
        (err, result) => {
          if (err) {
            return res
              .status(500)
              .json({ message: "خطأ في إضافة الطالب", error: err });
          }

          res.status(201).json({
            message: "تم إضافة الطالب بنجاح",
          });
        }
      );
    });
  }
);

// Get all students
router.get("/students", (req, res) => {
  const query = "SELECT * FROM students ";
  connection.query(query, (err, result) => {
    if (err)
      return res
        .status(500)
        .json({ message: "خطا في عرض الطلاب ", error: err });

    res.json(result);
  });
});

// update student
router.put(
  "/student/:id",
  authenticate,
  validateUserInput,
  checkEmailPhoneUnique,
  (req, res) => {
    const studentId = req.params.id;
    const { full_name, email, phone, address, status } = req.body;

    const query =
      "UPDATE students SET full_name = ?, email = ?, phone = ?, address = ?, status = ? WHERE id = ?";

    connection.query(
      query,
      [full_name, email, phone, address, status, studentId],
      (err, result) => {
        if (err)
          return res
            .status(500)
            .json({ message: "خطا في تحديث البيانات", error: err });
        res.json({ message: "تم تحديث البيانات بنجاح" });
      }
    );
  }
);

// Delete student
router.delete("/student/:id",authenticate, (req, res) => {
  const studentId = req.params.id;

   const deleteGradesQuery = "DELETE FROM grades WHERE student_id = ?";
  connection.query(deleteGradesQuery, [studentId], (err, result) => {
    if (err)
      return res
        .status(500)
        .json({ message: "خطا في حذق المواد", error: err });

    const deleteStudentQuery = "DELETE FROM students WHERE id = ?";
    connection.query(deleteStudentQuery, [studentId], (err, result) => {
      if (err)
        return res
          .status(500)
          .json({ message: "خطا في حذف الطالب", error: err });

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "هذا الطالب غير موجود" });
      }

      res.json({ message: "ام حذف الطالب بنجاح" });
    });
  });
});

// Add  course
router.post("/course", (req, res) => {
  const name = req.body.name?.trim();
  const department = req.body.department?.trim();
  const credits = req.body.credits;
  if (!name || !department || !credits) {
    return res.status(400).json({ message: "الرجاء إدخال جميع الحقول." });
  }

  const checkQuery = "SELECT * FROM courses WHERE name=?";
  connection.query(checkQuery, [name], (err, result) => {
    if (err)
      return res
        .status(500)
        .json({ message: "Error checking course existence", error: err });
    if (result.length > 0) {
      return res
        .status(400)
        .json({ message: "Course with this name already exists." });
    }
    const query =
      "INSERT INTO courses (name,department,credits) VALUES (?,?,?) ";
    connection.query(query, [name, department, credits], (err, result) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Can't add course, error", error: err });
      }
      res.status(201).json({ message: "Added course successfuly" });
    });
  });
});

// add course for student   
router.post("/student-course", (req, res) => {
  const { student_id, course_id } = req.body;

  const checkQuery =
    "SELECT * FROM student_courses WHERE student_id = ? AND course_id = ?";
  connection.query(checkQuery, [student_id, course_id], (err, result) => {
    if (err) {
      return res.status(400).json({ message: "خطأ أثناء التحقق من المادة" });
    }

    if (result.length > 0) {
      return res
        .status(400)
        .json({ message: "تمت إضافة المادة بالفعل لهذا الطالب" });
    }

    
    const query =
      "INSERT INTO student_courses (student_id, course_id) VALUES (?, ?)";
    connection.query(query, [student_id, course_id], (err, result) => {
      if (err) {
        return res.status(400).json({ message: "Error adding course" });
      }
      res.status(201).json({ message: "تمت إضافة المادة بنجاح", result });
    });
  });
});

router.get("/student-course", (req, res) => {
  const query = `
  SELECT student_courses.id, students.full_name AS student_name, courses.name AS course_name
    FROM student_courses
    JOIN students ON student_courses.student_id = students.id
    JOIN courses ON student_courses.course_id = courses.id
    `;
  connection.query(query, (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "خطأ أثناء جلب بيانات تسجيل المواد" });
    }
    res.status(200).json(result);
  });
});

// delete course for student
router.delete("/student-course/:student_id", (req, res) => {
  const studentId = req.params.student_id;
  // اتحقق مما إذا كان الطالب مسجلاً في مواد
  const query = "SELECT * FROM student_courses WHERE student_id = ?";
  connection.query(query, [studentId], (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "حدث خطأ أثناء التحقق من مواد الطالب" });
    }

    if (result.length === 0) {
      return res
        .status(400)
        .json({ message: "لم يتم العثور على مواد مسجلة لهذا الطالب" });
    }

    const deleteQuery = "DELETE FROM student_courses WHERE student_id = ?";
    connection.query(deleteQuery, [studentId], (err, result) => {
      if (err) {
        return res.status(500).json({ message: "حدث خطأ أثناء حذف المواد" });
      }
      res.status(200).json({ message: "تم حذف المواد بنجاح", result });
    });
  });
});

// Get all courses
router.get("/courses", (req, res) => {
  const query = "SELECT * FROM courses";
  connection.query(query, (err, result) => {
    if (err) {
      return res.status(400).json({ message: "خطا في عرض جميع المواد" });
    }
    res.status(200).json(result);
  });
});

// Update course
router.put("/course/:id", (req, res) => {
  const courseId = req.params.id;
  const { name, department, credits } = req.body;

  if (!name || !department || !credits) {
    return res.status(400).json({ message: "الرجاء ادخال جميع الحقول " });
  }

  const checkIdQuery = "SELECT * FROM courses WHERE id=?";
  connection.query(checkIdQuery, [courseId], (err, result) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error checking course existence", error: err });
    }

    if (result.length === 0) {
      return res
        .status(404)
        .json({ message: "Course with this ID not found." });
    }

    const checkNameQuery = "SELECT * FROM courses WHERE name=? AND id != ?";
    connection.query(checkNameQuery, [name, courseId], (err, result) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "خطأ في التحقق من وجود المادة", error: err });
      }

      // إذا تم العثور على مادة بنفس الاسم
      if (result.length > 0) {
        return res.status(400).json({ message: "هذه المادة موجودة بالفعل" });
      }
      const updateQuery =
        "UPDATE courses SET name=?, department=?, credits=? WHERE id=?";
      connection.query(
        updateQuery,
        [name, department, credits, courseId],
        (err, result) => {
          if (err) {
            return res
              .status(400)
              .json({ message: "خطا في تعديل المادة ", error: err });
          }
          res.status(200).json({ message: "تم تحديث المادة بنجاح", result });
        }
      );
    });
  });
});

// Delete course
router.delete("/course/:id", (req, res) => {
  const courseId = req.params.id;

  const checkIdQuery = "SELECT * FROM courses WHERE id=?";
  connection.query(checkIdQuery, [courseId], (err, result) => {
    if (err)
      return res.status(500).json({ message: "Error checking course", err });
    if (result.length === 0)
      return res.status(404).json({ message: "Course not found" });

    const query = "DELETE FROM courses WHERE id=?";
    connection.query(query, [courseId], (err, result) => {
      if (err) {
        return res.status(400).json({ message: "Error deleted", err });
      }
      res.status(200).json({ message: "Deleted course successfuly" });
    });
  });
});

// get all grades
router.get("/grades", (req, res) => {
  const query = `
        SELECT grades.id, 
        students.full_name AS student_name, 
        courses.name AS course_name,
        grades.midterm, grades.final, grades.total, grades.status
        FROM grades
        JOIN students ON grades.student_id = students.id
        JOIN courses ON grades.course_id = courses.id
    `;

  connection.query(query, (err, result) => {
    if (err) {
      return res.status(400).json({ message: "خطأ في جلب الدرجات" });
    }
    res.status(200).json(result);
  });
});

// add grade

router.post("/grade", (req, res) => {
  const { student_id, course_id, midterm, final, total, status } = req.body;

  if (
    !student_id ||
    !course_id ||
    midterm === undefined ||
    final === undefined ||
    total === undefined ||
    !status
  ) {
    return res.status(400).json({
      message:
        "جميع البيانات مطلوبة (student_id, course_id, midterm, final, total, status)",
    });
  }

  if (midterm > 50) return res.json({ message: "العلامة من 50" });
  if (final > 50) return res.json({ message: "العلامة من 50" });

  const checkQuery =
    "SELECT * FROM grades WHERE student_id = ? AND course_id = ?";
  connection.query(checkQuery, [student_id, course_id], (err, existing) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "خطأ أثناء التحقق من الدرجة", error: err });
    }

    if (existing.length > 0) {
      return res.status(400).json({
        message: "تمت إضافة الدرجة مسبقًا لهذا الطالب في هذه المادة",
      });
    }

    const insertQuery =
      "INSERT INTO grades (student_id, course_id, midterm, final, total, status) VALUES (?, ?, ?, ?, ?, ?)";

    connection.query(
      insertQuery,
      [student_id, course_id, midterm, final, total, status],
      (err, result) => {
        if (err) {
          return res
            .status(500)
            .json({ message: "حدث خطأ أثناء إضافة الدرجة", error: err });
        }

        const selectQuery = `
          SELECT students.full_name, courses.name AS course_name
          FROM students 
          JOIN courses ON courses.id = ? 
          WHERE students.id = ?`;

        connection.query(selectQuery, [course_id, student_id], (err, data) => {
          if (err) {
            return res.status(500).json({
              message: "حدث خطأ أثناء جلب بيانات الطالب والمادة",
              error: err,
            });
          }

          if (data.length === 0) {
            return res.status(404).json({
              message: "لم يتم العثور على بيانات الطالب أو المادة",
            });
          }

          res.status(201).json({
            message: "تم إضافة الدرجة بنجاح",
            grade: {
              student_id,
              course_id,
              midterm,
              final,
              total,
              status,
            },
            student: data[0].full_name,
            course: data[0].course_name,
          });
        });
      }
    );
  });
});

// update grade
router.put("/grade/:id", (req, res) => {
  const { midterm, final } = req.body; // استلام البيانات من الـ request body

  if (!midterm || !final) {
    return res
      .status(400)
      .json({ message: "الرجاء توفير درجات الامتحانات النصفي والنهائي", err });
  }

  const total = parseInt(midterm) + parseInt(final);
  const status = total >= 50 ? "Pass" : "Fail";

  const query = `UPDATE grades SET midterm = ?, final = ?, total = ?, status = ? WHERE id = ?`;

  connection.query(
    query,
    [midterm, final, total, status, req.params.id],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "حدث خطأ أثناء تحديث الدرجة" });
      }

      if (result.affectedRows === 0) {
        return res
          .status(404)
          .json({ message: "لم يتم العثور على الدرجة لتحديثها" });
      }

      res.status(200).json({ message: "تم تحديث الدرجة بنجاح" });
    }
  );
});

module.exports = router;
