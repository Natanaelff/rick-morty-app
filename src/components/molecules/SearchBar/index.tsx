import React from 'react';
import styled, { useTheme } from 'styled-components/native';
import Ionicons from '../../atoms/Icon';
import { useTranslation } from 'react-i18next';

const Wrapper = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.cardBackground};
  border-radius: ${({ theme }) => theme.borderRadius.round}px;
  padding: 0 ${({ theme }) => theme.spacing.md}px;
  height: 50px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
`;

const Input = styled.TextInput.attrs(({ theme }) => ({
  placeholderTextColor: theme.colors.textSecondary,
}))`
  flex: 1;
  height: 100%;
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: ${({ theme }) => theme.fontSizes.md}px;
  margin-left: ${({ theme }) => theme.spacing.sm}px;
`;

const IconButton = styled.TouchableOpacity`
  padding: ${({ theme }) => theme.spacing.xs}px;
`;

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onClear?: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ value, onChangeText, onClear }) => {
  const theme = useTheme();
  const { t } = useTranslation();

  const handleClear = () => {
    onChangeText('');
    if (onClear) onClear();
  };

  return (
    <Wrapper>
      <Ionicons name="search-outline" size={20} color={theme.colors.secondary} />
      <Input
        testID="search-input"
        value={value}
        onChangeText={onChangeText}
        placeholder={t('common.search_placeholder')}
        autoCapitalize="none"
        autoCorrect={false}
      />
      {value.length > 0 && (
        <IconButton onPress={handleClear} activeOpacity={0.7}>
          <Ionicons name="close-circle" size={20} color={theme.colors.textSecondary} />
        </IconButton>
      )}
    </Wrapper>
  );
};

export default SearchBar;
