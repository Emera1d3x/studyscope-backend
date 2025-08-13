import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const BaseUserSchema = new Schema(
  {
    role: { type: String, enum: ['parent', 'student'], required: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: false },
    loginMethod: { type: String, required: true },
    emailVerified: { type: Boolean, default: false },
    verificationToken: Number,
    verificationTokenExpiresAt: Date,
    resetPasswordToken: String,
    resetPasswordExpiresAt: Date,
  },
  { discriminatorKey: 'role', timestamps: true }
);

const ParentSchema = new Schema({
  phoneNumber: { type: String, required: false },
  paymentHistory: [
    {
      date: { type: Date, required: true },
      amount: { type: Number, required: true },
      description: { type: String },
    },
  ],
});

const StudentSchema = new Schema({
  parentId: { type: Schema.Types.ObjectId, ref: 'User', required: false },
});

const BaseUserModel = model('User', BaseUserSchema);

export const ParentModel = BaseUserModel.discriminator('parent', ParentSchema);
export const StudentModel = BaseUserModel.discriminator('student', StudentSchema);

export default BaseUserModel;
