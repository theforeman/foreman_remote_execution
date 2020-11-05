import { registerReducer } from 'foremanReact/common/MountingService';
import rootReducer from '../redux/reducers';

export default registerReducer('foremanRemoteExecutionReducers', rootReducer);
