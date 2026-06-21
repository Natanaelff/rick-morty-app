/* eslint-env jest */
// react-native-vector-icons relies on native font assets that aren't available
// in the Jest environment, so we stub the icon set with a lightweight mock.
jest.mock('react-native-vector-icons/Ionicons', () => 'Ionicons');
