

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Platform,
} from "react-native";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { Colors } from "@/constants/Colors";
import { Fonts } from "@/constants/Fonts";
import { Layout } from "@/constants/Layout";

export default function BookingScreen() {
  const router = useRouter();
  // No route params used currently

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [customerAddress, setCustomerAddress] = useState("Vikhroli East, Mumbai");
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "online">("cash");
  const [notes, setNotes] = useState("");

  // Sample data
  const salonData = {
    name: "Glam Studio",
    address: "Vikhroli East, Mumbai",
    phone: "+91 9876543210",
  };

  const selectedServices = [
    { name: "Deep Cleansing Facial", price: 1200, duration: 90 },
    { name: "Hair Cut & Style", price: 800, duration: 60 },
  ];

  const availableDates = [
    "2024-01-20",
    "2024-01-21",
    "2024-01-22",
    "2024-01-23",
    "2024-01-24",
  ];

  const availableTimes = [
    "09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00", "18:00"
  ];

  const totalPrice = selectedServices.reduce((sum, service) => sum + service.price, 0);
  const totalDuration = selectedServices.reduce((sum, service) => sum + service.duration, 0);

  const handleDateSelect = (date: string) => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setSelectedDate(date);
  };

  const handleTimeSelect = (time: string) => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setSelectedTime(time);
  };


  const handleBooking = () => {
    if (!selectedDate || !selectedTime) {
      Alert.alert("Error", "Please select date and time");
      return;
    }

    if (!customerAddress.trim()) {
      Alert.alert("Error", "Please enter your address");
      return;
    }

    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    Alert.alert(
      "Booking Confirmed!",
      `Your booking has been confirmed for ${selectedDate} at ${selectedTime}. The salon will contact you shortly.`,
      [
        {
          text: "OK",
          onPress: () => router.push("/(tabs)/bookings"),
        },
      ]
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return "Tomorrow";
    } else {
      return date.toLocaleDateString("en-US", { 
        weekday: "short", 
        month: "short", 
        day: "numeric" 
      });
    }
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
        <Text style={styles.headerTitle}>Book Appointment</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Salon Info */}
        <View style={styles.salonCard}>
          <Text style={styles.salonName}>{salonData.name}</Text>
          <Text style={styles.salonAddress}>📍 {salonData.address}</Text>
          <Text style={styles.salonPhone}>📞 {salonData.phone}</Text>
        </View>

        {/* Selected Services */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Selected Services</Text>
          {selectedServices.map((service, index) => (
            <View key={index} style={styles.serviceItem}>
              <View style={styles.serviceInfo}>
                <Text style={styles.serviceName}>{service.name}</Text>
                <Text style={styles.serviceDuration}>⏱️ {service.duration} min</Text>
              </View>
              <Text style={styles.servicePrice}>₹{service.price}</Text>
            </View>
          ))}
          
          <View style={styles.totalContainer}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total Duration:</Text>
              <Text style={styles.totalValue}>{totalDuration} minutes</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total Amount:</Text>
              <Text style={styles.totalPrice}>₹{totalPrice}</Text>
            </View>
          </View>
        </View>

        {/* Date Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Date</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.dateContainer}>
              {availableDates.map((date) => (
                <TouchableOpacity
                  key={date}
                  style={[
                    styles.dateButton,
                    selectedDate === date && styles.dateButtonSelected,
                  ]}
                  onPress={() => handleDateSelect(date)}
                >
                  <Text
                    style={[
                      styles.dateButtonText,
                      selectedDate === date && styles.dateButtonTextSelected,
                    ]}
                  >
                    {formatDate(date)}
                  </Text>
                  <Text
                    style={[
                      styles.dateButtonDate,
                      selectedDate === date && styles.dateButtonDateSelected,
                    ]}
                  >
                    {new Date(date).getDate()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Time Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Time</Text>
          <View style={styles.timeGrid}>
            {availableTimes.map((time) => (
              <TouchableOpacity
                key={time}
                style={[
                  styles.timeButton,
                  selectedTime === time && styles.timeButtonSelected,
                ]}
                onPress={() => handleTimeSelect(time)}
              >
                <Text
                  style={[
                    styles.timeButtonText,
                    selectedTime === time && styles.timeButtonTextSelected,
                  ]}
                >
                  {time}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Address */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Service Address</Text>
          <TextInput
            style={styles.addressInput}
            value={customerAddress}
            onChangeText={setCustomerAddress}
            placeholder="Enter your complete address"
            multiline
            numberOfLines={3}
            placeholderTextColor={Colors.textLight}
          />
        </View>

        {/* Payment Method */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          <View style={styles.paymentOptions}>
            <TouchableOpacity
              style={[
                styles.paymentOption,
                paymentMethod === "cash" && styles.paymentOptionSelected,
              ]}
              onPress={() => setPaymentMethod("cash")}
            >
              <Text style={styles.paymentIcon}>💵</Text>
              <View style={styles.paymentInfo}>
                <Text
                  style={[
                    styles.paymentTitle,
                    paymentMethod === "cash" && styles.paymentTitleSelected,
                  ]}
                >
                  Cash on Service
                </Text>
                <Text style={styles.paymentSubtitle}>
                  Pay when the service is completed
                </Text>
              </View>
              <View
                style={[
                  styles.radioButton,
                  paymentMethod === "cash" && styles.radioButtonSelected,
                ]}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.paymentOption,
                paymentMethod === "online" && styles.paymentOptionSelected,
              ]}
              onPress={() => setPaymentMethod("online")}
            >
              <Text style={styles.paymentIcon}>💳</Text>
              <View style={styles.paymentInfo}>
                <Text
                  style={[
                    styles.paymentTitle,
                    paymentMethod === "online" && styles.paymentTitleSelected,
                  ]}
                >
                  Online Payment
                </Text>
                <Text style={styles.paymentSubtitle}>
                  Pay now with card or UPI
                </Text>
              </View>
              <View
                style={[
                  styles.radioButton,
                  paymentMethod === "online" && styles.radioButtonSelected,
                ]}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Notes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Special Instructions (Optional)</Text>
          <TextInput
            style={styles.notesInput}
            value={notes}
            onChangeText={setNotes}
            placeholder="Any special requests or instructions..."
            multiline
            numberOfLines={3}
            placeholderTextColor={Colors.textLight}
          />
        </View>
      </ScrollView>

      {/* Book Button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={styles.bookButton}
          onPress={handleBooking}
        >
          <Text style={styles.bookButtonText}>
            Confirm Booking • ₹{totalPrice}
          </Text>
        </TouchableOpacity>
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
  placeholder: {
    width: 40,
  },
  salonCard: {
    backgroundColor: Colors.white,
    margin: Layout.spacing.lg,
    padding: Layout.spacing.lg,
    borderRadius: Layout.radius.lg,
    ...Layout.shadow.sm,
  },
  salonName: {
    fontSize: Fonts.xl,
    fontWeight: "bold",
    color: Colors.text,
    marginBottom: Layout.spacing.sm,
  },
  salonAddress: {
    fontSize: Fonts.base,
    color: Colors.textSecondary,
    marginBottom: Layout.spacing.xs,
  },
  salonPhone: {
    fontSize: Fonts.base,
    color: Colors.textSecondary,
  },
  section: {
    backgroundColor: Colors.white,
    marginHorizontal: Layout.spacing.lg,
    marginBottom: Layout.spacing.md,
    padding: Layout.spacing.lg,
    borderRadius: Layout.radius.lg,
    ...Layout.shadow.sm,
  },
  sectionTitle: {
    fontSize: Fonts.lg,
    fontWeight: "bold",
    color: Colors.text,
    marginBottom: Layout.spacing.md,
  },
  serviceItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: Layout.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: Fonts.base,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: Layout.spacing.xs,
  },
  serviceDuration: {
    fontSize: Fonts.sm,
    color: Colors.textSecondary,
  },
  servicePrice: {
    fontSize: Fonts.base,
    fontWeight: "bold",
    color: Colors.primary,
  },
  totalContainer: {
    marginTop: Layout.spacing.md,
    paddingTop: Layout.spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Layout.spacing.sm,
  },
  totalLabel: {
    fontSize: Fonts.base,
    color: Colors.textSecondary,
  },
  totalValue: {
    fontSize: Fonts.base,
    fontWeight: "600",
    color: Colors.text,
  },
  totalPrice: {
    fontSize: Fonts.lg,
    fontWeight: "bold",
    color: Colors.primary,
  },
  dateContainer: {
    flexDirection: "row",
    gap: Layout.spacing.sm,
    paddingHorizontal: Layout.spacing.sm,
  },
  dateButton: {
    backgroundColor: Colors.background,
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: Layout.spacing.md,
    borderRadius: Layout.radius.md,
    alignItems: "center",
    minWidth: 80,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  dateButtonSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  dateButtonText: {
    fontSize: Fonts.sm,
    color: Colors.textSecondary,
    fontWeight: "500",
    marginBottom: Layout.spacing.xs,
  },
  dateButtonTextSelected: {
    color: Colors.white,
  },
  dateButtonDate: {
    fontSize: Fonts.lg,
    fontWeight: "bold",
    color: Colors.text,
  },
  dateButtonDateSelected: {
    color: Colors.white,
  },
  timeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Layout.spacing.sm,
  },
  timeButton: {
    backgroundColor: Colors.background,
    paddingHorizontal: Layout.spacing.md,
    paddingVertical: Layout.spacing.sm,
    borderRadius: Layout.radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    minWidth: 70,
    alignItems: "center",
  },
  timeButtonSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  timeButtonText: {
    fontSize: Fonts.sm,
    color: Colors.text,
    fontWeight: "500",
  },
  timeButtonTextSelected: {
    color: Colors.white,
  },
  addressInput: {
    backgroundColor: Colors.background,
    borderRadius: Layout.radius.md,
    padding: Layout.spacing.md,
    fontSize: Fonts.base,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.border,
    textAlignVertical: "top",
  },
  paymentOptions: {
    gap: Layout.spacing.sm,
  },
  paymentOption: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.background,
    padding: Layout.spacing.md,
    borderRadius: Layout.radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  paymentOptionSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.white,
  },
  paymentIcon: {
    fontSize: 24,
    marginRight: Layout.spacing.md,
  },
  paymentInfo: {
    flex: 1,
  },
  paymentTitle: {
    fontSize: Fonts.base,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: Layout.spacing.xs,
  },
  paymentTitleSelected: {
    color: Colors.primary,
  },
  paymentSubtitle: {
    fontSize: Fonts.sm,
    color: Colors.textSecondary,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  radioButtonSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary,
  },
  notesInput: {
    backgroundColor: Colors.background,
    borderRadius: Layout.radius.md,
    padding: Layout.spacing.md,
    fontSize: Fonts.base,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.border,
    textAlignVertical: "top",
  },
  bottomContainer: {
    backgroundColor: Colors.white,
    paddingHorizontal: Layout.spacing.lg,
    paddingVertical: Layout.spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  bookButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Layout.spacing.md,
    borderRadius: Layout.radius.md,
    alignItems: "center",
    ...Layout.shadow.md,
  },
  bookButtonText: {
    color: Colors.white,
    fontSize: Fonts.lg,
    fontWeight: "bold",
  },
});