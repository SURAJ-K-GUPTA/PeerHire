const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../model/User");

const zod = require("zod");

const registerSchema = zod.object({
  name: zod.string().min(3).max(50),
  email: zod.string().email(),
  password: zod.string().min(6),
  role: zod.enum(["freelancer", "employer"]),
});

const loginSchema = zod.object({
  email: zod.string().email(),
  password: zod.string().min(6),
});


const userDetailsController = async (req, res) => {
    try {
      
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found", error: "User not found" });
        }
        const { name, email, _id, role } = user;
        res.status(200).json({ name, email, _id, role });
    } catch (error) {
        return res.status(500).json({ message: "Invalid request", error });
    }
}
const registerUserController = async (req, res) => {
  try {
    const result = registerSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: "Invalid request body", error: result.error });
    }

    const { name, email, password, role } = result.data;
    // check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists", error: "User already exists" });
    }
    // hash password

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    // create new user

    user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });
// create token
    const token = jwt.sign(
      { id: user._id, role, email },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );
    res.status(201).json({ token });
  } catch (error) {
    return res.status(500).json({ message: "Invalid request", error: error.message });
  }
};

const loginUserController = async (req, res) => {
  try {
    const result = loginSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: "Invalid request body", error: result.error });
    }
    const { email, password } = result.data;
    // check if user exists
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User does not exist", error: "User does not exist" });
    }
    // check if password is correct
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials", error: "Invalid credentials" });
    }
    // create token
    const token = jwt.sign({ id: user._id, email, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.status(200).json({ token });
  } catch (error) {
    return res.status(500).json({ message: "Invalid request", error: error.message });
  }
};

module.exports = { registerUserController, loginUserController, userDetailsController };
