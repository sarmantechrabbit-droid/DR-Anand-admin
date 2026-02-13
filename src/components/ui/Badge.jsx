import React from 'react';

const Badge = ({ status, children }) => {
  const variants = {
    success: 'bg-green-100 text-green-700 border-green-200',
    warning: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    danger: 'bg-red-100 text-red-700 border-red-200',
    info: 'bg-primary-100 text-primary-700 border-primary-200',
    default: 'bg-gray-100 text-gray-700 border-gray-200',
    Active: 'bg-green-100 text-green-700 border-green-200',
    Critical: 'bg-red-100 text-red-700 border-red-200',
    Recovering: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    Confirmed: 'bg-green-100 text-green-700 border-green-200',
    Pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    Cancelled: 'bg-red-100 text-red-700 border-red-200',
  };

  const className = variants[status] || variants.default;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${className}`}
    >
      {children || status}
    </span>
  );
};

export default Badge;
