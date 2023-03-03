// voit lisätä tietokantaan puhelinnumeroja sekä
// listata kaikki kannassa olevat numerot.

const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://taimikko2:${password}@fs-test.ssaeiiq.mongodb.net/phonebook?retryWrites=true&w=majority`;

mongoose.set("strictQuery", false);
mongoose.connect(url);

const noteSchema = new mongoose.Schema({
  name: String,
  number: String,
  //id: Number,
});

const Person = mongoose.model("Person", noteSchema);

if (process.argv.length <= 3) {
  console.log("phonebook:");
  Person.find({}).then((result) => {
    result.forEach((p) => {
      console.log(`${p.name} ${p.number}`);
    });
    mongoose.connection.close();
  });
} else {
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
    //id: Number,
  });

  person.save().then((result) => {
    console.log(`added ${person.name} number ${person.number} to phonebook`);
    mongoose.connection.close();
  });
}
