import React, { useEffect, useState } from 'react';
import { AutoComplete, Input, InputProps } from 'antd';
import { Modify } from '../../../utils';
import './Input.scss';

type CommonInputProps = Modify<InputProps, {
  placeholder: string;
  value: string; // Make the value prop controllable
  onChange: (value: string) => void;
  className?: string;
  suggestions?: string[];
  title?: string;
}>;

const numericRegex = /^[+-]?\d+(\.\d*)?$/;

const CommonInput: React.FC<CommonInputProps> = ({
  placeholder,
  value,
  onChange,
  className = '',
  type,
  suggestions = [],
  title,
  ...restProps
}) => {
  const handleInputChange = (inputValue: string) => {
    if (type === 'number' && !numericRegex.test(inputValue) && inputValue !== '') return;
    onChange(inputValue); 
  };

  return (
    <div className={`common-input ${className}`}>
      {title && <div className="input-title">{title}</div>}
      <AutoComplete
        options={suggestions.map((suggestion) => ({ value: suggestion }))}
        onSelect={(selectedValue) => handleInputChange(selectedValue)} // Use local handler
        onChange={(inputValue) => handleInputChange(inputValue)} // Use local handler
        value={value} // Use local state
      >
        <Input
          placeholder={placeholder}
          {...restProps}
        />
      </AutoComplete>
    </div>
  );
};

export default CommonInput;
