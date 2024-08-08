const mongoose = require("mongoose");

const transferSchema = new mongoose.Schema(
  {
    transferId: {
      type: String,
      required: true,
      unique: true,
    },
    time: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    transport_type: {
      type: String,
      required: true,
    },
    fromWarehouse: {
      type: String,
      required: true,
    },
    toWarehouse: {
      type: String,
      required: true,
    },
    responsiblePerson: {
      type: String,
      required: true,
    },
    notes: {
      type: String,
    },
    products: [
      {
        code: { type: String, required: true },
        name: { type: String, required: true },
        category: { type: String, required: true },
        unit: { type: String, required: true },
        quantity: { type: Number, required: true },
      },
    ],
    status: {
      type: String,
      enum: ["pending", "completed", "cancelled"],
      default: "pending",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    transferNotes: {
      type: String,
    },
    transferMethod: {
      type: String,
      default: "truck",
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Transfer = mongoose.model("Transfer", transferSchema);

module.exports = Transfer;
