import React, { useState, useLayoutEffect, useMemo } from 'react';
import { FlatList, RefreshControl, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useQuery } from '@apollo/client/react';
import { NetworkStatus } from '@apollo/client';
import styled, { useTheme } from 'styled-components/native';
import Icon from '../../components/atoms/Icon';
import { useTranslation } from 'react-i18next';

import { GET_CHARACTERS } from '../../graphql/queries';
import { toCharacters } from '../../graphql/mappers';
import { NavigationProp } from '../../navigation/types';
import { useFavorites } from '../../store/FavoritesContext';
import { useAppTheme } from '../../store/ThemeContext';
import { useDebounce } from '../../utils/useDebounce';
import { usePersistedState } from '../../utils/usePersistedState';

import ScreenContainer from '../../components/templates/ScreenContainer';
import SearchBar from '../../components/molecules/SearchBar';
import CharacterCard from '../../components/molecules/CharacterCard';
import FilterModal from '../../components/organisms/FilterModal';
import Text from '../../components/atoms/Text';
import Button from '../../components/atoms/Button';
import LoadingSpinner from '../../components/atoms/LoadingSpinner';

const Container = styled.View`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.md}px;
`;

const SearchRow = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.md}px;
  gap: ${({ theme }) => theme.spacing.sm}px;
`;

const SearchBarWrapper = styled.View`
  flex: 1;
`;

const FilterButton = styled.TouchableOpacity<{ active: boolean }>`
  height: 50px;
  width: 50px;
  background-color: ${({ theme, active }) =>
    active ? theme.colors.primary : theme.colors.cardBackground};
  border-radius: ${({ theme }) => theme.borderRadius.round}px;
  justify-content: center;
  align-items: center;
  border-width: 1px;
  border-color: ${({ theme, active }) => (active ? theme.colors.primary : theme.colors.border)};
`;

const ViewToggleButton = styled.TouchableOpacity`
  height: 50px;
  width: 50px;
  background-color: ${({ theme }) => theme.colors.cardBackground};
  border-radius: ${({ theme }) => theme.borderRadius.round}px;
  justify-content: center;
  align-items: center;
  border-width: 1px;
  border-color: ${({ theme }) => theme.colors.border};
`;

const CenterContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.xl}px;
`;

const HeaderIconsContainer = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md}px;
`;

// Box with headroom so the absolutely-positioned count never gets clipped by
// the native header pill (which clips overflow).
const FavoriteIconBox = styled.View`
  width: 36px;
  height: 30px;
  align-items: center;
  justify-content: center;
`;

const BadgeCount = styled.View`
  position: absolute;
  top: 0px;
  right: 0px;
  background-color: ${({ theme }) => theme.colors.favoriteActive};
  border-radius: 10px;
  min-width: 20px;
  height: 20px;
  padding-horizontal: 4px;
  justify-content: center;
  align-items: center;
  border-width: 1.5px;
  border-color: ${({ theme }) => theme.colors.cardBackground};
`;

const LanguageButton = styled.TouchableOpacity`
  padding: 4px;
