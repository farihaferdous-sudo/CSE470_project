import User from "../models/User.js";

export const createUser = async (req, res) => {
  try {
    console.log("Incoming body:", req.body);

    const { username, email, password, role } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "username, email and password are required" });
    }

    if (!role || !["donor", "receiver"].includes(role)) {
      return res.status(400).json({ message: "Role must be 'donor' or 'receiver'" });
    }

    const userExists = await User.findOne({ $or: [{ email }, { username }] });

    if (userExists) {
      return res.status(400).json({ message: "User already exists (email or username)" });
    }

    const user = await User.create(req.body);

    res.status(201).json(user);
  } catch (error) {
    console.error("CREATE USER ERROR FULL:", error);
    res.status(500).json({ message: error.message });
  }
};


export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.password !== password)
      return res.status(401).json({ message: "Invalid password" });

    res.json({
      message: "Login success",
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// @desc    Get all user
// @route   GET /api/user
// @access  Public
export const getUser = async (req, res) => {
  try {
    const user = await User.find();
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add notification to user
// @route   PUT /api/user/:id/notifications
// @access  Public
export const addNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const { notification } = req.body;

    const user = await User.findByIdAndUpdate(
      id,
      { $push: { notifications: notification } },
      { new: true }
    );

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};