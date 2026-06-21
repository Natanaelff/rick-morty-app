import React, { useState, useEffect } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styled, { useTheme } from 'styled-components/native';
import Ionicons from '../../atoms/Icon';
import { useTranslation } from 'react-i18next';
import Text from '../../atoms/Text';
import Button from '../../atoms/Button';

// In-tree overlay (não usamos o <Modal> do RN: no iOS ele renderiza numa janela
// nativa separada que ferramentas de e2e/acessibilidade não enxergam).
const Backdrop = styled.Pressable`
  position: absolute;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  z-index: 100;
  elevation: 100;
  background-color: ${({ theme }) => theme.colors.overlay};
  justify-content: flex-end;
`;

const ContentContainer = styled.View`
  background-color: ${({ theme }) => theme.colors.cardBackground};
  border-top-left-radius: ${({ theme }) => theme.borderRadius.lg}px;
  border-top-right-radius: ${({ theme }) => theme.borderRadius.lg}px;
  padding: ${({ theme }) => theme.spacing.lg}px;
  max-height: 90%;
  border-top-width: 1px;
  border-top-color: ${({ theme }) => theme.colors.border};
`;

const Grabber = styled.View`
  width: 40px;
  height: 5px;
  border-radius: 3px;
  background-color: ${({ theme }) => theme.colors.border};
  align-self: center;
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
`;

const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
`;

const CloseButton = styled.TouchableOpacity`
  padding: ${({ theme }) => theme.spacing.xs}px;
`;

const Section = styled.View`
  margin-bottom: ${({ theme }) => theme.spacing.lg}px;
`;

const SectionTitle = styled(Text)`
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

const ChipsRow = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  margin: 0 -4px;
`;

const Chip = styled.TouchableOpacity<{ selected: boolean }>`
  padding: ${({ theme }) => `${theme.spacing.sm}px ${theme.spacing.md}px`};
  border-radius: ${({ theme }) => theme.borderRadius.round}px;
  background-color: ${({ theme, selected }) =>
    selected ? theme.colors.primary : theme.colors.cardBackgroundRaised};
  margin: 4px;
  border-width: 1px;
  border-color: ${({ theme, selected }) =>
    selected ? theme.colors.primary : theme.colors.border};
  ${({ theme, selected }) =>
    selected
      ? `shadow-color: ${theme.colors.glow}; shadow-offset: 0px 0px; shadow-opacity: 0.6; shadow-radius: 8px; elevation: 4;`
      : ''}
`;

const SpeciesInput = styled.TextInput.attrs(({ theme }) => ({
  placeholderTextColor: theme.colors.textSecondary,
}))`
  height: 50px;
  border-radius: ${({ theme }) => theme.borderRadius.md}px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
  padding: 0 ${({ theme }) => theme.spacing.md}px;
  color: ${({ theme }) => theme.colors.textPrimary};
  background-color: ${({ theme }) => theme.colors.cardBackgroundRaised};
`;

const Footer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: ${({ theme }) => theme.spacing.lg}px;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const compactButtonStyle = { minHeight: 46, paddingTop: 10, paddingBottom: 10 } as const;

const FooterButtonWrapper = styled.View`
  flex: 1;
