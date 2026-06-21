import React from 'react';
import { StyleSheet } from 'react-native';
import styled, { useTheme } from 'styled-components/native';
import { useTranslation } from 'react-i18next';
import Text from '../../atoms/Text';

const styles = StyleSheet.create({
  code: { fontWeight: 'bold' },
  date: { marginTop: 2 },
});

// Air dates come from the API as English strings (e.g. "December 2, 2013").
// Render them in the active locale, falling back to the raw value if the
// runtime can't parse/format it.
const formatAirDate = (raw: string, language: string): string => {
  const date = new Date(raw);
  if (isNaN(date.getTime())) return raw;
  const locale = language.startsWith('pt') ? 'pt-BR' : 'en-US';
  try {
    return date.toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return raw;
  }
};

const Container = styled.View`
  flex-direction: row;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.md}px;
  background-color: ${({ theme }) => theme.colors.cardBackground};
  border-radius: ${({ theme }) => theme.borderRadius.md}px;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const CodeBadge = styled.View`
  background-color: ${({ theme }) => theme.colors.cyanSoft};
  padding: ${({ theme }) => `${theme.spacing.xs}px ${theme.spacing.sm}px`};
  border-radius: ${({ theme }) => theme.borderRadius.sm}px;
  margin-right: ${({ theme }) => theme.spacing.md}px;
  min-width: 75px;
  align-items: center;
`;

const Info = styled.View`
  flex: 1;
`;

interface Episode {
  id: string;
  name: string;
  air_date: string;
  episode: string;
}

interface EpisodeListItemProps {
  episode: Episode;
}

export const EpisodeListItem: React.FC<EpisodeListItemProps> = ({ episode }) => {
  const theme = useTheme();
  const { i18n } = useTranslation();

  return (
    <Container>
      <CodeBadge>
        <Text variant="caption" color={theme.colors.secondary} style={styles.code} noMargin>
          {episode.episode}
        </Text>
      </CodeBadge>
      <Info>
        <Text variant="bold" noMargin numberOfLines={1}>
          {episode.name}
        </Text>
        <Text variant="caption" noMargin style={styles.date}>
          {formatAirDate(episode.air_date, i18n.language)}
        </Text>
      </Info>
    </Container>
  );
};

export default EpisodeListItem;
