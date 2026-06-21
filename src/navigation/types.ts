import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';

export type RootStackParamList = {
  CharacterList: undefined;
  CharacterDetail: { id: string; name: string };
};

export type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export type CharacterDetailRouteProp = RouteProp<RootStackParamList, 'CharacterDetail'>;
