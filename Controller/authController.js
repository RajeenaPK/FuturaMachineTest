const User = require('../Model/user');
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');
const bcrypt = require('bcryptjs');

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    let user = await User.findOne({ email });

    if (user) return res.status(400).json({ msg: 'User already exists' });

       req.body.password = await argon2.hash(req.body.password);
        console.log("check",req.body);
        
    const databaseData=await User.create(req.body)
    console.log("final check",databaseData);

    res.status(200).json({ msg: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    const isMatch = await argon2.verify(user.password, password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    console.log('user',user);

    if (!user) return res.status(404).json({ msg: 'User not found' });

    const resetToken = await user.getResetPasswordToken();
    console.log("Reset Token",resetToken);
    await user.save();

    const resetUrl = `${req.protocol}://${req.get('host')}/api/auth/reset-password/${resetToken}`;
    console.log("Url",resetUrl);
    const message = `You requested a password reset. Click this link to reset: \n\n ${resetUrl} \n\nThis link expires in 10 minutes.`;
    await sendEmail({ email: user.email, subject: 'Password Reset', message });

    res.json({ msg: 'Password reset link sent to email' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    
    console.log("Received Token:", token);
    
    const user = await User.findOne({ resetPasswordExpire: { $gt: Date.now() } });
    console.log('User' ,user);
    if (!user) {
      return res.status(400).json({ msg: 'Invalid or expired token' });
    }

    console.log("Stored Hashed Token:", user.resetPasswordToken);

    const isMatch = await argon2.verify(user.resetPasswordToken, token);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid or expired token' });
    }

    user.password = await argon2.hash(password);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.json({ msg: 'Password reset successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
};

