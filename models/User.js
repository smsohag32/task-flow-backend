import mongoose from "mongoose";
import bcrypt from "bcrypt";
const { Schema } = mongoose;

const UserSchema = new Schema(
   {
      name: { type: String, required: true },
      email: { type: String, required: true, unique: true, lowercase: true },
      password: { type: String, required: true },
      googleAuthSecret: { type: String },
      isGoogleConnected: { type: Boolean, default: false },
      googleId: { type: String },
      createdAt: { type: Date, default: Date.now },
   },
   { timestamps: true }
);

UserSchema.pre("save", async function (next) {
   if (!this.isModified("password")) return next();

   try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
      next();
   } catch (error) {
      next(error);
   }
});

UserSchema.methods.comparePassword = async function (candidatePassword) {
   return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.models.users || mongoose.model("users", UserSchema);

export default User;
