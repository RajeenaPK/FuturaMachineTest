const User = require('../Model/user');
const argon2 = require('argon2');

exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ msg: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.updateUserProfile = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    let user = await User.findById(req.user.id);

    if (!user) return res.status(404).json({ msg: 'User not found' });

    if (name) user.name = name;
    if (email) user.email = email;

    if (password) {
      user.password = await argon2.hash(password);
    }

    await user.save();
    res.json({ msg: 'Profile updated successfully', user: { name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.getAllUsers = async (req, res) => {
    try {
      const users = await User.find({ role: "user" }).select('-password');
      res.json(users);
    } catch (err) {
      res.status(500).json({ msg: 'Server error' });
    }
  };
  

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    await User.deleteOne({ _id: req.params.id });
    res.json({ msg: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};
