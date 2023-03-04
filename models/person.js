const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

const url = process.env.MONGODB_URI;

console.log("connecting to", url);
mongoose
  .connect(url)
  .then((result) => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connecting to MongoDB:", error.message);
  });

function hasOneHyphen(val) {
 return (val.match(/-/g) || []).length === 1; // merkkijonossa olevien '-' merkkien määrä === 1
}

function correctAreaCode(val) {
  console.log("correctForm", JSON.stringify(val))
  const parts = val.split('-');
  return (parts[0].length === 2 || parts[0].length === 3) && (/^\d+$/.test(parts[0])); // suuntanumero on 2 tai 3 numeroa
}

function correctNumber(val) {
  console.log("correctForm", JSON.stringify(val))
  const parts = val.split('-');
  return (parts[1].length >= 8-parts[0].length) && (/^\d+$/.test(parts[1])); // yhteensä 8 numeroa
}

const many = [
  { validator: hasOneHyphen, msg: '{VALUE} should have one hyphen "-"' },
  { validator: correctAreaCode, msg: `{VALUE} area code should be 2 or 3 digits` },
  { validator: correctNumber, msg: `{VALUE} should have at least 5 numbers after hyphen "-"` },
];

const personSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 3 },
  number: { type: String, required: true, minlengt: 8, validate: many },
});

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Person", personSchema);
