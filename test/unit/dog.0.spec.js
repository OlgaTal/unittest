/* eslint-disable no-unused-expressions, no-underscore-dangle, func-names */
const expect = require('chai').expect;
const sinon = require('sinon');   // stub
const Dog = require('../../dst/models/dog');

describe('Dog', () => {
  describe('constructor', () => {
    it('should create a dog object', (done) => {
      const d = new Dog({ name: 'Fido', age: 3, health: 100, toy: 'Bones' });
      d.validate(err => {
        expect(err).to.be.undefined;
        expect(d.name).to.equal('Fido');
        expect(d._id).to.be.ok;
        expect(d.dateCreated).to.be.ok;
        done();
      });
    });
    it('should NOT create a dog object - negative health', (done) => {
      const d = new Dog({ name: 'Fido', age: 3, health: -50, toy: 'Bones' });
      d.validate(err => {
        expect(err).to.be.ok;
        done();
      });
    });
    it('should NOT create a dog object - no name', (done) => {
      const d = new Dog({ age: 3, health: 50, toy: 'Bones' });
      d.validate(err => {
        expect(err).to.be.ok;
        done();
      });
    });
    it('should NOT create a dog object - invalid toy', (done) => {
      const d = new Dog({ name: 'Fido', age: 3, health: 50, toy: 'Cat' });
      d.validate(err => {
        expect(err).to.be.ok;
        done();
      });
    });
    it('should NOT create a dog object - duplicate dog found in DB',
    sinon.test(function (done) {
      this.stub(Dog, 'find').yields(null, [{ name: 'max' }]); // create a fake method
      const d = new Dog({ name: 'max', age: 3, health: 50, toy: 'Bones' });
      d.validate(err => {
        expect(err).to.be.ok;
        sinon.assert.calledWith(Dog.find, { name: 'max' });  // this is a spy
        done();
      });
    }));
  });
});
