import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const ParentSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String },
    loginMethod: { type: String, required: true },
    emailVerified: { type: Boolean, required: true },
    verificationToken: { type: Number },
    verificationTokenExpiresAt: { type: Date },
    resetPasswordToken: { type: String },
    resetPasswordExpiresAt: { type: Date },
    phoneNumber: { type: Number, required: true },
    paymentHistory: [
      {
        date: { type: Date, required: true },
        amount: { type: Number, required: true },
        description: { type: String },
      },
    ],
    students: [
      { type: Schema.Types.ObjectId, ref: 'Student' }
    ]
  },
  { collection: 'parents', timestamps: true }
); export const ParentModel = model('Parent', ParentSchema);

const StudentSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String },
    emailVerified: { type: Boolean, required: true },
    verificationToken: { type: Number, default: false },
    verificationTokenExpiresAt: { type: Date, default: false },
    parentId: { type: Schema.Types.ObjectId, ref: 'Parent' },
  },
  { collection: 'students', timestamps: true }
); export const StudentModel = model('Student', StudentSchema);

const AdminSchema = new Schema(
  {
    name: { type: String, required: true },
    password: { type: String },
  },
  { collection: 'admins', timestamps: true }
); export const AdminModel = model('Admin', AdminSchema);
