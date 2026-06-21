import React from 'react';
import styled, { useTheme } from 'styled-components/native';
import Text from '../Text';

interface BadgeProps {
  status: 'Alive' | 'Dead' | 'unknown' | string;
  text: string;
}

const BadgeContainer = styled.View<{ bgColor: string; borderColor: string }>`
  padding: ${({ theme }) => `${theme.spacing.xs}px ${theme.spacing.sm}px`};
  border-radius: ${({ theme }) => theme.borderRadius.round}px;
  background-color: ${({ bgColor }) => bgColor};
  align-self: flex-start;
  flex-direction: row;
  align-items: center;
  border-width: 1px;
  border-color: ${({ borderColor }) => borderColor};
`;

const StatusDot = styled.View<{ dotColor: string }>`
  width: 7px;
  height: 7px;
  border-radius: 4px;
  background-color: ${({ dotColor }) => dotColor};
  margin-right: 6px;
  shadow-color: ${({ dotColor }) => dotColor};
  shadow-offset: 0px 0px;
  shadow-opacity: 0.9;
  shadow-radius: 4px;
  elevation: 3;
`;

export const Badge: React.FC<BadgeProps> = ({ status, text }) => {
  const theme = useTheme();

  let color = theme.colors.badgeUnknown;

  const normalizedStatus = status.toLowerCase();

  if (normalizedStatus === 'alive') {
    color = theme.colors.badgeAlive;
  } else if (normalizedStatus === 'dead') {
    color = theme.colors.badgeDead;
  }

  // Derive a soft tinted pill background + hairline border from the status hue.
  const hexToRgba = (hex: string, alpha: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  return (
    <BadgeContainer
      bgColor={hexToRgba(color, '0.14')}
      borderColor={hexToRgba(color, '0.35')}
    >
      <StatusDot dotColor={color} />
      <Text variant="caption" color={color} noMargin style={{ fontWeight: '700', fontSize: 11, letterSpacing: 0.3 }}>
        {text}
      </Text>
    </BadgeContainer>
  );
};

export default Badge;
