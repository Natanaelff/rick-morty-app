import styled, { css } from 'styled-components/native';

export type TextVariant = 'title' | 'subtitle' | 'body' | 'caption' | 'label' | 'bold';

interface TextProps {
  variant?: TextVariant;
  color?: string;
  align?: 'left' | 'center' | 'right';
  noMargin?: boolean;
}

export const Text = styled.Text<TextProps>`
  color: ${({ theme }) => theme.colors.textPrimary};
  text-align: ${({ align }) => align || 'left'};
  
  ${({ noMargin }) => noMargin && css`
    margin: 0;
    padding: 0;
  `}

  ${({ variant, theme }) => {
    switch (variant) {
      case 'title':
        return css`
          font-size: ${theme.fontSizes.xxl}px;
          font-weight: 800;
          line-height: 32px;
        `;
      case 'subtitle':
        return css`
          font-size: ${theme.fontSizes.lg}px;
          font-weight: 600;
          line-height: 24px;
        `;
      case 'bold':
        return css`
          font-size: ${theme.fontSizes.md}px;
          font-weight: 700;
          line-height: 22px;
        `;
      case 'caption':
        return css`
          font-size: ${theme.fontSizes.xs}px;
          font-weight: 400;
          color: ${theme.colors.textSecondary};
          line-height: 16px;
        `;
      case 'label':
        return css`
          font-size: ${theme.fontSizes.sm}px;
          font-weight: 600;
          color: ${theme.colors.textSecondary};
          line-height: 18px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        `;
      case 'body':
      default:
        return css`
          font-size: ${theme.fontSizes.md}px;
          font-weight: 400;
          line-height: 22px;
        `;
    }
  }}

  ${({ color }) => color && css`color: ${color};`}
`;

export default Text;
