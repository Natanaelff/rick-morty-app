import React, { useLayoutEffect } from 'react';
import { FlatList, View, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useQuery } from '@apollo/client/react';
import styled, { useTheme } from 'styled-components/native';
import Icon from '../../components/atoms/Icon';
import { useTranslation } from 'react-i18next';

import { GET_CHARACTER_DETAIL } from '../../graphql/queries';
import { toCharacter, toEpisodes } from '../../graphql/mappers';
import { translateValue } from '../../i18n/translateValue';
import { CharacterDetailRouteProp, NavigationProp } from '../../navigation/types';
import { useFavorites } from '../../store/FavoritesContext';

import ScreenContainer from '../../components/templates/ScreenContainer';
import Text from '../../components/atoms/Text';
import Button from '../../components/atoms/Button';
import Badge from '../../components/atoms/Badge';
import LoadingSpinner from '../../components/atoms/LoadingSpinner';
import EpisodeListItem from '../../components/molecules/EpisodeListItem';

const HeaderContainer = styled.View`
  align-items: center;
  padding: ${({ theme }) => theme.spacing.lg}px 0px;
`;

// Portal ring: a neon-green halo around the character portrait.
const PortalRing = styled.View`
  width: 180px;
  height: 180px;
  border-radius: 90px;
  justify-content: center;
  align-items: center;
  border-width: 3px;
  border-color: ${({ theme }) => theme.colors.primary};
  background-color: ${({ theme }) => theme.colors.cardBackground};
  shadow-color: ${({ theme }) => theme.colors.glow};
  shadow-offset: 0px 0px;
  shadow-opacity: 0.7;
  shadow-radius: 22px;
  elevation: 12;
`;

const LargeImage = styled.Image`
  width: 150px;
  height: 150px;
  border-radius: 75px;
  background-color: ${({ theme }) => theme.colors.cardBackgroundRaised};
`;

const NameText = styled(Text)`
  margin-top: ${({ theme }) => theme.spacing.md}px;
  margin-bottom: ${({ theme }) => theme.spacing.xs}px;
`;

const InfoCard = styled.View`
  background-color: ${({ theme }) => theme.colors.cardBackground};
  border-radius: ${({ theme }) => theme.borderRadius.lg}px;
  padding: ${({ theme }) => theme.spacing.md}px;
  margin: ${({ theme }) => `${theme.spacing.sm}px ${theme.spacing.md}px ${theme.spacing.lg}px ${theme.spacing.md}px`};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const InfoRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  padding-vertical: ${({ theme }) => theme.spacing.sm}px;
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colors.border}50;
`;

const InfoRowLast = styled(InfoRow)`
  border-bottom-width: 0px;
`;

const SectionTitle = styled(Text)`
  padding-horizontal: ${({ theme }) => theme.spacing.md}px;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

const ListWrapper = styled.View`
  flex: 1;
  padding-horizontal: ${({ theme }) => theme.spacing.md}px;
`;

const CenterContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.xl}px;
`;

export const CharacterDetailScreen: React.FC = () => {
  const route = useRoute<CharacterDetailRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const theme = useTheme();
  const { t } = useTranslation();
  const { toggleFavorite, isFavorite } = useFavorites();

  const { id } = route.params;

  const { data, loading, error, refetch } = useQuery(GET_CHARACTER_DETAIL, {
    variables: { id },
  });

  const character = data?.character;
  const episodes = toEpisodes(character?.episode);

  // Setup favorite toggle button in navigation header
  useLayoutEffect(() => {
    if (character) {
      const fav = isFavorite(character.id ?? '');
      navigation.setOptions({
        headerRight: () => (
          <TouchableOpacity
            testID="detail-favorite-button"
            onPress={() => toggleFavorite(toCharacter(character))}
            activeOpacity={0.7}
          >
            <Icon
              name={fav ? 'heart' : 'heart-outline'}
              size={24}
              color={fav ? theme.colors.favoriteActive : theme.colors.textPrimary}
            />
          </TouchableOpacity>
        ),
      });
    }
  }, [navigation, character, isFavorite, toggleFavorite, theme]);

  if (loading) {
    return (
      <ScreenContainer>
        <LoadingSpinner fullScreen />
      </ScreenContainer>
    );
  }

  if (error) {
    return (
      <ScreenContainer>
        <CenterContainer>
          <Icon name="alert-circle" size={64} color={theme.colors.error} />
          <Text variant="subtitle" style={{ marginTop: 16, marginBottom: 8 }} align="center">
            {t('common.error')}
          </Text>
          <Text variant="body" color={theme.colors.textSecondary} style={{ marginBottom: 24 }} align="center">
            {error.message}
          </Text>
          <Button title={t('common.retry')} onPress={() => refetch()} />
        </CenterContainer>
      </ScreenContainer>
    );
  }

  const renderHeader = () => {
    if (!character) return null;

    return (
      <View>
        {/* Profile Card */}
        <HeaderContainer>
          <PortalRing>
            <LargeImage source={{ uri: character.image ?? undefined }} />
          </PortalRing>
          <NameText variant="title" align="center">
            {character.name}
          </NameText>
          <Badge
            status={character.status ?? 'unknown'}
            text={translateValue(t, 'status', character.status ?? 'unknown')}
          />
        </HeaderContainer>

        {/* Detailed Information */}
        <InfoCard>
          <InfoRow>
            <Text variant="label" noMargin>
              {t('details.species')}
            </Text>
            <Text variant="bold" noMargin>
              {translateValue(t, 'species', character.species)}
            </Text>
          </InfoRow>
          <InfoRow>
            <Text variant="label" noMargin>
              {t('details.gender')}
            </Text>
            <Text variant="bold" noMargin>
              {translateValue(t, 'gender', character.gender)}
            </Text>
          </InfoRow>
          <InfoRow>
            <Text variant="label" noMargin>
              {t('details.type')}
            </Text>
            <Text variant="bold" noMargin>
              {character.type || t('details.unknown_type')}
            </Text>
          </InfoRow>
          <InfoRow>
            <Text variant="label" noMargin>
              {t('details.origin')}
            </Text>
            <Text variant="bold" noMargin style={{ maxWidth: '60%', textAlign: 'right' }} numberOfLines={1}>
              {character.origin?.name || t('filter.unknown')}
            </Text>
          </InfoRow>
          <InfoRowLast>
            <Text variant="label" noMargin>
              {t('details.location')}
            </Text>
            <Text variant="bold" noMargin style={{ maxWidth: '60%', textAlign: 'right' }} numberOfLines={1}>
              {character.location?.name || t('filter.unknown')}
            </Text>
          </InfoRowLast>
        </InfoCard>

        {/* Episodes Section Title */}
        <SectionTitle variant="subtitle">
          {t('details.episodes')} ({episodes.length})
        </SectionTitle>
      </View>
    );
  };

  return (
    <ScreenContainer>
      <ListWrapper>
        <FlatList
          data={episodes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <EpisodeListItem episode={item} />}
          ListHeaderComponent={renderHeader}
          contentContainerStyle={{ paddingBottom: 30 }}
          showsVerticalScrollIndicator={false}
        />
      </ListWrapper>
    </ScreenContainer>
  );
};

export default CharacterDetailScreen;
