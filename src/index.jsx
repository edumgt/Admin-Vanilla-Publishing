import { resolveInitialRoute } from './utils/routeResolver';

const targetRoute = resolveInitialRoute(window.localStorage);
window.location.replace(targetRoute);
