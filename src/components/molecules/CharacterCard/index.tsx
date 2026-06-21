import React from 'react';
import styled, { useTheme } from 'styled-components/native';
import { useTranslation } from 'react-i18next';
import Ionicons from '../../atoms/Icon';
import Text from '../../atoms/Text';
import Badge from '../../atoms/Badge';
import { translateValue } from '../../../i18n/translateValue';

const CardContainer = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.cardBackground};
  border-radius: ${({ theme }) => theme.borderRadius.lg}px;
  padding: ${({ theme }) => theme.spacing.md}px;
  padding-left: ${({ theme }) => theme.spacing.md + theme.spacing.sm}px;
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
  overflow: hidden;
  shadow-color: #000;
  shadow-offset: 0px 6px;
  shadow-opacity: 0.18;
  shadow-radius: 12px;
  elevation: 4;
`;

// Vertical bar whose color encodes the character's status at a glance.
const StatusRail = styled.View<{ railColor: string }>`
  position: absolute;
  left: 0px;
  top: 0px;
  bottom: 0px;
  width: 5px;
  background-color: ${({ railColor }) => railColor};
`;

const CharacterImage = styled.Image`
  width: 76px;
  height: 76px;
  border-radius: ${({ theme }) => theme.borderRadius.md}px;
  background-color: ${({ theme }) => theme.colors.cardBackgroundRaised};
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
`;

const InfoContainer = styled.View`
  flex: 1;
  margin-left: ${({ theme }) => theme.spacing.md}px;
  justify-content: center;
`;

const MetaText = styled(Text)`
  margin-top: 3px;
  margin-bottom: ${({ theme }) => theme.spacing.sm}px;
`;

const FavoriteButton = styled.TouchableOpacity<{ active: boolean }>`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme, active }) =>
    active ? `${theme.colors.favoriteActive}1F` : theme.colors.cardBackgroundRaised};
`;

// ---- Grid (2-column) variant ----
const GridContainer = styled.TouchableOpacity`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.cardBackground};
  border-radius: ${({ theme }) => theme.borderRadius.lg}px;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
  overflow: hidden;
  shadow-color: #000;
  shadow-offset: 0px 6px;
  shadow-opacity: 0.18;
  shadow-radius: 12px;
  elevation: 4;
`;

const GridTopRail = styled.View<{ railColor: string }>`
  height: 4px;
  background-color: ${({ railColor }) => railColor};
`;

const GridImage = styled.Image`
  width: 100%;
  height: 130px;
  background-color: ${({ theme }) => theme.colors.cardBackgroundRaised};
`;

const GridBody = styled.View`
  padding: ${({ theme }) => theme.spacing.md}px;
`;

const GridFavorite = styled.TouchableOpacity`
  position: absolute;
  top: ${({ theme }) => theme.spacing.sm}px;
  right: ${({ theme }) => theme.spacing.sm}px;
  width: 36px;
  height: 36px;
  border-radius: 18px;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.45);
`;

interface Character {
  id: string;
  name: string;
  status: string;
  species: string;
  gender: string;
  image: string;
}

interface CharacterCardProps {
  character: Character;
  isFavorite: boolean;
  onFavoriteToggle: () => void;
  onPress: () => void;
  grid?: boolean;
}

export const CharacterCard: React.FC<CharacterCardProps> = ({
  character,
  isFavorite,
  onFavoriteToggle,
  onPress,
  grid = false,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();

  const status = character.status.toLowerCase();
  const railColor =
    status === 'alive'
      ? theme.colors.badgeAlive
      : status === 'dead'
      ? theme.colors.badgeDead
      : theme.colors.badgeUnknown;

  const handleFavoritePress = (e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    onFavoriteToggle();
  };

  if (grid) {
    return (
      <GridContainer
        testID={`character-card-${character.id}`}
        accessibilityLabel={character.name}
        onPress={onPress}
        activeOpacity={0.85}
      >
        <GridTopRail railColor={railColor} />
        <GridImage source={{ uri: character.image }} />
        <GridFavorite
          testID={`card-favorite-${character.id}`}
          onPress={handleFavoritePress}
          activeOpacity={0.7}
        >
          <Ionicons
            name={isFavorite ? 'heart' : 'heart-outline'}
            size={20}
            color={isFavorite ? theme.colors.favoriteActive : theme.colors.white}
          />
        </GridFavorite>
        <GridBody>
          <Text variant="bold" numberOfLines={1}>
            {character.name}
          </Text>
          <MetaText variant="caption" numberOfLines={1}>
            {translateValue(t, 'species', character.species)} · {translateValue(t, 'gender', character.gender)}
          </MetaText>
          <Badge status={character.status} text={translateValue(t, 'status', character.status)} />
        </GridBody>
      </GridContainer>
    );
  }

  return (
    <CardContainer
      testID={`character-card-${character.id}`}
      accessibilityLabel={character.name}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <StatusRail railColor={railColor} />
      <CharacterImage source={{ uri: character.image }} />

      <InfoContainer>
        <Text variant="bold" numberOfLines={1}>
          {character.name}
        </Text>
        <MetaText variant="caption">
          {translateValue(t, 'species', character.species)} · {translateValue(t, 'gender', character.gender)}
        </MetaText>
        <Badge status={character.status} text={translateValue(t, 'status', character.status)} />
      </InfoContainer>

      <FavoriteButton
        testID={`card-favorite-${character.id}`}
        active={isFavorite}
        onPress={(e) => {
          e.stopPropagation(); // Avoid triggering onPress of card
          onFavoriteToggle();
        }}
        activeOpacity={0.7}
      >
        <Ionicons
          name={isFavorite ? 'heart' : 'heart-outline'}
          size={22}
          color={isFavorite ? theme.colors.favoriteActive : theme.colors.favoriteInactive}
        />
      </FavoriteButton>
    </CardContainer>
  );
};

export default CharacterCard;
