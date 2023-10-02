import React from 'react';
import { Button } from 'antd';

interface CommonButtonProps {
  label: string;
  onClick: () => void;
  className?: string;
}

const CommonButton: React.FC<CommonButtonProps> = ({ label, onClick, className }) => {
  return (
    <Button className={className} onClick={onClick}>
      {label}
    </Button>
  );
};

export default CommonButton;
