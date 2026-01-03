import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useCart } from "@/app/CartContext";
import { useRouter, useLocalSearchParams } from "expo-router";
import { db } from "@/app/firebaseConfig";
import { doc, getDoc, addDoc, collection } from "firebase/firestore";
import { Colors } from "@/constants/Colors";
import WheelPickerExpo from "react-native-wheel-picker-expo";

interface CartItem {
  id: string;
  name: string;
  price: number;
  image?: string;
  qty: number;
}

export default function Checkout() {
  const { cartItems, increaseQty, decreaseQty } = useCart();
  const router = useRouter();

  const params = useLocalSearchParams();
  const rawId = (params as any).shopId ?? (params as any).id;
  const shopId = Array.isArray(rawId) ? rawId[0] : rawId;

  const [openTime, setOpenTime] = useState<string>("");
  const [closeTime, setCloseTime] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<Date>(new Date());
  const [modalVisible, setModalVisible] = useState(false);
  const [dates, setDates] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Generate next 7 days
  useEffect(() => {
    const today = new Date();
    const next7Days: string[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      next7Days.push(
        d.toLocaleDateString("en-US", {
          weekday: "short",
          day: "numeric",
          month: "short",
        })
      );
    }
    setDates(next7Days);
  }, []);

  // Fetch shop timings
  useEffect(() => {
    const fetchShopTimings = async () => {
      try {
        if (!shopId) return;
        setLoading(true);
        const ref = doc(db, "shops", shopId);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data() as any;
          setOpenTime(data?.OpenTime || "");
          setCloseTime(data?.CloseTime || "");
        } else {
          console.log("❌ Shop not found");
        }
      } catch (e) {
        console.error("❌ Error fetching timings:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchShopTimings();
  }, [shopId]);

  const handleConfirmSlot = async () => {
    if (!selectedDate || !selectedTime) {
      Alert.alert("⚠️ Missing Details", "Please select both date and time.");
      return;
    }

    const formattedTime = selectedTime.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    try {
      await addDoc(collection(db, "bookings"), {
        shopId,
        selectedDate,
        selectedTime: formattedTime,
        cartItems,
        totalAmount: cartItems.reduce(
          (sum, i) => sum + i.price * i.qty,
          0
        ),
        timestamp: new Date(),
      });

      Alert.alert(
        "✅ Slot Confirmed",
        `Your slot is booked on ${selectedDate} at ${formattedTime}`,
        [{ text: "OK" }]
      );
      setModalVisible(false);
    } catch (err) {
      console.error("❌ Booking error:", err);
      Alert.alert("Error", "Failed to confirm slot, please try again.");
    }
  };

  // Time options
  const hours = Array.from({ length: 12 }, (_, i) => ({
    label: String(i + 1).padStart(2, '0'),
    value: i + 1,
  }));

  const minutes = [0, 15, 30, 45].map(m => ({
    label: String(m).padStart(2, '0'),
    value: m,
  }));

  const ampm = [
    { label: 'AM', value: 'AM' },
    { label: 'PM', value: 'PM' },
  ];

  // Get current time parts
  const currentHour = selectedTime.getHours();
  const currentMinute = selectedTime.getMinutes();
  const currentAmPm = currentHour >= 12 ? 'PM' : 'AM';
  const displayHour = currentHour % 12 || 12; // Convert 0 to 12 for 12-hour format

  const scrollByArrow = (type: 'hour' | 'minute' | 'ampm', dir: 'up' | 'down') => {
    const newDate = new Date(selectedTime);
    
    if (type === 'hour') {
      let h = newDate.getHours();
      if (dir === 'up') {
        h = h === 0 ? 23 : h - 1;  // Changed to decrease hour on up arrow
      } else {
        h = h === 23 ? 0 : h + 1;  // Changed to increase hour on down arrow
      }
      newDate.setHours(h);
    } 
    else if (type === 'minute') {
      const minuteOptions = [0, 15, 30, 45];
      let currentIndex = minuteOptions.findIndex(m => m >= newDate.getMinutes());
      if (currentIndex === -1) currentIndex = 0; // Default to first option if not found
      
      if (dir === 'up') {
        const nextIndex = (currentIndex - 1 + minuteOptions.length) % minuteOptions.length;
        newDate.setMinutes(minuteOptions[nextIndex]);
      } else {
        const nextIndex = (currentIndex + 1) % minuteOptions.length;
        newDate.setMinutes(minuteOptions[nextIndex]);
      }
    } 
    else if (type === 'ampm') {
      const h = newDate.getHours();
      // Toggle between AM and PM (add or subtract 12 hours)
      newDate.setHours((h + 12) % 24);
    }
    
    setSelectedTime(newDate);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
      </View>

      {/* Cart Items */}
      <ScrollView style={{ flex: 1, padding: 16 }}>
        {cartItems.length === 0 ? (
          <Text style={{ textAlign: "center", color: "#777" }}>
            No items in cart.
          </Text>
        ) : (
          cartItems.map((item: CartItem) => (
            <View key={item.id} style={styles.serviceCard}>
              <Image source={{ uri: item.image }} style={styles.serviceImage} />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.serviceName}>{item.name}</Text>
                <Text style={styles.serviceDetails}>
                  ₹{(Number(item.price) * item.qty).toFixed(2)} | {item.qty} hr
                </Text>
              </View>
              <View style={styles.qtyContainer}>
                <TouchableOpacity onPress={() => decreaseQty(item.id)}>
                  <Text style={styles.qtyBtn}>-</Text>
                </TouchableOpacity>
                <Text style={styles.qtyText}>{item.qty}</Text>
                <TouchableOpacity onPress={() => increaseQty(item.id)}>
                  <Text style={styles.qtyBtn}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* Footer Slot Bar */}
      <View style={styles.slotBar}>
        <View style={{ flex: 1 }}>
          <Text numberOfLines={1} style={styles.addressText}>
            📍 G, G, 4WFH+QPG, Rajiv Gandhi Nagar, Vikhroli
          </Text>
          <TouchableOpacity>
            <Text style={styles.changeText}>CHANGE</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.slotButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.slotText}>
            {selectedDate && selectedTime
              ? `${selectedDate} | ${selectedTime.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}`
              : "SELECT SLOT"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Slot Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Select Date</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {dates.map((d, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={[
                    styles.dateBtn,
                    selectedDate === d && styles.dateBtnActive,
                  ]}
                  onPress={() => setSelectedDate(d)}
                >
                  <Text
                    style={[
                      styles.dateText,
                      selectedDate === d && { color: "#fff" },
                    ]}
                  >
                    {d}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={styles.modalTitle}>
              Select Service Start Time{" "}
              {openTime && closeTime && (
                <Text style={{ color: "#777", fontSize: 13 }}>
                  (Choose time between {openTime} - {closeTime})
                </Text>
              )}
            </Text>

            {/* Time Picker Section */}
            <View style={styles.timePickerContainer}>
              <View style={styles.timePicker}>
                {/* Hour Picker */}
                <View style={styles.timeSection}>
                  <TouchableOpacity 
                    style={styles.arrowButton}
                    onPress={() => scrollByArrow('hour', 'up')}
                  >
                    <Ionicons name="chevron-up" size={20} color="#333" />
                  </TouchableOpacity>
                  <View style={styles.timeValueContainer}>
                    <Text style={styles.timeValueText}>
                      {displayHour.toString().padStart(2, '0')}
                    </Text>
                  </View>
                  <TouchableOpacity 
                    style={styles.arrowButton}
                    onPress={() => scrollByArrow('hour', 'down')}
                  >
                    <Ionicons name="chevron-down" size={20} color="#333" />
                  </TouchableOpacity>
                </View>

                <Text style={styles.timeSeparator}>:</Text>

                {/* Minute Picker */}
                <View style={styles.timeSection}>
                  <TouchableOpacity 
                    style={styles.arrowButton}
                    onPress={() => scrollByArrow('minute', 'up')}
                  >
                    <Ionicons name="chevron-up" size={20} color="#333" />
                  </TouchableOpacity>
                  <View style={styles.timeValueContainer}>
                    <Text style={styles.timeValueText}>
                      {currentMinute.toString().padStart(2, '0')}
                    </Text>
                  </View>
                  <TouchableOpacity 
                    style={styles.arrowButton}
                    onPress={() => scrollByArrow('minute', 'down')}
                  >
                    <Ionicons name="chevron-down" size={20} color="#333" />
                  </TouchableOpacity>
                </View>

                {/* AM/PM Picker */}
                <View style={[styles.timeSection, styles.ampmSection]}>
                  <TouchableOpacity 
                    style={styles.arrowButton}
                    onPress={() => scrollByArrow('ampm', 'up')}
                  >
                    <Ionicons name="chevron-up" size={20} color="#333" />
                  </TouchableOpacity>
                  <View style={styles.timeValueContainer}>
                    <Text style={styles.timeValueText}>
                      {currentAmPm}
                    </Text>
                  </View>
                  <TouchableOpacity 
                    style={styles.arrowButton}
                    onPress={() => scrollByArrow('ampm', 'down')}
                  >
                    <Ionicons name="chevron-down" size={20} color="#333" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Confirm / Cancel */}
            <View style={styles.bottomButtons}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => {
                  setSelectedDate(null);
                  setModalVisible(false);
                }}
              >
                <Text style={{ color: Colors.primary, fontWeight: "700" }}>
                  CANCEL
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.confirmBtn,
                  !(selectedTime && selectedDate) && { backgroundColor: "#ccc" },
                ]}
                disabled={!selectedTime || !selectedDate}
                onPress={handleConfirmSlot}
              >
                <Text style={{ color: "#fff", fontWeight: "700" }}>
                  CONFIRM SLOT
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// ---------------- STYLES ----------------
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  headerTitle: { fontSize: 18, fontWeight: "700", marginLeft: 10 },
  serviceCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    elevation: 2,
  },
  serviceImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    backgroundColor: "#eee",
  },
  serviceName: { fontSize: 16, fontWeight: "700" },
  serviceDetails: { color: "#777", marginTop: 4 },
  qtyContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: Colors.primary,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  qtyBtn: { fontSize: 20, color: Colors.primary, paddingHorizontal: 5 },
  qtyText: { fontSize: 16, fontWeight: "600" },
  slotBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 12,
    borderTopWidth: 1,
    borderColor: "#ddd",
  },
  addressText: { fontSize: 14, color: "#333", fontWeight: "500" },
  changeText: { color: "#b30059", fontWeight: "700" },
  slotButton: {
    backgroundColor: "green",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
  },
  slotText: { color: "#fff", fontWeight: "700" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  modalBox: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginVertical: 8,
    color: Colors.primary,
  },
  dateBtn: {
    borderWidth: 1,
    borderColor: Colors.primary,
    padding: 10,
    marginHorizontal: 6,
    borderRadius: 10,
  },
  dateBtnActive: { backgroundColor: Colors.primary },
  dateText: { fontSize: 14, fontWeight: "600", color: Colors.primary },
  confirmBtn: {
    backgroundColor: Colors.primary,
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    flex: 1,
  },
  cancelBtn: {
    borderWidth: 1,
    borderColor: Colors.primary,
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    flex: 1,
    marginRight: 10,
  },
  bottomButtons: { flexDirection: "row", marginTop: 10 },
  timePickerContainer: {
    marginVertical: 20,
    alignItems: 'center', 
  },
  timePicker: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 15,
  },
  timeSection: {
    alignItems: 'center',
    marginHorizontal: 5,
  },
  ampmSection: {
    marginLeft: 15,
    paddingLeft: 15,
    borderLeftWidth: 1,
    borderLeftColor: '#ddd',
  },
  timeValueContainer: {
    minWidth: 50,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 5,
  },
  timeValueText: {
    fontSize: 24,
    fontWeight: '500',
    color: '#333',
  },
  timeSeparator: {
    fontSize: 24,
    fontWeight: '500',
    marginHorizontal: 5,
    color: '#333',
  },
  arrowButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
    margin: 2,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
});