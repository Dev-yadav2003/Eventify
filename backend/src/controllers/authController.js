import { createUser, findUserByEmail, matchPassword } from "../models/User.js";
import { generateToken } from "../utils/generateToken.js";

export const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  const userExists = await findUserByEmail(email);
  if (userExists) {
    res.status(400);
    throw new Error("User already exists.");
  }

  const user = await createUser({ name, email, password, role });

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user._id),
  });
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await findUserByEmail(email, { includePassword: true });

  if (!user || !(await matchPassword(password, user.password))) {
    res.status(401);
    throw new Error("Invalid email or password.");
  }

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user._id),
  });
};

export const getCurrentUser = async (req, res) => {
  res.json(req.user);
};
