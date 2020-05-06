import {expect} from 'chai';
import {errorIfNotExists, exists, notExists} from '../../src/scaffold/utils/exists';

describe('exists', () => {
    it ('should return false if x is null', () => {
        expect(exists(null)).to.be.false;
    });

    it ('should return false if x is undefined', () => {
        expect(exists(undefined)).to.be.false;
    });

    it ('should return true if x is 0', () => {
        expect(exists(0)).to.be.true;
    });

    it ('should return true if x is an empty string', () => {
        expect(exists('')).to.be.true;
    });

    it ('should return true if x is an empty array', () => {
        expect(exists([])).to.be.true;
    });

    it ('should return true if x is an empty object', () => {
        expect(exists({})).to.be.true;
    });
});

describe('notExists', () => {
    it ('should return true if x is null', () => {
        expect(notExists(null)).to.be.true;
    });

    it ('should return true if x is undefined', () => {
        expect(notExists(undefined)).to.be.true;
    });

    it ('should return false if x is 0', () => {
        expect(notExists(0)).to.be.false;
    });

    it ('should return false if x is an empty string', () => {
        expect(notExists('')).to.be.false;
    });

    it ('should return false if x is an empty array', () => {
        expect(notExists([])).to.be.false;
    });

    it ('should return false if x is an empty object', () => {
        expect(notExists({})).to.be.false;
    });
});

describe('errorIfNotExists', () => {
    it ('should throw an error if x is undefined', () => {
        expect(errorIfNotExists.bind(this, undefined)).to.throw();
    });
    it ('should throw an error if x is null', () => {
        expect(errorIfNotExists.bind(this, null)).to.throw();
    });
    it ('should throw an error with the corresponding message if x is undefined', () => {
        expect(errorIfNotExists.bind(this,undefined, 'This is my custom test error!')).to.throw('This is my custom test error!');
    });
    it ('should throw an error with the corresponding message if x is null', () => {
        expect(errorIfNotExists.bind(this, null, 'This is my custom test error!')).to.throw('This is my custom test error!');
    });
    it ('should return the value of x if x is neither null nor undefined', () => {
       expect(errorIfNotExists(5)).to.equal(5);
        expect(errorIfNotExists(0)).to.equal(0);
        expect(errorIfNotExists('')).to.equal('');
        const arr = [];
        expect(errorIfNotExists(arr)).to.equal(arr);
        const obj = {};
        expect(errorIfNotExists(obj)).to.equal(obj);
    });
});