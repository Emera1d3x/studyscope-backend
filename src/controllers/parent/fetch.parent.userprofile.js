import { ParentModel } from '../../models/model.user.js';

export async function fetchParentProfile(req, res) {
  try {
    const parentId = req.userId;
    if (!parentId) {
      return res.status(401).json({ error: 'Missing userId in request' });
    }
    const parent = await ParentModel.findById(parentId).select('name email loginMethod phoneNumber paymentHistory');
    if (!parent) {
      return res.status(404).json({ error: 'Parent not found' });
    }
    res.status(200).json({
      name: parent.name,
      email: parent.email,
      loginMethod: parent.loginMethod,
      phoneNumber: parent.phoneNumber,
      paymentHistory: parent.paymentHistory
    });
  } catch (err) {
    console.error('FetchParentProfileError:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}
