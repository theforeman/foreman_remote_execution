import { registerRoutes } from 'foremanReact/routes/RoutingService';
import routes from './Routes/routes';
import registerReducers from './react_app/extend/reducers';
import registerFills from './react_app/extend/fills';

registerRoutes('foreman_remote_execution', routes);
registerReducers();
registerFills();
