

import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from "react-native";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "@/constants/Colors";
import { Fonts } from "@/constants/Fonts";
import { Layout } from "@/constants/Layout";

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = [
    { name: "All", icon: "🔍" },
    { name: "Haircut", icon: "✂️" },
    { name: "Facial", icon: "✨" },
    { name: "Makeup", icon: "💄" },
    { name: "Spa", icon: "🧖‍♀️" },
    { name: "Massage", icon: "💆‍♀️" },
  ];

  const searchResults = [
    {
      id: "1",
      type: "salon",
      name: "Glam Studio",
      subtitle: "Premium Beauty Services",
      distance: "1.2 km",
      rating: "4.5",
    },
    {
      id: "2",
      type: "service",
      name: "Deep Cleansing Facial",
      subtitle: "Beauty Lounge",
      price: "₹1,200",
      duration: "90 min",
    },
    {
      id: "3",
      type: "salon",
      name: "Men's Style Hub",
      subtitle: "Professional Grooming",
      distance: "2.1 km",
      rating: "4.3",
    },
  ];

  const renderSearchResult = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.resultCard}>
      <View style={styles.resultIcon}>
        <Text style={styles.resultIconText}>
          {item.type === "salon" ? "🏪" : "✨"}
        </Text>
      </View>
      
      <View style={styles.resultInfo}>
        <Text style={styles.resultName}>{item.name}</Text>
        <Text style={styles.resultSubtitle}>{item.subtitle}</Text>
        
        <View style={styles.resultMeta}>
          {item.distance && (
            <Text style={styles.resultMetaText}>📍 {item.distance}</Text>
          )}
          {item.rating && (
            <Text style={styles.resultMetaText}>⭐ {item.rating}</Text>
          )}
          {item.price && (
            <Text style={styles.resultPrice}>{item.price}</Text>
          )}
          {item.duration && (
            <Text style={styles.resultMetaText}>⏱️ {item.duration}</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Search</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search salons, services, or treatments..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={Colors.textLight}
            autoFocus
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={() => setSearchQuery("")}
            >
              <Text style={styles.clearIcon}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Categories */}
      <View style={styles.categoriesContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.categoriesRow}>
            {categories.map((category, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.categoryChip,
                  selectedCategory === category.name && styles.categoryChipActive,
                ]}
                onPress={() =>
                  setSelectedCategory(
                    selectedCategory === category.name ? null : category.name
                  )
                }
              >
                <Text style={styles.categoryIcon}>{category.icon}</Text>
                <Text
                  style={[
                    styles.categoryText,
                    selectedCategory === category.name && styles.categoryTextActive,
                  ]}
                >
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Search Results */}
      <View style={styles.resultsContainer}>
        {searchQuery.length > 0 ? (
          <>
            <Text style={styles.resultsTitle}>
              Results for &quot;{searchQuery}&quot;
            </Text>
            <FlatList
              data={searchResults}
              renderItem={renderSearchResult}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
            />
          </>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateIcon}> </Text>
            <Text style={styles.emptyStateTitle}>Start searching</Text>
            <Text style={styles.emptyStateText}>
              Find salons, services, and treatments near you
            </Text>
          </View>
        )}
      </View>
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
  searchContainer: {
    paddingHorizontal: Layout.spacing.lg,
    marginBottom: Layout.spacing.md,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    borderRadius: Layout.radius.md,
    paddingHorizontal: Layout.spacing.md,
    ...Layout.shadow.sm,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: Layout.spacing.sm,
  },
  searchInput: {
    flex: 1,
    paddingVertical: Layout.spacing.md,
    fontSize: Fonts.base,
    color: Colors.text,
  },
  clearButton: {
    padding: Layout.spacing.sm,
  },
  clearIcon: {
    fontSize: 16,
    color: Colors.textLight,
  },
  categoriesContainer: {
    marginBottom: Layout.spacing.lg,
  },
  categoriesRow: {
    flexDirection: "row",
    paddingHorizontal: Layout.spacing.lg,
    gap: Layout.spacing.sm,
  },
  categoryChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: Layout.spacing.sm,
    borderRadius: Layout.radius.full,
    ...Layout.shadow.sm,
  },
  categoryChipActive: {
    backgroundColor: Colors.primary,
  },
  categoryIcon: {
    fontSize: 16,
    marginRight: Layout.spacing.xs,
  },
  categoryText: {
    fontSize: Fonts.sm,
    color: Colors.text,
    fontWeight: "500",
  },
  categoryTextActive: {
    color: Colors.white,
  },
  resultsContainer: {
    flex: 1,
    paddingHorizontal: Layout.spacing.lg,
  },
  resultsTitle: {
    fontSize: Fonts.lg,
    fontWeight: "bold",
    color: Colors.text,
    marginBottom: Layout.spacing.md,
  },
  resultCard: {
    flexDirection: "row",
    backgroundColor: Colors.white,
    borderRadius: Layout.radius.lg,
    padding: Layout.spacing.md,
    marginBottom: Layout.spacing.md,
    ...Layout.shadow.sm,
  },
  resultIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.background,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Layout.spacing.md,
  },
  resultIconText: {
    fontSize: 24,
  },
  resultInfo: {
    flex: 1,
  },
  resultName: {
    fontSize: Fonts.base,
    fontWeight: "bold",
    color: Colors.text,
    marginBottom: Layout.spacing.xs,
  },
  resultSubtitle: {
    fontSize: Fonts.sm,
    color: Colors.textSecondary,
    marginBottom: Layout.spacing.sm,
  },
  resultMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: Layout.spacing.md,
  },
  resultMetaText: {
    fontSize: Fonts.xs,
    color: Colors.textLight,
  },
  resultPrice: {
    fontSize: Fonts.sm,
    color: Colors.primary,
    fontWeight: "bold",
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Layout.spacing['2xl'],
  },
  emptyStateIcon: {
    fontSize: 60,
    marginBottom: Layout.spacing.md,
  },
  emptyStateTitle: {
    fontSize: Fonts.xl,
    fontWeight: "bold",
    color: Colors.text,
    marginBottom: Layout.spacing.sm,
  },
  emptyStateText: {
    fontSize: Fonts.base,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: Fonts.lineHeight.relaxed * Fonts.base,
  },
});