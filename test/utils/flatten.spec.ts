import {flatten} from '../../src/scaffold/utils/flatten';
import { expect } from 'chai';

describe('flatten', () => {
   it ('should flatten a two dimensional array into a corresponding one dimensional array', () => {
       const test = [
         [1,2,3],
         [4],
         [5,6,7,8,9],
         [],
         [10, 11, 12, 13]
       ];
       const expected = [1,2,3,4,5,6,7,8,9,10,11,12,13];
       expect(flatten(test)).to.deep.equal(expected);
   });
});