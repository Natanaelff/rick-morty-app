import React from 'react';
import { StyleProp, TextStyle } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface IconProps {
  name: string;
  size?: number;
  color?: string;
  style?: StyleProp<TextStyle>;
}

/**
 * Thin wrapper around react-native-vector-icons (Ionicons) so the rest of the
 * app depends on a single internal icon contract rather than the library
 * directly. Swapping the icon set later only touches this file.
 */
export const Icon: React.FC<IconProps> = ({ name, size = 24, color, style }) => (
  <Ionicons name={name} size={size} color={color} style={style} />
);

export default Icon;