`;

interface FilterModalProps {
  visible: boolean;
  currentStatus: string;
  currentGender: string;
  currentSpecies: string;
  onClose: () => void;
  onApply: (status: string, gender: string, species: string) => void;
  onClear: () => void;
}

export const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  currentStatus,
  currentGender,
  currentSpecies,
  onClose,
  onApply,
  onClear,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  const [status, setStatus] = useState(currentStatus);
  const [gender, setGender] = useState(currentGender);
  const [species, setSpecies] = useState(currentSpecies);

  // Sync state with props when modal opens
  useEffect(() => {
    if (visible) {
      setStatus(currentStatus);
      setGender(currentGender);
      setSpecies(currentSpecies);
    }
  }, [visible, currentStatus, currentGender, currentSpecies]);

  const handleApply = () => {
    onApply(status, gender, species);
    onClose();
  };

  const handleClear = () => {
    setStatus('');
    setGender('');
    setSpecies('');
    onClear();
    onClose();
  };

  const statusOptions = [
    { value: 'alive', label: t('filter.alive') },
    { value: 'dead', label: t('filter.dead') },
    { value: 'unknown', label: t('filter.unknown') },
  ];

  const genderOptions = [
    { value: 'female', label: t('filter.female') },
    { value: 'male', label: t('filter.male') },
    { value: 'genderless', label: t('filter.genderless') },
    { value: 'unknown', label: t('filter.unknown') },
  ];

  if (!visible) return null;

  return (
      <Backdrop onPress={onClose} accessible={false}>
        <ContentContainer
          accessible={false}
          onStartShouldSetResponder={() => true}
          style={{ paddingBottom: insets.bottom + theme.spacing.md }}
        >
          <Grabber />
          <Header>
            <Text variant="subtitle" noMargin>
              {t('filter.title')}
            </Text>
            <CloseButton onPress={onClose}>
              <Ionicons name="close" size={24} color={theme.colors.textPrimary} />
            </CloseButton>
          </Header>

          {/* Status Section */}
          <Section>
                <SectionTitle variant="label">{t('filter.status')}</SectionTitle>
                <ChipsRow>
                  {statusOptions.map((opt) => (
                    <Chip
                      key={opt.value}
                      testID={`chip-status-${opt.value}`}
                      selected={status.toLowerCase() === opt.value}
                      onPress={() => setStatus(status.toLowerCase() === opt.value ? '' : opt.value)}
                    >
                      <Text
                        variant="caption"
                        color={status.toLowerCase() === opt.value ? theme.colors.background : theme.colors.textPrimary}
                        style={{ fontWeight: 'bold' }}
                        noMargin
                      >
                        {opt.label}
                      </Text>
                    </Chip>
                  ))}
                </ChipsRow>
              </Section>

              {/* Gender Section */}
              <Section>
                <SectionTitle variant="label">{t('filter.gender')}</SectionTitle>
                <ChipsRow>
                  {genderOptions.map((opt) => (
                    <Chip
                      key={opt.value}
                      testID={`chip-gender-${opt.value}`}
                      selected={gender.toLowerCase() === opt.value}
                      onPress={() => setGender(gender.toLowerCase() === opt.value ? '' : opt.value)}
                    >
                      <Text
                        variant="caption"
                        color={gender.toLowerCase() === opt.value ? theme.colors.background : theme.colors.textPrimary}
                        style={{ fontWeight: 'bold' }}
                        noMargin
                      >
                        {opt.label}
                      </Text>
                    </Chip>
                  ))}
                </ChipsRow>
              </Section>

              {/* Species Section */}
              <Section>
                <SectionTitle variant="label">{t('filter.species')}</SectionTitle>
                <SpeciesInput
                  value={species}
                  onChangeText={setSpecies}
                  placeholder={t('filter.species_placeholder')}
                  autoCorrect={false}
                  testID="species-input"
                />
              </Section>

            {/* Action Buttons */}
            <Footer>
              <FooterButtonWrapper>
                <Button
                  testID="filter-clear"
                  variant="outline"
                  title={t('filter.clear')}
                  onPress={handleClear}
                  fullWidth
                  style={compactButtonStyle}
                />
              </FooterButtonWrapper>
              <FooterButtonWrapper>
                <Button
                  testID="filter-apply"
                  variant="primary"
                  title={t('filter.apply')}
                  onPress={handleApply}
                  fullWidth
                  style={compactButtonStyle}
                />
              </FooterButtonWrapper>
            </Footer>
          </ContentContainer>
      </Backdrop>
  );
};

export default FilterModal;
