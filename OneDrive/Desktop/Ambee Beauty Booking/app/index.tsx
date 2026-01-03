

import { View, Text, StyleSheet, Animated } from "react-native";
import { useEffect, useRef } from "react";
import { useRouter } from "expo-router";
import { Colors } from "@/constants/Colors";
import { Fonts } from "@/constants/Fonts";
import { Layout } from "@/constants/Layout";


export default function SplashScreen() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // Start animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // Navigate to auth after 2.5 seconds
    const timer = setTimeout(() => {
      router.replace('/auth');
    }, 2500);

    return () => clearTimeout(timer);
  }, [fadeAnim, scaleAnim, router]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>✨</Text>
          <Text style={styles.brandName}>Ambee</Text>
        </View>

        {/* Tagline */}
        <Text style={styles.tagline}>Beauty at Your Doorstep</Text>

        {/* Loading indicator */}
        <View style={styles.loadingContainer}>
          <View style={styles.loadingDot} />

          <View style={[styles.loadingDot, styles.loadingDotDelay1]} />
          <View style={[styles.loadingDot, styles.loadingDotDelay2]} />
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.primary,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: Layout.spacing.xl,
  },
  logoText: {
    fontSize: 80,
    marginBottom: Layout.spacing.sm,
  },
  brandName: {
    fontSize: Fonts['4xl'],
    fontWeight: 'bold',
    color: Colors.white,
    letterSpacing: 2,
  },
  tagline: {
    fontSize: Fonts.lg,
    color: Colors.white,
    opacity: 0.9,
    marginBottom: Layout.spacing['2xl'],
    textAlign: 'center',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Layout.spacing.sm,
  },
  loadingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.white,
    opacity: 0.7,
  },
  loadingDotDelay1: {
    opacity: 0.5,
  },
  loadingDotDelay2: {
    opacity: 0.3,
  },
});
