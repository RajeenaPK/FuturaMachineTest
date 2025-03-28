const mongoose = require('mongoose');
const argon2 = require('argon2');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' }, 
  resetPasswordToken: { type: String },
  resetPasswordExpire: { type: Date },

}, { timestamps: true });

UserSchema.methods.getResetPasswordToken = async function () {
  const resetToken = Math.random().toString(36).substring(2, 15); 
  this.resetPasswordToken = await argon2.hash(resetToken);
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000; 
  return resetToken; 
};

module.exports = mongoose.model('users', UserSchema);
