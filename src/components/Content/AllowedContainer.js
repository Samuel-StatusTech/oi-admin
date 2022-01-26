import React, { memo } from 'react';

const AllowedContainer = ({ children }) => {
  console.clear();
  return <div>{children}</div>;
};

export default memo(AllowedContainer);
