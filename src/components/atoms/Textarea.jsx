import React from 'react';

const Textarea = ({ className, rows = 3, ...props }) => {
  return (
    <textarea
      rows={rows}
      className={className}
      {...props}
    />
  );
};

export default Textarea;