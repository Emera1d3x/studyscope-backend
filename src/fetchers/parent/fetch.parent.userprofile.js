import { ParentModel } from '../../models/model.user.js';

export async function fetchParentProfile(req, res) {
  try {
    const parentId = req.userId;
    if (!parentId) {res.status(401).json('MissingUserIdInRequest'); return;}
    const parent = await ParentModel.findById(parentId).select('name email loginMethod phoneNumber paymentHistory');
    if (!parent) {res.status(404).json('ParentNotFound'); return;}
    res.status(200).json({
      name: parent.name,
      email: parent.email,
      loginMethod: parent.loginMethod,
      paymentHistory: parent.paymentHistory
    });
  } catch (err) {
    console.error('FetchParentProfileError:', err);
    res.status(500).json('InternalServerError');
  }
}
