import { registerRoutes } from 'foremanReact/routes/RoutingService';
import routes from './Routes/routes';
import fillregistrationAdvanced from './react_app/extend/fillregistrationAdvanced';
import fillRecentJobsCard from './react_app/extend/fillRecentJobsCard';
import fillFeaturesDropdown from './react_app/extend/fillRexFeaturesDropdown';
import fillKebabItems from './react_app/extend/fillKebabItems';
import registerReducers from './react_app/extend/reducers';

registerReducers();
registerRoutes('foreman_remote_execution', routes);
fillFeaturesDropdown();
fillRecentJobsCard();
fillregistrationAdvanced();
fillKebabItems();
