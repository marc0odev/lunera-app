import { createContext, useContext } from 'react';
import { Animated, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
export const ND = Platform.OS !== 'web'; // driver nativo só fora da web
export const ScrollCtx = createContext(new Animated.Value(0));
export const useScrollY = () => useContext(ScrollCtx);
export const EmbeddedCtx = createContext(false); 
export const useEdge = () => { const i = useSafeAreaInsets(); return useContext(EmbeddedCtx) ? { top: 26, bottom: 6 } : i; };
