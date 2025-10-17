const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const SessionSchema = new Schema({
  sessionname: {
    type: String,
    required: true,
  },
  sectionID: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  seatcount: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  doctorname: {
    type: String,
    required: true,
  },
  speciality: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  timeslots: [
    {
      starttime: {
        type: String,
        required: true,
      },
      endtime: {
        type: String,
        required: true,
      },
    },
  ],
});

module.exports = mongoose.model("Session", SessionSchema);
