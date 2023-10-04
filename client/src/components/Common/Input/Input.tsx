import React from 'react';
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
    // ** I Implemented like this for "input free text" task 
    // -- I Could just put type number in input props
    if (type === 'number' && !numericRegex.test(inputValue) && inputValue !== '') return;
    onChange(inputValue); 
  };

  return (
    <div className={`common-input ${className}`}>
      {title && <div className="input-title">{title}</div>}
      <AutoComplete
        options={suggestions.map((suggestion) => ({ value: suggestion }))}
        onSelect={(selectedValue) => handleInputChange(selectedValue)} //
        onChange={(inputValue) => handleInputChange(inputValue)} 
        value={value} 
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
