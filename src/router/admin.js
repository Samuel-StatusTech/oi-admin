import React from 'react';
import Orgs, { Icon as OrgsIcon } from '../pages/Orgs';

export default [
  {
    title: 'Clientes',
    path: '/organization',
    show: {
      role: 'master',
    },
    icon: OrgsIcon,
    allow: {
      allow_only_master: true,
    },
    content: <Orgs />,
  },
];
