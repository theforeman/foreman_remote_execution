import { registerRoutes } from 'foremanReact/routes/RoutingService';
import routes from './Routes/routes';
import registerFills from './react_app/extend/Fills';

registerRoutes('foreman_remote_execution', routes);
registerFills();
