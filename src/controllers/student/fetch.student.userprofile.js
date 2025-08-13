import { StudentModel } from '../../models/model.user.js';

export async function fetchStudentProfile(req, res) {
  try {
    const studentId = req.userId;
    if (!studentId) {res.status(401).json('MissingUserIdInRequest'); return;}
    const student = await StudentModel.findById(studentId).select('name email loginMethod parentId');
    if (!student) {res.status(404).json('StudentNotFound'); return;}
    res.status(200).json({
      name: student.name,
      email: student.email,
      loginMethod: student.loginMethod,
      parentId: student.parentId
    });
  } catch (err) {
    console.error('FetchStudentProfileError:', err);
    res.status(500).json('InternalServerError');
  }
}
