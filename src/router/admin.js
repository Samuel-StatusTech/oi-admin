import React from 'react';
import Orgs, { Icon as OrgsIcon } from '../pages/Orgs';
import OrgsForm from '../pages/Orgs/form';
export default [
  {
    title: 'Configurações',
    path: '/organization',
    show: {
      role: 'master',
    },
    icon: OrgsIcon,
    allow: {
      allow_only_master: true,
    },
    content: <Orgs />,
    list: [
      {
        title: 'Clientes',
        path: '/organization',
        content: <Orgs />,
        paths: [
          {
            title: 'Configuração',
            route: '/organization',
          },
          {
            title: 'Clientes',
            route: '/organization',
          },
        ],
      },
      {
        path: '/organization/:idOrg',
        hide: true,
        content: <OrgsForm />,
        paths: [
          {
            title: 'Configuração',
            route: '/organization',
          },
          {
            title: 'Clientes',
            route: '/organization',
          },
        ],
      },
    ],
  },
];
