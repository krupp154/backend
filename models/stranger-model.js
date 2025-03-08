const mongoose = require("mongoose");

const strangerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  isActive: {type: Boolean, default: true}
});

const Stranger = mongoose.model("Stranger", strangerSchema);

module.exports = Stranger;
