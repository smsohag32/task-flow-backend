import mongoose from "mongoose";
const { Schema } = mongoose;
const VerificationCodeSchema = new Schema(
   {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
      code: { type: String, required: true },
      expiresAt: { type: Date, required: true },
   },
   { timestamps: true }
);

const VerificationCode = mongoose.model("VerificationCode", VerificationCodeSchema);
export default VerificationCode;
