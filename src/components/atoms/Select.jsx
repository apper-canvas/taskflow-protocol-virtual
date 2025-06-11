import React from 'react';

const Select = ({ children, className, ...props }) => {
  return (
    <select
      className={className}
      {...props}
    >
      {children}
    </select>
  );
};

export default Select;