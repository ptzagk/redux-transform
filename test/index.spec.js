import { assert, expect } from 'chai';
import capitalize from 'lodash/capitalize';
import transformMiddleware from '..'

const transformationMap = {
  trim: field => field.trim(),
  capitalize: field => field.split(' ').map(word => capitalize(word)).join(' '),
  lowercase: field => field.toLowerCase(),
  singleSpace: field => field.replace(/  +/, ' '),
}

describe('transform middleware', () => {
  const doDispatch = () => {};
  const doGetState = () => {};
  const store = {dispatch: doDispatch, getState: doGetState};
  const nextHandler = transformMiddleware(transformationMap)(store);

  const streamActionWithTransformations = {
    type: 'STREAM_FIRSTNAME',
    field: '   mateusz  ',
    transformations: ['trim', 'capitalize'],
  }

  it('must return the action untouched if its doesn\'t specify transformations', done => {
    const streamAction = {
      type: 'STREAM_FIRSTNAME',
      field: '   mateusz  ',
    }

    const actionHandler = nextHandler(action => {
      assert.strictEqual(action, streamAction);
      done();
    });

    actionHandler(streamAction);
  });

  it('must perform the specified transformations and remove transformation field', done => {
    const streamActionWithTransformations = {
      type: 'STREAM_FIRSTNAME',
      field: '   mateusz  ',
      transformations: ['trim', 'capitalize'],
    }

    const result = {
      type: 'STREAM_FIRSTNAME',
      field: 'Mateusz'
    }

    const actionHandler = nextHandler(action => {
      expect(action).to.eql(result);
      done();
    });

    actionHandler(streamActionWithTransformations);
  });

});
