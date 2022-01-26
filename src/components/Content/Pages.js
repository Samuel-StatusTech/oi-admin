import React from 'react';
import { Switch, Route, useHistory } from 'react-router-dom';

import AdminRoutes from '../../router/admin';
import AllowedContainer from './AllowedContainer';

const Pages = ({ user, path }) => {
  const history = useHistory();
  const routes = path === '/dashboard';
  AdminRoutes.map((route) => {
    if (route.list) {
      return route.list;
    }

    return route;
  }).flat();

  return (
    <Switch>
      {routes.map((route, i) => (
        <Route
          key={i}
          path={path + route.path}
          exact
          component={() => (
            <div>
              <AllowedContainer user={user} route={route}>
                {React.cloneElement(route.content, {
                  history,
                })}
              </AllowedContainer>
            </div>
          )}
        ></Route>
      ))}
    </Switch>
  );
};

export default Pages;
