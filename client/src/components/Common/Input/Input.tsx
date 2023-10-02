import React from 'react';
import { Input, InputProps } from 'antd';
import { Modify } from '../../../utils';


type CommonInputProps = Modify<InputProps ,{
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}>

const CommonInput: React.FC<CommonInputProps> = ({ placeholder, value, onChange, className, ...restProps }) => {
  return (
    <Input
      className={className}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};

export default CommonInput;
