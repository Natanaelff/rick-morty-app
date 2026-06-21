import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ApolloProvider } from '@apollo/client/react';
import * as Sentry from '@sentry/react-native';

import client from './src/graphql/client';
import { ThemeProvider } from './src/store/ThemeContext';
import { FavoritesProvider } from './src/store/FavoritesContext';
import AppNavigator from './src/navigation';
import './src/i18n'; // Initialize localization

// Initialize Sentry with a simulated DSN for technical assessment
Sentry.init({
  dsn: 'https://7d6118d36371a5c6020583b48cf821b0@o4508493821034496.ingest.sentry.io/4508493823459328',
  tracesSampleRate: 1.0,
  debug: false,
});

function App() {
  return (
    <Sentry.ErrorBoundary>
      <ApolloProvider client={client}>
        <ThemeProvider>
          <FavoritesProvider>
            <SafeAreaProvider>
              <AppNavigator />
            </SafeAreaProvider>
          </FavoritesProvider>
        </ThemeProvider>
      </ApolloProvider>
    </Sentry.ErrorBoundary>
  );
}

export default Sentry.wrap(App);
