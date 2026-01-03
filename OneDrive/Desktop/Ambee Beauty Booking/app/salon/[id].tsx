

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Platform,
} from "react-native";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Image } from "expo-image";
import * as Haptics from "expo-haptics";
// removed unused Convex imports
import { Colors } from "@/constants/Colors";
import { Fonts } from "@/constants/Fonts";
import { Layout } from "@/constants/Layout";

const { width } = Dimensions.get("window");

export default function SalonDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Sample data since we don't have the actual salon ID
  const salonData = {
    _id: id,
    name: "Glam Studio",
    description: "Premium beauty services at your doorstep",
    address: "Vikhroli East, Mumbai",
    images: [
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400",
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400",
      "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=400",
    ],
    rating: 4.5,
    totalRatings: 127,
    distance: 1.2,
    travelTime: 10,
    workingHours: { open: "09:00", close: "21:00" },
    workingDays: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday"],
    services: [
      {
        _id: "1",
        name: "Deep Cleansing Facial",
        price: 1200,
        duration: 90,
        rating: 4.6,
        isHighlyUsed: true,
        image: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=300",
      },
      {
        _id: "2",
        name: "Hair Cut & Style",
        price: 800,
        duration: 60,
        rating: 4.4,
        isHighlyUsed: true,
        image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=300",
      },
      {
        _id: "3",
        name: "Party Makeup",
        price: 2000,
        duration: 120,
        rating: 4.7,
        isHighlyUsed: false,
        image: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=300",
      },
    ],
  };

  const handleServiceToggle = (serviceId: string) => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    setSelectedServices(prev => 
      prev.includes(serviceId) 
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const handleBookNow = () => {
    if (selectedServices.length === 0) {
      return;
    }
    
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    
    router.push({
      pathname: "/booking",
      params: {
        salonId: id,
        serviceIds: selectedServices.join(","),
      },
    });
  };

  const getTotalPrice = () => {
    return salonData.services
      .filter(service => selectedServices.includes(service._id))
      .reduce((total, service) => total + service.price, 0);
  };

  const getTotalDuration = () => {
    return salonData.services
      .filter(service => selectedServices.includes(service._id))
      .reduce((total, service) => total + service.duration, 0);
  };

  const renderService = ({ item }: { item: any }) => {
    const isSelected = selectedServices.includes(item._id);
    
    return (
      <TouchableOpacity
        style={[styles.serviceCard, isSelected && styles.serviceCardSelected]}
        onPress={() => handleServiceToggle(item._id)}
      >
        <Image
          source={{ uri: item.image }}
          style={styles.serviceImage}
          contentFit="cover"
        />
        
        <View style={styles.serviceInfo}>
          <View style={styles.serviceHeader}>
            <Text style={styles.serviceName}>{item.name}</Text>
            {item.isHighlyUsed && (
              <View style={styles.popularBadge}>
                <Text style={styles.popularBadgeText}>Popular</Text>
              </View>
            )}
          </View>
          
          <View style={styles.serviceDetails}>
            <Text style={styles.servicePrice}>₹{item.price}</Text>
            <Text style={styles.serviceDuration}>⏱️ {item.duration} min</Text>
            <Text style={styles.serviceRating}>⭐ {item.rating}</Text>
          </View>
        </View>
        
        <View style={[styles.selectButton, isSelected && styles.selectButtonSelected]}>
          <Text style={[styles.selectButtonText, isSelected && styles.selectButtonTextSelected]}>
            {isSelected ? "✓" : "+"}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Salon Details</Text>
        <TouchableOpacity style={styles.shareButton}>
          <Text style={styles.shareButtonText}>⤴</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Image Gallery */}
        <View style={styles.imageContainer}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(event) => {
              const index = Math.round(event.nativeEvent.contentOffset.x / width);
              setCurrentImageIndex(index);
            }}
          >
            {salonData.images.map((image, index) => (
              <Image
                key={index}
                source={{ uri: image }}
                style={styles.salonImage}
                contentFit="cover"
              />
            ))}
          </ScrollView>
          
          <View style={styles.imageIndicators}>
            {salonData.images.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.indicator,
                  index === currentImageIndex && styles.activeIndicator,
                ]}
              />
            ))}
          </View>
        </View>

        {/* Salon Info */}
        <View style={styles.salonInfo}>
          <View style={styles.salonHeader}>
            <View style={styles.salonTitleContainer}>
              <Text style={styles.salonName}>{salonData.name}</Text>
              <Text style={styles.salonDistance}>
                📍 {salonData.distance}km • {salonData.travelTime} min away
              </Text>
            </View>
            
            <View style={styles.ratingContainer}>
              <Text style={styles.rating}>⭐ {salonData.rating}</Text>
              <Text style={styles.ratingCount}>({salonData.totalRatings})</Text>
            </View>
          </View>

          <Text style={styles.salonDescription}>{salonData.description}</Text>

          {/* Working Hours */}
          <View style={styles.workingHoursContainer}>
            <Text style={styles.workingHoursTitle}>Working Hours</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.workingHours}>
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, index) => {
                  const dayKey = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"][index];
                  const isOpen = salonData.workingDays.includes(dayKey);
                  
                  return (
                    <View key={day} style={styles.dayContainer}>
                      <Text style={[styles.dayText, !isOpen && styles.closedDayText]}>
                        {day}
                  
    </Text>
                      <Text style={[styles.hoursText, !isOpen && styles.closedHoursText]}>
                        {isOpen ? `${salonData.workingHours.open}-${salonData.workingHours.close}` : "Closed"}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </ScrollView>
          </View>
        </View>

        {/* Services */}
        <View style={styles.servicesSection}>
          <Text style={styles.servicesTitle}>Services</Text>
          <FlatList
            data={salonData.services}
            renderItem={renderService}
            keyExtractor={(item) => item._id}
            scrollEnabled={false}
            contentContainerStyle={styles.servicesList}
          />
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      {selectedServices.length > 0 && (
        <View style={styles.bottomBar}>
          <View style={styles.bookingInfo}>
            <Text style={styles.selectedCount}>
              {selectedServices.length} service{selectedServices.length > 1 ? "s" : ""} selected
            </Text>
            <Text style={styles.totalPrice}>₹{getTotalPrice()}</Text>
            <Text style={styles.totalDuration}>~{getTotalDuration()} min</Text>
          </View>
          
          <TouchableOpacity
            style={styles.bookButton}
            onPress={handleBookNow}
          >
            <Text style={styles.bookButtonText}>Book Now</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.md,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  backButtonText: {
    fontSize: 20,
    color: Colors.text,
  },
  headerTitle: {
    fontSize: Fonts.lg,
    fontWeight: "bold",
    color: Colors.text,
  },
  shareButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  shareButtonText: {
    fontSize: 18,
    color: Colors.text,
  },
  imageContainer: {
    position: "relative",
  },
  salonImage: {
    width: width,
    height: 250,
  },
  imageIndicators: {
    position: "absolute",
    bottom: Layout.spacing.md,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    gap: Layout.spacing.xs,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
  },
  activeIndicator: {
    backgroundColor: Colors.white,
  },
  salonInfo: {
    backgroundColor: Colors.white,
    padding: Layout.spacing.lg,
    marginBottom: Layout.spacing.md,
  },
  salonHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: Layout.spacing.md,
  },
  salonTitleContainer: {
    flex: 1,
  },
  salonName: {
    fontSize: Fonts['2xl'],
    fontWeight: "bold",
    color: Colors.text,
    marginBottom: Layout.spacing.xs,
  },
  salonDistance: {
    fontSize: Fonts.sm,
    color: Colors.textSecondary,
  },
  ratingContainer: {
    alignItems: "flex-end",
  },
  rating: {
    fontSize: Fonts.lg,
    fontWeight: "bold",
    color: Colors.success,
  },
  ratingCount: {
    fontSize: Fonts.sm,
    color: Colors.textLight,
  },
  salonDescription: {
    fontSize: Fonts.base,
    color: Colors.textSecondary,
    lineHeight: Fonts.lineHeight.relaxed * Fonts.base,
    marginBottom: Layout.spacing.lg,
  },
  workingHoursContainer: {
    marginTop: Layout.spacing.md,
  },
  workingHoursTitle: {
    fontSize: Fonts.base,
    fontWeight: "bold",
    color: Colors.text,
    marginBottom: Layout.spacing.sm,
  },
  workingHours: {
    flexDirection: "row",
    gap: Layout.spacing.md,
  },
  dayContainer: {
    alignItems: "center",
    minWidth: 60,
  },
  dayText: {
    fontSize: Fonts.sm,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: Layout.spacing.xs,
  },
  closedDayText: {
    color: Colors.textLight,
  },
  hoursText: {
    fontSize: Fonts.xs,
    color: Colors.textSecondary,
  },
  closedHoursText: {
    color: Colors.textLight,
  },
  servicesSection: {
    backgroundColor: Colors.white,
    padding: Layout.spacing.lg,
  },
  servicesTitle: {
    fontSize: Fonts.xl,
    fontWeight: "bold",
    color: Colors.text,
    marginBottom: Layout.spacing.lg,
  },
  servicesList: {
    gap: Layout.spacing.md,
  },
  serviceCard: {
    flexDirection: "row",
    backgroundColor: Colors.background,
    borderRadius: Layout.radius.lg,
    padding: Layout.spacing.md,
    borderWidth: 2,
    borderColor: "transparent",
  },
  serviceCardSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.white,
  },
  serviceImage: {
    width: 80,
    height: 80,
    borderRadius: Layout.radius.md,
    marginRight: Layout.spacing.md,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: Layout.spacing.sm,
  },
  serviceName: {
    fontSize: Fonts.base,
    fontWeight: "bold",
    color: Colors.text,
    flex: 1,
  },
  popularBadge: {
    backgroundColor: Colors.accent,
    paddingHorizontal: Layout.spacing.sm,
    paddingVertical: Layout.spacing.xs,
    borderRadius: Layout.radius.sm,
    marginLeft: Layout.spacing.sm,
  },
  popularBadgeText: {
    color: Colors.white,
    fontSize: Fonts.xs,
    fontWeight: "bold",
  },
  serviceDetails: {
    flexDirection: "row",
    alignItems: "center",
    gap: Layout.spacing.md,
  },
  servicePrice: {
    fontSize: Fonts.base,
    fontWeight: "bold",
    color: Colors.primary,
  },
  serviceDuration: {
    fontSize: Fonts.sm,
    color: Colors.textSecondary,
  },
  serviceRating: {
    fontSize: Fonts.sm,
    color: Colors.success,
  },
  selectButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.white,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: Colors.border,
  },
  selectButtonSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  selectButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.textLight,
  },
  selectButtonTextSelected: {
    color: Colors.white,
  },
  bottomBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    ...Layout.shadow.lg,
  },
  bookingInfo: {
    flex: 1,
  },
  selectedCount: {
    fontSize: Fonts.sm,
    color: Colors.textSecondary,
  },
  totalPrice: {
    fontSize: Fonts.lg,
    fontWeight: "bold",
    color: Colors.text,
  },
  totalDuration: {
    fontSize: Fonts.sm,
    color: Colors.textLight,
  },
  bookButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Layout.spacing.xl,
    paddingVertical: Layout.spacing.md,
    borderRadius: Layout.radius.md,
    marginLeft: Layout.spacing.md,
  },
  bookButtonText: {
    color: Colors.white,
    fontSize: Fonts.base,
    fontWeight: "bold",
  },
});
