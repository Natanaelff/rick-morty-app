import React from 'react';
import { ActivityIndicatorProps } from 'react-native';
import styled from 'styled-components/native';

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.lg}px;
`;

const Spinner = styled.ActivityIndicator.attrs(({ theme }) => ({
  color: theme.colors.primary,
}))``;

interface LoadingSpinnerProps extends ActivityIndicatorProps {
  fullScreen?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ fullScreen, size = 'large', ...props }) => {
  if (fullScreen) {
    return (
      <Container style={{ flex: 1 }}>
        <Spinner size={size} {...props} />
      </Container>
    );
  }
  return <Spinner size={size} {...props} />;
};

export default LoadingSpinner;
