/* eslint-disable no-use-before-define, func-names */
import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const schema = new Schema({
  name: { type: String, required: true,
          minlength: 3,
          validate: { validator: duplicateDogNameValidator } },
  age: { type: Number },
  health: { type: Number, min: 0, max: 100 },
  toy: { type: String, enum: ['Bones', 'Kibble', 'Frisbee'] },
  dateCreated: { type: Date, default: Date.now },
});

schema.methods.feed = function() {
  this.health += 10;
  if (this.health > 100) this.health = 100;

  // this.save((err, dog) => {
  //   cb(err, dog);
  // });
};

// sync validator:
// function duplicateDogNameValidator(name) {
//   return true;
// }

// async validator
function duplicateDogNameValidator(name, cb) {
  this.model('Dog').find({ name }, (err, dogs) => {
    cb(!dogs.length);
  });
}


module.exports = mongoose.model('Dog', schema);
