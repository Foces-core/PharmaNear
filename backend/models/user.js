import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const JWT_SECRET = process.env.JWT_SECRET; // put in .env in production

function UserSchema() {
  const UserSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "user",
    },
  });

  // Hash password before saving
  UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  });

  // Method to compare passwords
  UserSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
  };

  // Method to generate JWT
  UserSchema.methods.generateJWT = function () {
    return jwt.sign(
      { id: this._id, email: this.email, role: this.role },
      JWT_SECRET,
      { expiresIn: "1h" }
    );
  };

  const Users = mongoose.model("Users", UserSchema);
  return Users;
}

export default UserSchema;
