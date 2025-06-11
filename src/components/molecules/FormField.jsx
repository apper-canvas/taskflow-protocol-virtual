import React from 'react';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import Textarea from '@/components/atoms/Textarea';

const FormField = ({ label, name, value, onChange, type = 'text', error, options, rows, children, placeholder, className, labelClassName }) => {
  const inputId = `form-field-${name}`;

  const renderInput = () => {
    switch (type) {
      case 'select':
        return (
          <Select
            id={inputId}
            name={name}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={`w-full px-3 py-2 border rounded-button focus:outline-none focus:ring-2 focus:ring-primary transition-all ${
              error ? 'border-error focus:ring-error' : 'border-surface-300 focus:border-primary'
            } ${className || ''}`}
            placeholder={placeholder}
          >
            {options && options.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
            {children}
          </Select>
        );
      case 'textarea':
        return (
          <Textarea
            id={inputId}
            name={name}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            rows={rows || 3}
            className={`w-full px-3 py-2 border rounded-button focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all resize-none ${
              error ? 'border-error focus:ring-error' : 'border-surface-300 focus:border-primary'
            } ${className || ''}`}
            placeholder={placeholder}
          />
        );
      default:
        return (
          <Input
            id={inputId}
            name={name}
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={`w-full px-3 py-2 border rounded-button focus:outline-none focus:ring-2 focus:ring-primary transition-all ${
              error ? 'border-error focus:ring-error' : 'border-surface-300 focus:border-primary'
            } ${className || ''}`}
            placeholder={placeholder}
          />
        );
    }
  };

  return (
    <div>
      <label htmlFor={inputId} className={`block text-sm font-medium text-surface-700 mb-2 ${labelClassName || ''}`}>
        {label}
      </label>
      {renderInput()}
      {error && (
        <p className="mt-1 text-sm text-error">{error}</p>
      )}
    </div>
  );
};

export default FormField;