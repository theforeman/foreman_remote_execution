import 'core-js/shim';
import 'regenerator-runtime/runtime';

import { configure } from '@theforeman/test';
// eslint-disable-next-line import/no-extraneous-dependencies
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

// Mocking translation function
global.__ = str => str;
global.n__ = str => str;
global.Jed = { sprintf: str => str };
