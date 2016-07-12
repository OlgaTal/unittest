/* eslint-disable no-unused-expressions, no-underscore-dangle, func-names */
const expect = require('chai').expect;
const sinon = require('sinon');   // stub
const Dog = require('../../dst/models/dog');

describe('Dog', () => {
  beforeEach(() => {
    sinon.stub(Dog, 'find').yields(null, []); // create a fake method
  });
  afterEach(() => {
    Dog.find.restore();
  });
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
    it('should NOT create a dog object - duplicate dog found in DB', done => {
      Dog.find.yields(null, [{ name: 'max' }]); // create a fake method
      const d = new Dog({ name: 'max', age: 3, health: 50, toy: 'Bones' });
      d.validate(err => {
        expect(err).to.be.ok;
        sinon.assert.calledWith(Dog.find, { name: 'max' });  // this is a spy
        done();
      });
    });
  });
  // describe('#feed', () => {
  //   it('should add 10 to the dogs health', sinon.test(function (done) {
  //     const d = new Dog({ name: 'fido', age: 3, health: 50, toy: 'Bones' });
  //     this.stub(d, 'save').yields(null, { health: 60 });
  //     d.feed((health) => {
  //       expect(health).to.equal(60);
  //       done();
  //     });
  //   }));
  // });

  describe('#feed', () => {
    it('should add 10 to the dogs health', () => {
      const d = new Dog({ name: 'fido', age: 3, health: 50, toy: 'Bones' });
      d.feed();
      expect(d.health).to.equal(60);
    });
    it('should NOT add 10 to the dogs health - it is already 100', () => {
      const d = new Dog({ name: 'fido', age: 3, health: 100, toy: 'Bones' });
      d.feed();
      expect(d.health).to.equal(100);
    });
  });
});
