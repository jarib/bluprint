const expect = require('expect.js');
const mock = require('mock-fs');
const { handleActions } = require('../../dist/index.js');
const sinon = require('sinon');
const childProcess = require('child_process');

let spy;

describe('Test action: conditionals', function() {
  this.timeout(10000);

  beforeEach(function() {
    mock({});
    spy = sinon.spy(childProcess, 'spawnSync');
  });

  afterEach(function() {
    mock.restore();
    spy.restore();
  });

  it('Skips a false condition', async function() {
    const actions = [{
      action: 'prompt',
      questions: [{
        type: 'text',
        name: 'answer',
        message: 'What\'s the rumpus?',
      }],
      inject: ['nuthin'],
    }, {
      action: 'execute',
      condition: ['answer', 'different'],
      cmds: [['echo', ['cat']]],
    }, {
      action: 'execute',
      condition: ['answer', 'nuthin'],
      cmds: [['echo', ['dog']]],
    }];

    await handleActions(actions, null);

    expect(spy.calledWith('echo', ['cat'])).to.be(false);
    expect(spy.calledWith('echo', ['dog'])).to.be(true);
  });

  it('Doesn\'t skip an action if condition variable isn\'t found', async function() {
    const actions = [{
      action: 'prompt',
      questions: [{
        type: 'text',
        name: 'answer',
        message: 'What\'s the rumpus?',
      }],
      inject: ['nuthin'],
    }, {
      action: 'execute',
      condition: ['answr.something.else', 'different'],
      cmds: [['echo', ['cat']]],
    }];

    await handleActions(actions, null);

    expect(spy.calledWith('echo', ['cat'])).to.be(true);
  });
});
