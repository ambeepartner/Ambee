

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from "react-native";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Colors } from "@/constants/Colors";
import { Fonts } from "@/constants/Fonts";
import { Layout } from "@/constants/Layout";

export default function ProfileScreen() {
  const router = useRouter();
  const [notifications, setNotifications] = useState(true);
  const [highContrast, setHighContrast] = useState(false);
  const [fontSize, setFontSize] = useState<"small" | "medium" | "large">("medium");

  const userProfile = {
    name: "Demo User",
    phone: "+91 9999999999",
    email: "demo@ambee.com",
    totalBookings: 12,
    memberSince: "Jan 2024",
  };

  const menuItems = [
    {
      title: "My Details",
      icon: "👤",
      onPress: () => Alert.alert("Coming Soon", "Edit profile feature coming soon!"),
    },
    {
      title: "My Bookings",
      icon: "📅",
      onPress: () => router.push("/(tabs)/bookings"),
    },
    {
      title: "Feedback",
      icon: "💬",
      onPress: () => Alert.alert("Feedback", "Send us your feedback!"),
    },
    {
      title: "About Ambee",
      icon: "ℹ️",
      onPress: () => Alert.alert("About", "Ambee - Beauty at Your Doorstep"),
    },
  ];

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Logout", 
          style: "destructive",
          onPress: () => router.replace("/auth")
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileAvatar}>
            <Text style={styles.profileAvatarText}>
              {userProfile.name.charAt(0).toUpperCase()}
            </Text>
          </View>
          
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{userProfile.name}</Text>
            <Text style={styles.profilePhone}>{userProfile.phone}</Text>
            <Text style={styles.profileEmail}>{userProfile.email}</Text>
            
            <View style={styles.profileStats}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{userProfile.totalBookings}</Text>
                <Text style={styles.statLabel}>Bookings</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{userProfile.memberSince}</Text>
                <Text style={styles.statLabel}>Member Since</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Account</Text>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={item.onPress}
            >
              <View style={styles.menuItemLeft}>
                <Text style={styles.menuIcon}>{item.icon}</Text>
                <Text style={styles.menuTitle}>{item.title}</Text>
              </View>
              <Text style={styles.menuArrow}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* App Settings */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>App Settings</Text>
          
          <View style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Text style={styles.menuIcon}>🔔</Text>
              <Text style={styles.menuTitle}>Notifications</Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: Colors.border, true: Colors.primary }}
              thumbColor={Colors.white}
            />
          </View>

          <View style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Text style={styles.menuIcon}>🎨</Text>
              <Text style={styles.menuTitle}>High Contrast</Text>
            </View>
            <Switch
              value={highContrast}
              onValueChange={setHighContrast}
              trackColor={{ false: Colors.border, true: Colors.primary }}
              thumbColor={Colors.white}
            />
          </View>

          <View style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Text style={styles.menuIcon}>🔤</Text>
              <Text style={styles.menuTitle}>Font Size</Text>
            </View>
            <View style={styles.fontSizeOptions}>
              {(["small", "medium", "large"] as const).map((size) => (
                <TouchableOpacity
                  key={size}
                  style={[
                    styles.fontSizeButton,
                    fontSize === size && styles.fontSizeButtonActive,
                  ]}
                  onPress={() => setFontSize(size)}
                >
                  <Text
                    style={[
                      styles.fontSizeButtonText,
                      fontSize === size && styles.fontSizeButtonTextActive,
                    ]}
                  >
                    {size.charAt(0).toUpperCase() + size.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Support */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Support</Text>
          
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => Alert.alert("Help", "Help & Support coming soon!")}
          >
            <View style={styles.menuItemLeft}>
              <Text style={styles.menuIcon}>❓</Text>
              <Text style={styles.menuTitle}>Help & Support</Text>
            </View>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => Alert.alert("Terms", "Terms of Service")}
          >
            <View style={styles.menuItemLeft}>
              <Text style={styles.menuIcon}>📄</Text>
              <Text style={styles.menuTitle}>Terms of Service</Text>
            </View>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => Alert.alert("Privacy", "Privacy Policy")}
          >
            <View style={styles.menuItemLeft}>
              <Text style={styles.menuIcon}>🔒</Text>
              <Text style={styles.menuTitle}>Privacy Policy</Text>
            </View>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Logout */}
        <View style={styles.logoutSection}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>

        {/* App Version */}
        <View style={styles.versionSection}>
          <Text style={styles.versionText}>Ambee v1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    padding: Layout.spacing.lg,
    paddingBottom: Layout.spacing.md,
  },
  title: {
    fontSize: Fonts['2xl'],
    fontWeight: "bold",
    color: Colors.text,
  },
  profileCard: {
    backgroundColor: Colors.white,
    marginHorizontal: Layout.spacing.lg,
    borderRadius: Layout.radius.lg,
    padding: Layout.spacing.lg,
    alignItems: "center",
    marginBottom: Layout.spacing.xl,
    ...Layout.shadow.md,
  },
  profileAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Layout.spacing.md,
  },
  profileAvatarText: {
    fontSize: Fonts['2xl'],
    fontWeight: "bold",
    color: Colors.white,
  },
  profileInfo: {
    alignItems: "center",
  },
  profileName: {
    fontSize: Fonts.xl,
    fontWeight: "bold",
    color: Colors.text,
    marginBottom: Layout.spacing.xs,
  },
  profilePhone: {
    fontSize: Fonts.base,
    color: Colors.textSecondary,
    marginBottom: Layout.spacing.xs,
  },
  profileEmail: {
    fontSize: Fonts.sm,
    color: Colors.textLight,
    marginBottom: Layout.spacing.lg,
  },
  profileStats: {
    flexDirection: "row",
    alignItems: "center",
  },
  statItem: {
    alignItems: "center",
    paddingHorizontal: Layout.spacing.lg,
  },
  statNumber: {
    fontSize: Fonts.lg,
    fontWeight: "bold",
    color: Colors.primary,
  },
  statLabel: {
    fontSize: Fonts.xs,
    color: Colors.textSecondary,
    marginTop: Layout.spacing.xs,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: Colors.border,
  },
  menuSection: {
    marginBottom: Layout.spacing.xl,
  },
  sectionTitle: {
    fontSize: Fonts.base,
    fontWeight: "bold",
    color: Colors.text,
    marginBottom: Layout.spacing.md,
    paddingHorizontal: Layout.spacing.lg,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.white,
    marginHorizontal: Layout.spacing.lg,
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: Layout.spacing.md,
    marginBottom: Layout.spacing.xs,
    borderRadius: Layout.radius.md,
    ...Layout.shadow.sm,
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  menuIcon: {
    fontSize: 20,
    marginRight: Layout.spacing.md,
    width: 24,
  },
  menuTitle: {
    fontSize: Fonts.base,
    color: Colors.text,
    fontWeight: "500",
  },
  menuArrow: {
    fontSize: 20,
    color: Colors.textLight,
  },
  fontSizeOptions: {
    flexDirection: "row",
    gap: Layout.spacing.xs,
  },
  fontSizeButton: {
    paddingHorizontal: Layout.spacing.sm,
    paddingVertical: Layout.spacing.xs,
    borderRadius: Layout.radius.sm,
    backgroundColor: Colors.background,
  },
  fontSizeButtonActive: {
    backgroundColor: Colors.primary,
  },
  fontSizeButtonText: {
    fontSize: Fonts.xs,
    color: Colors.textSecondary,
    fontWeight: "500",
  },
  fontSizeButtonTextActive: {
    color: Colors.white,
  },
  logoutSection: {
    paddingHorizontal: Layout.spacing.lg,
    marginBottom: Layout.spacing.xl,
  },
  logoutButton: {
    backgroundColor: Colors.error,
    paddingVertical: Layout.spacing.md,
    borderRadius: Layout.radius.md,
    alignItems: "center",
  },
  logoutButtonText: {
    color: Colors.white,
    fontSize: Fonts.base,
    fontWeight: "bold",
  },
  versionSection: {
    alignItems: "center",
    paddingBottom: Layout.spacing.xl,
  },
  versionText: {
    fontSize: Fonts.sm,
    color: Colors.textLight,
  },
});