`;

export const CharacterListScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const theme = useTheme();
  const { t, i18n } = useTranslation();
  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  const { isDark, setThemeMode, themeMode } = useAppTheme();

  // Search & Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 500);

  const [status, setStatus] = useState('');
  const [gender, setGender] = useState('');
  const [species, setSpecies] = useState('');

  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [viewMode, setViewMode] = usePersistedState<'list' | 'grid'>(
    '@rick_morty_explorer:view_mode',
    'list',
  );

  // GraphQL Query — pagination is handled by the Apollo cache field policy
  // (see graphql/client.ts), so there is no manual page/results local state.
  const { data, loading, error, refetch, fetchMore, networkStatus } = useQuery(
    GET_CHARACTERS,
    {
      variables: {
        page: 1,
        filter: {
          name: debouncedSearch || undefined,
          status: status || undefined,
          gender: gender || undefined,
          species: species || undefined,
        },
      },
      skip: showFavoritesOnly,
      notifyOnNetworkStatusChange: true,
    },
  );

  const characters = useMemo(
    () => toCharacters(data?.characters?.results),
    [data],
  );
  const hasMore = data?.characters?.info?.next != null;

  const isLoadingMore = networkStatus === NetworkStatus.fetchMore;
  const isRefreshing = networkStatus === NetworkStatus.refetch;
  const isInitialLoading =
    loading && characters.length === 0 && !isLoadingMore && !isRefreshing;

  // Change App Language (Toggle PT-BR / EN-US)
  const toggleLanguage = () => {
    const nextLang = i18n.language.startsWith('pt') ? 'en' : 'pt';
    i18n.changeLanguage(nextLang);
  };

  // Setup Header navigation buttons
  useLayoutEffect(() => {
    navigation.setOptions({
      title: showFavoritesOnly ? t('common.favorites') : 'Rick & Morty',
      headerRight: () => (
        <HeaderIconsContainer>
          {/* Language Toggle */}
          <LanguageButton onPress={toggleLanguage} activeOpacity={0.7}>
            <Text variant="caption" style={{ fontWeight: 'bold', color: theme.colors.primary }} noMargin>
              {i18n.language.startsWith('pt') ? 'EN' : 'PT'}
            </Text>
          </LanguageButton>

          {/* Theme Toggle */}
          <TouchableOpacity
            onPress={() => setThemeMode(isDark ? 'light' : 'dark')}
            activeOpacity={0.7}
          >
            <Icon
              name={isDark ? 'sunny' : 'moon'}
              size={22}
              color={theme.colors.textPrimary}
            />
          </TouchableOpacity>

          {/* Favorites Filter */}
          <TouchableOpacity
            testID="favorites-filter-toggle"
            onPress={() => setShowFavoritesOnly((prev) => !prev)}
            activeOpacity={0.7}
          >
            <FavoriteIconBox>
              <Icon
                name={showFavoritesOnly ? 'heart' : 'heart-outline'}
                size={24}
                color={showFavoritesOnly ? theme.colors.favoriteActive : theme.colors.textPrimary}
              />
              {favorites.length > 0 && (
                <BadgeCount>
                  <Text
                    variant="caption"
                    noMargin
                    style={{
                      fontSize: 11,
                      fontWeight: '800',
                      lineHeight: 13,
                      textAlign: 'center',
                      color: theme.colors.white,
                    }}
                  >
                    {favorites.length > 99 ? '99+' : favorites.length}
                  </Text>
                </BadgeCount>
              )}
            </FavoriteIconBox>
          </TouchableOpacity>
        </HeaderIconsContainer>
      ),
    });
  }, [navigation, showFavoritesOnly, favorites.length, isDark, themeMode, i18n.language, t]);

  const handleRefresh = () => {
    if (showFavoritesOnly) return;
    refetch();
  };

  const handleLoadMore = () => {
    if (showFavoritesOnly || loading || !hasMore) return;
    fetchMore({ variables: { page: data?.characters?.info?.next } });
  };

  // Filter local favorites based on search term
  const getFilteredFavorites = () => {
    if (!searchQuery) return favorites;
    return favorites.filter((fav) =>
      fav.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const displayedCharacters = showFavoritesOnly ? getFilteredFavorites() : characters;
  const isFilteringActive = !!(status || gender || species);

  // Render Footer for Infinite Scroll Loading Indicator
  const renderFooter = () => {
    if (isLoadingMore) {
      return (
        <View style={{ paddingVertical: 20 }}>
          <LoadingSpinner fullScreen={false} size="small" />
        </View>
      );
    }
    return null;
  };

  // Error State Render
  if (error && characters.length === 0 && !showFavoritesOnly) {
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
          <Button title={t('common.retry')} onPress={handleRefresh} />
        </CenterContainer>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer edges={['left', 'right']}>
      <Container>
        {/* Search and Filters Header */}
        <SearchRow>
          <SearchBarWrapper>
            <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
          </SearchBarWrapper>
          <FilterButton
            testID="filter-button"
            active={isFilteringActive}
            onPress={() => setIsFilterModalVisible(true)}
            activeOpacity={0.7}
          >
            <Icon
              name={isFilteringActive ? 'funnel' : 'funnel-outline'}
              size={20}
              color={isFilteringActive ? theme.colors.background : theme.colors.textPrimary}
            />
          </FilterButton>
          <ViewToggleButton
            testID="view-toggle"
            onPress={() => setViewMode((m) => (m === 'list' ? 'grid' : 'list'))}
            activeOpacity={0.7}
          >
            <Icon
              name={viewMode === 'list' ? 'grid-outline' : 'list-outline'}
              size={20}
              color={theme.colors.textPrimary}
            />
          </ViewToggleButton>
        </SearchRow>

        {/* Characters FlatList */}
        {isInitialLoading ? (
          <LoadingSpinner fullScreen />
        ) : (
          <FlatList
            key={viewMode}
            data={displayedCharacters}
            keyExtractor={(item) => item.id}
            numColumns={viewMode === 'grid' ? 2 : 1}
            columnWrapperStyle={
              viewMode === 'grid' ? { gap: theme.spacing.md } : undefined
            }
            renderItem={({ item }) => (
              <CharacterCard
                character={item}
                grid={viewMode === 'grid'}
                isFavorite={isFavorite(item.id)}
                onFavoriteToggle={() => toggleFavorite(item)}
                onPress={() =>
                  navigation.navigate('CharacterDetail', { id: item.id, name: item.name })
                }
              />
            )}
            contentContainerStyle={{ flexGrow: 1, paddingBottom: 8 }}
            ListEmptyComponent={
              <CenterContainer>
                <Icon name="search" size={48} color={theme.colors.textSecondary} />
                <Text variant="subtitle" style={{ marginTop: 16 }} align="center">
                  {t('common.empty')}
                </Text>
              </CenterContainer>
            }
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={handleRefresh}
                colors={[theme.colors.primary]}
                tintColor={theme.colors.primary}
              />
            }
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.4}
            ListFooterComponent={renderFooter}
            showsVerticalScrollIndicator={false}
          />
        )}

      </Container>

      {/* Filter Sheet — overlay renderizado na própria árvore (cobre a tela) */}
      <FilterModal
        visible={isFilterModalVisible}
        currentStatus={status}
        currentGender={gender}
        currentSpecies={species}
        onClose={() => setIsFilterModalVisible(false)}
        onApply={(newStatus, newGender, newSpecies) => {
          setStatus(newStatus);
          setGender(newGender);
          setSpecies(newSpecies);
        }}
        onClear={() => {
          setStatus('');
          setGender('');
          setSpecies('');
        }}
      />
    </ScreenContainer>
  );
};

export default CharacterListScreen;
