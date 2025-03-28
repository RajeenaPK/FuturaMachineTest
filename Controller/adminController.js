const User = require('../Model/user');

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
