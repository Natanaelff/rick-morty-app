import React from 'react';
import styled from 'styled-components/native';
import { SafeAreaView } from 'react-native-safe-area-context';

const StyledSafeArea = styled(SafeAreaView)`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

interface ScreenContainerProps {
  children: React.ReactNode;
  edges?: Array<'top' | 'right' | 'bottom' | 'left'>;
}

export const ScreenContainer: React.FC<ScreenContainerProps> = ({
  children,
  edges = ['bottom', 'left', 'right'],
}) => {
  return <StyledSafeArea edges={edges}>{children}</StyledSafeArea>;
};

export default ScreenContainer;
