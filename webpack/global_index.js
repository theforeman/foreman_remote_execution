import { registerRoutes } from 'foremanReact/routes/RoutingService';
import routes from './Routes/routes';
import fillregistrationAdvanced from './react_app/extend/fillregistrationAdvanced';
import fillRecentJobsCard from './react_app/extend/fillRecentJobsCard';
import registerReducers from './react_app/extend/reducers';
import registerKebabJobAction from './react_app/extend/fills/fillJobKebabItem';

registerReducers();
registerRoutes('foreman_remote_execution', routes);
fillRecentJobsCard();
fillregistrationAdvanced();
registerKebabJobAction();
