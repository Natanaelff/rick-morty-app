import React from 'react';
import { TouchableOpacityProps, ActivityIndicator } from 'react-native';
import styled, { css, useTheme } from 'styled-components/native';
import Text from '../Text';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger';

interface ButtonProps extends TouchableOpacityProps {
  variant?: ButtonVariant;
  loading?: boolean;
  title: string;
  fullWidth?: boolean;
}

const StyledButton = styled.TouchableOpacity<{ variant: ButtonVariant; fullWidth?: boolean; disabled?: boolean }>`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => `${theme.spacing.md}px ${theme.spacing.lg}px`};
  border-radius: ${({ theme }) => theme.borderRadius.md}px;
  min-height: 48px;
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};
  align-self: ${({ fullWidth }) => (fullWidth ? 'stretch' : 'center')};

  ${({ theme, variant }) => {
    switch (variant) {
      case 'secondary':
        return css`
          background-color: ${theme.colors.secondary};
        `;
      case 'outline':
        return css`
          background-color: transparent;
          border: 2px solid ${theme.colors.primary};
        `;
      case 'danger':
        return css`
          background-color: ${theme.colors.error};
        `;
      case 'primary':
      default:
        return css`
          background-color: ${theme.colors.primary};
        `;
    }
  }}
`;

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  loading,
  title,
  fullWidth,
  disabled,
  ...props
}) => {
  const theme = useTheme();

  const getTextColor = () => {
    if (variant === 'outline') return theme.colors.primary;
    if (variant === 'danger') return theme.colors.white;
    // Primary/secondary sit on bright neon fills — dark text reads best.
    return theme.colors.background;
  };

  return (
    <StyledButton
      variant={variant}
      fullWidth={fullWidth}
      disabled={disabled || loading}
      activeOpacity={0.7}
      {...props}
    >
      {loading ? (
        <ActivityIndicator size="small" color={getTextColor()} />
      ) : (
        <Text
          variant="bold"
          style={{ color: getTextColor() }}
          noMargin
        >
          {title}
        </Text>
      )}
    </StyledButton>
  );
};

export default Button;
