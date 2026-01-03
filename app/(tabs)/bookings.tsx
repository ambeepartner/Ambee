import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Colors } from "@/constants/Colors";
import { Fonts } from "@/constants/Fonts";
import { Layout } from "@/constants/Layout";

type BookingStatus = "upcoming" | "completed" | "cancelled";

interface Booking {
  id: string;
  salonName: string;
  serviceName: string;
  date: string;
  time: string;
  status: BookingStatus;
  price: number;
  address: string;
}

export default function BookingsScreen() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState<"upcoming" | "history">("upcoming");

  const sampleBookings: Booking[] = [
    {
      id: "1",
      salonName: "Glam Studio",
      serviceName: "Deep Cleansing Facial",
      date: "2024-01-20",
      time: "14:30",
      status: "upcoming",
      price: 1200,
      address: "Vikhroli East, Mumbai",
    },
    {
      id: "2",
      salonName: "Beauty Lounge",
      serviceName: "Hair Cut & Style",
      date: "2024-01-15",
      time: "16:00",
      status: "completed",
      price: 800,
      address: "Andheri East, Mumbai",
    },
    {
      id: "3",
      salonName: "Men's Style Hub",
      serviceName: "Beard Trim",
      date: "2024-01-10",
      time: "11:00",
      status: "cancelled",
      price: 300,
      address: "Bandra West, Mumbai",
    },
  ];

  const upcomingBookings = sampleBookings.filter(b => b.status === "upcoming");
  const historyBookings = sampleBookings.filter(b => b.status !== "upcoming");

  const getStatusColor = (status: BookingStatus) => {
    switch (status) {
      case "upcoming":
        return Colors.primary;
      case "completed":
        return Colors.success;
      case "cancelled":
        return Colors.error;
      default:
        return Colors.textLight;
    }
  };

  const getStatusText = (status: BookingStatus) => {
    switch (status) {

      case "upcoming":
        return "Confirmed";
      case "completed":
        return "Completed";
      case "cancelled":
        return "Cancelled";
      default:
        return status;
    }
  };

  const renderBookingCard = ({ item }: { item: Booking }) => (
    <TouchableOpacity style={styles.bookingCard}>
      <View style={styles.bookingHeader}>
        <View style={styles.bookingInfo}>
          <Text style={styles.salonName}>{item.salonName}</Text>
          <Text style={styles.serviceName}>{item.serviceName}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
        </View>
      </View>

      <View style={styles.bookingDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.detailIcon}>📅</Text>
          <Text style={styles.detailText}>{item.date} at {item.time}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailIcon}>📍</Text>
          <Text style={styles.detailText}>{item.address}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailIcon}>💰</Text>
          <Text style={styles.detailText}>₹{item.price}</Text>
        </View>
      </View>

      {item.status === "upcoming" && (
        <View style={styles.bookingActions}>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Reschedule</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, styles.cancelButton]}>
            <Text style={[styles.actionButtonText, styles.cancelButtonText]}>Cancel</Text>
          </TouchableOpacity>
        </View>
      )}

      {item.status === "completed" && (
        <View style={styles.bookingActions}>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Rate & Review</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Book Again</Text>
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>My Bookings</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === "upcoming" && styles.activeTab]}
          onPress={() => setSelectedTab("upcoming")}
        >
          <Text style={[styles.tabText, selectedTab === "upcoming" && styles.activeTabText]}>
            Upcoming
          </Text>
          {upcomingBookings.length > 0 && (
            <View style={styles.tabBadge}>
              <Text style={styles.tabBadgeText}>{upcomingBookings.length}</Text>
            </View>
          )}
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, selectedTab === "history" && styles.activeTab]}
          onPress={() => setSelectedTab("history")}
        >
          <Text style={[styles.tabText, selectedTab === "history" && styles.activeTabText]}>
            History
          </Text>
        </TouchableOpacity>
      </View>

      {/* Bookings List */}
      <View style={styles.content}>
        {selectedTab === "upcoming" ? (
          upcomingBookings.length > 0 ? (
            <FlatList
              data={upcomingBookings}
              renderItem={renderBookingCard}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContainer}
            />
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateIcon}>📅</Text>
              <Text style={styles.emptyStateTitle}>No upcoming bookings</Text>
              <Text style={styles.emptyStateText}>
                Book your next beauty service to see it here
              </Text>
              <TouchableOpacity
                style={styles.bookNowButton}
                onPress={() => router.push("/(tabs)")}
              >
                <Text style={styles.bookNowButtonText}>Book Now</Text>
              </TouchableOpacity>
            </View>
          )
        ) : (
          historyBookings.length > 0 ? (
            <FlatList
              data={historyBookings}
              renderItem={renderBookingCard}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContainer}
            />
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateIcon}>📋</Text>
              <Text style={styles.emptyStateTitle}>No booking history</Text>
              <Text style={styles.emptyStateText}>
                Your completed and cancelled bookings will appear here
              </Text>
            </View>
          )
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
  tabsContainer: {
    flexDirection: "row",
    paddingHorizontal: Layout.spacing.lg,
    marginBottom: Layout.spacing.lg,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Layout.spacing.md,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeTab: {
    borderBottomColor: Colors.primary,
  },
  tabText: {
    fontSize: Fonts.base,
    color: Colors.textSecondary,
    fontWeight: "500",
  },
  activeTabText: {
    color: Colors.primary,
    fontWeight: "bold",
  },
  tabBadge: {
    backgroundColor: Colors.primary,
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: Layout.spacing.xs,
  },
  tabBadgeText: {
    color: Colors.white,
    fontSize: Fonts.xs,
    fontWeight: "bold",
  },
  content: {
    flex: 1,
  },
  listContainer: {
    paddingHorizontal: Layout.spacing.lg,
  },
  bookingCard: {
    backgroundColor: Colors.white,
    borderRadius: Layout.radius.lg,
    padding: Layout.spacing.md,
    marginBottom: Layout.spacing.md,
    ...Layout.shadow.md,
  },
  bookingHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: Layout.spacing.md,
  },
  bookingInfo: {
    flex: 1,
  },
  salonName: {
    fontSize: Fonts.lg,
    fontWeight: "bold",
    color: Colors.text,
    marginBottom: Layout.spacing.xs,
  },
  serviceName: {
    fontSize: Fonts.base,
    color: Colors.textSecondary,
  },
  statusBadge: {
    paddingHorizontal: Layout.spacing.sm,
    paddingVertical: Layout.spacing.xs,
    borderRadius: Layout.radius.sm,
  },
  statusText: {
    color: Colors.white,
    fontSize: Fonts.xs,
    fontWeight: "bold",
  },
  bookingDetails: {
    marginBottom: Layout.spacing.md,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Layout.spacing.xs,
  },
  detailIcon: {
    fontSize: 16,
    marginRight: Layout.spacing.sm,
    width: 20,
  },
  detailText: {
    fontSize: Fonts.sm,
    color: Colors.textSecondary,
    flex: 1,
  },
  bookingActions: {
    flexDirection: "row",
    gap: Layout.spacing.sm,
  },
  actionButton: {
    flex: 1,
    backgroundColor: Colors.primary,
    paddingVertical: Layout.spacing.sm,
    borderRadius: Layout.radius.md,
    alignItems: "center",
  },
  actionButtonText: {
    color: Colors.white,
    fontSize: Fonts.sm,
    fontWeight: "600",
  },
  cancelButton: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.error,
  },
  cancelButtonText: {
    color: Colors.error,
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Layout.spacing.lg,
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
    marginBottom: Layout.spacing.lg,
  },
  bookNowButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Layout.spacing.xl,
    paddingVertical: Layout.spacing.md,
    borderRadius: Layout.radius.md,
  },
  bookNowButtonText: {
    color: Colors.white,
    fontSize: Fonts.base,
    fontWeight: "bold",
  },
});