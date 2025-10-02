
import { BlurView } from 'expo-blur';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  interpolate,
} from 'react-native-reanimated';
import { useTheme } from '@react-navigation/native';
import React from 'react';
import { useRouter, usePathname } from 'expo-router';
import { IconSymbol } from '@/components/IconSymbol';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Dimensions,
} from 'react-native';
import { colors } from '@/styles/commonStyles';

export interface TabBarItem {
  name: string;
  route: string;
  icon: string;
  label: string;
}

interface FloatingTabBarProps {
  tabs: TabBarItem[];
  containerWidth?: number;
  borderRadius?: number;
  bottomMargin?: number;
}

const { width: screenWidth } = Dimensions.get('window');

export default function FloatingTabBar({
  tabs,
  containerWidth = screenWidth - 32,
  borderRadius = 25,
  bottomMargin = 16,
}: FloatingTabBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const theme = useTheme();
  
  const activeIndex = useSharedValue(0);

  // Find the active tab index
  React.useEffect(() => {
    const currentIndex = tabs.findIndex(tab => {
      if (tab.route === '/(tabs)/(home)/') {
        return pathname.startsWith('/(tabs)/(home)') || pathname === '/';
      }
      return pathname.includes(tab.name);
    });
    activeIndex.value = withSpring(currentIndex >= 0 ? currentIndex : 0);
  }, [pathname, tabs]);

  const handleTabPress = (route: string) => {
    router.push(route as any);
  };

  const animatedIndicatorStyle = useAnimatedStyle(() => {
    const tabWidth = containerWidth / tabs.length;
    return {
      transform: [
        {
          translateX: interpolate(
            activeIndex.value,
            [0, tabs.length - 1],
            [0, tabWidth * (tabs.length - 1)]
          ),
        },
      ],
    };
  });

  const styles = StyleSheet.create({
    container: {
      position: 'absolute',
      bottom: bottomMargin,
      left: (screenWidth - containerWidth) / 2,
      width: containerWidth,
      height: 60,
      borderRadius,
      overflow: 'hidden',
      backgroundColor: Platform.OS === 'ios' ? 'transparent' : colors.card,
      borderWidth: Platform.OS !== 'ios' ? 1 : 0,
      borderColor: colors.border,
      elevation: 8,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
    },
    tabContainer: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-around',
      paddingHorizontal: 8,
    },
    tab: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 8,
    },
    tabLabel: {
      fontSize: 12,
      fontWeight: '600',
      marginTop: 4,
      color: colors.text,
    },
    activeTabLabel: {
      color: colors.primary,
    },
    indicator: {
      position: 'absolute',
      top: 8,
      height: 44,
      width: containerWidth / tabs.length - 16,
      marginHorizontal: 8,
      backgroundColor: colors.highlight,
      borderRadius: 22,
    },
  });

  return (
    <SafeAreaView style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
      <View style={styles.container}>
        {Platform.OS === 'ios' ? (
          <BlurView intensity={80} style={{ flex: 1 }}>
            <Animated.View style={[styles.indicator, animatedIndicatorStyle]} />
            <View style={styles.tabContainer}>
              {tabs.map((tab, index) => {
                const isActive = pathname.includes(tab.name) || 
                  (tab.route === '/(tabs)/(home)/' && (pathname.startsWith('/(tabs)/(home)') || pathname === '/'));
                
                return (
                  <TouchableOpacity
                    key={tab.name}
                    style={styles.tab}
                    onPress={() => handleTabPress(tab.route)}
                  >
                    <IconSymbol
                      name={tab.icon as any}
                      size={24}
                      color={isActive ? colors.primary : colors.text}
                    />
                    <Text style={[styles.tabLabel, isActive && styles.activeTabLabel]}>
                      {tab.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </BlurView>
        ) : (
          <>
            <Animated.View style={[styles.indicator, animatedIndicatorStyle]} />
            <View style={styles.tabContainer}>
              {tabs.map((tab, index) => {
                const isActive = pathname.includes(tab.name) || 
                  (tab.route === '/(tabs)/(home)/' && (pathname.startsWith('/(tabs)/(home)') || pathname === '/'));
                
                return (
                  <TouchableOpacity
                    key={tab.name}
                    style={styles.tab}
                    onPress={() => handleTabPress(tab.route)}
                  >
                    <IconSymbol
                      name={tab.icon as any}
                      size={24}
                      color={isActive ? colors.primary : colors.text}
                    />
                    <Text style={[styles.tabLabel, isActive && styles.activeTabLabel]}>
                      {tab.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}
