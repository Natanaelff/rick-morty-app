import React, { useEffect, useRef } from 'react';
import { StatusBar } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer, NavigationContainerRef, DefaultTheme } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import * as Sentry from '@sentry/react-native';
import { useAppTheme } from '../store/ThemeContext';
import { RootStackParamList } from './types';
import CharacterListScreen from '../screens/CharacterListScreen';
import CharacterDetailScreen from '../screens/CharacterDetailScreen';

// Sentry Navigation Integration
export const navigationIntegration = Sentry.reactNavigationIntegration({
  enableTimeToInitialDisplay: true,
});

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator = () => {
  const { t } = useTranslation();
  const { theme, isDark } = useAppTheme();
  const navigationRef = useRef<NavigationContainerRef<RootStackParamList>>(null);

  useEffect(() => {
    if (navigationRef.current) {
      // Register navigation container with Sentry for transaction and error tracking
      navigationIntegration.registerNavigationContainer(navigationRef.current);
    }
  }, []);

  return (
    <>
    <StatusBar
      barStyle={isDark ? 'light-content' : 'dark-content'}
      backgroundColor={theme.colors.background}
    />
    <NavigationContainer
      ref={navigationRef}
      theme={{
        ...DefaultTheme,
        dark: isDark,
        colors: {
          ...DefaultTheme.colors,
          primary: theme.colors.primary,
          background: theme.colors.background,
          card: theme.colors.cardBackground,
          text: theme.colors.textPrimary,
          border: theme.colors.border,
          notification: theme.colors.secondary,
        },
      }}
    >
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.colors.cardBackground,
          },
          headerShadowVisible: false,
          headerTintColor: theme.colors.textPrimary,
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: 'bold',
          },
          contentStyle: {
            backgroundColor: theme.colors.background,
          },
        }}
      >
        <Stack.Screen
          name="CharacterList"
          component={CharacterListScreen}
          options={{
            title: 'Rick & Morty Explorer',
          }}
        />
        <Stack.Screen
          name="CharacterDetail"
          component={CharacterDetailScreen}
          options={({ route }) => ({
            title: route.params.name || t('details.title'),
            headerBackTitleVisible: false,
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
    </>
  );
};
export default AppNavigator;
