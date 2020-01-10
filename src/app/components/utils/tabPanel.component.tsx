import React from 'react';
import { Box } from '@material-ui/core';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  actualIndex: number;
}

export const TabPanel = (props: TabPanelProps) => {
  const { children, index, actualIndex, ...other } = props;

  return (
    <Box hidden={index !== actualIndex} p={2} {...other}>
      {children}
    </Box>
  );
};
