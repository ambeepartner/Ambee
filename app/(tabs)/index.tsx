import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  ActivityIndicator,
  Modal,
  Dimensions,
} from "react-native";
import { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Colors } from "@/constants/Colors";
import { db } from "@/app/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { Ionicons } from "@expo/vector-icons";

const { height: screenHeight } = Dimensions.get("window");

type Gender = "men" | "women";

type Shop = {
  id: string;
  ownerName?: string;
  studioName?: string;
  shopName?: string;
  imageUrl?: string;
  shopType?: string;
  isOpenNow?: boolean;
};

function FiltersModal({
  visible,
  onClose,
  onApply,
}: {
  visible: boolean;
  onClose: () => void;
  onApply: () => void;
}) {
  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.bottomSheet}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filters and sorting</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#000" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.filterCategory}>Sort by</Text>
            <View style={styles.filterOptionsRow}>
              {["Relevance", "Rating", "Price: Low to High", "Price: High to Low"].map(
                (option, index) => (
                  <TouchableOpacity key={index} style={styles.filterOptionBox}>
                    <Text style={styles.filterOptionText}>{option}</Text>
                  </TouchableOpacity>
                )
              )}
            </View>

            <Text style={styles.filterCategory}>Time</Text>
            <View style={styles.filterOptionsRow}>
              <TouchableOpacity style={styles.filterOptionBox}>
                <Ionicons name="calendar-outline" size={16} color="#000" />
                <Text style={styles.filterOptionText}>Schedule</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.filterOptionBox}>
                <Ionicons name="timer-outline" size={16} color="#000" />
                <Text style={styles.filterOptionText}>Under 30 mins</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.filterCategory}>Rating</Text>
            <View style={styles.filterOptionsRow}>
              <TouchableOpacity style={styles.filterOptionBox}>
                <Ionicons name="star" size={16} color="#0a0" />
                <Text style={styles.filterOptionText}>Rated 3.5+</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.filterOptionBox}>
                <Ionicons name="star" size={16} color="#0a0" />
                <Text style={styles.filterOptionText}>Rated 4.0+</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.filterCategory}>Offers</Text>
            <View style={styles.filterOptionsRow}>
              <TouchableOpacity style={styles.filterOptionBox}>
                <Ionicons name="pricetag-outline" size={16} color="#000" />
                <Text style={styles.filterOptionText}>Buy 1 Get 1 and more</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>

          <View style={styles.bottomButtons}>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Text style={{ color: "#000", fontWeight: "600" }}>Close</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.applyBtn} onPress={onApply}>
              <Text style={{ color: "#fff", fontWeight: "600" }}>Show Results</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

export default function HomeScreen() {
  const router = useRouter();
  const [selectedGender, setSelectedGender] = useState<Gender>("women");
  const [searchQuery, setSearchQuery] = useState("");
  const [services, setServices] = useState<any[]>([]);
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(false);
  const [filtersVisible, setFiltersVisible] = useState(false);

  const [userLocation] = useState({ address: "Vikhroli East, Mumbai" });

  const fetchServices = async (gender: Gender) => {
    try {
      setLoading(true);
      const colRef = collection(db, gender);
      const snapshot = await getDocs(colRef);
      const data = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setServices(data);
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setLoading(false);
    }
  };

  // FIX: shopName added + gender filter correct
  const fetchShops = async (gender: Gender) => {
    try {
      setLoading(true);

      const colRef = collection(db, "salonOwners");
      const snapshot = await getDocs(colRef);

      const allShops: Shop[] = snapshot.docs.map((doc) => {
        const data = doc.data();

        return {
          id: doc.id,
          ownerName: data.ownerName,
          studioName: data.studioName,
          shopName: data.shopName, // 🔥 added FIX
          imageUrl: data.ownerPhoto,
          shopType: data.shopType,
          isOpenNow: true,
        };
      });

      const g = gender.toLowerCase();

      const filtered = allShops.filter((shop) => {
        const type = (shop.shopType || "").toLowerCase();

        if (type === "unisex") return true;
        if (type === g) return true;

        return false;
      });

      setShops(filtered);
    } catch (error) {
      console.error("Error fetching shops:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices(selectedGender);
    fetchShops(selectedGender);
  }, [selectedGender]);

  const handleShopPress = (shopId: string) => {
    router.push({
      pathname: "/shopDetails",
      params: { shopId },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.toggleContainerTop}>
            {["men", "women"].map((gender) => (
              <TouchableOpacity
                key={gender}
                style={[
                  styles.toggleButton,
                  selectedGender === gender && styles.toggleSelected,
                ]}
                onPress={() => setSelectedGender(gender as Gender)}
              >
                <Text
                  style={[
                    styles.toggleText,
                    selectedGender === gender && styles.toggleTextSelected,
                  ]}
                >
                  {gender.toUpperCase()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={styles.profileIcon}
            onPress={() => router.push("/profile")}
          >
            <Ionicons name="person-circle-outline" size={40} color="#000" />
          </TouchableOpacity>
        </View>

        <Text style={styles.locationText}>📍 {userLocation.address}</Text>

        {/* Search + Filter */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder='Search "salons and spas"...'
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor={Colors.textLight}
            />
          </View>

          <TouchableOpacity
            style={styles.filterButtonContainer}
            onPress={() => setFiltersVisible(true)}
          >
            <Text style={styles.filterButtonText}>⚙ Filters & Sorting</Text>
          </TouchableOpacity>
        </View>

        {/* Popular Services */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Popular Services ({selectedGender})
          </Text>
          {loading ? (
            <ActivityIndicator size="large" color={Colors.primary} />
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.servicesRow}>
                {services.map((service, i) => (
                  <TouchableOpacity key={i} style={styles.serviceCard}>
                    {service.image && (
                      <Image
                        source={{ uri: service.image }}
                        style={styles.serviceImage}
                      />
                    )}
                    <Text style={styles.serviceName}>{service.name}</Text>
                    {service.price && (
                      <Text style={styles.servicePrice}>₹{service.price}</Text>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          )}
        </View>

        {/* Popular Shops */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Popular Shops</Text>

          {loading ? (
            <ActivityIndicator size="large" color={Colors.primary} />
          ) : (
            <View style={styles.verticalList}>
              {shops.map((shop) => (
                <TouchableOpacity
                  key={shop.id}
                  style={styles.shopCard}
                  onPress={() => handleShopPress(shop.id)}
                >
                  {shop.imageUrl ? (
                    <Image source={{ uri: shop.imageUrl }} style={styles.shopImage} />
                  ) : (
                    <View style={styles.shopPlaceholder}>
                      <Ionicons name="image" size={40} color="#aaa" />
                    </View>
                  )}

                  <Text style={styles.shopName}>
                    {shop.shopName || shop.studioName || shop.ownerName}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      <FiltersModal
        visible={filtersVisible}
        onClose={() => setFiltersVisible(false)}
        onApply={() => setFiltersVisible(false)}
      />
    </SafeAreaView>
  );
}

// STYLES
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  locationText: { color: "#555", marginLeft: 20, marginTop: 4 },
  profileIcon: { padding: 4 },
  toggleContainerTop: { flexDirection: "row", gap: 10 },
  toggleButton: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  toggleSelected: { backgroundColor: "#000", borderColor: "#000" },
  toggleText: { color: "#333", fontWeight: "600" },
  toggleTextSelected: { color: "#fff" },
  searchContainer: { paddingHorizontal: 20, marginTop: 10 },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f2f2f2",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  searchIcon: { fontSize: 16 },
  searchInput: { flex: 1, marginLeft: 8 },
  filterButtonContainer: {
    marginTop: 10,
    backgroundColor: "#f2f2f2",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    alignSelf: "flex-start",
  },
  filterButtonText: { fontSize: 15, fontWeight: "600", color: "#333" },
  section: { padding: 20 },
  sectionTitle: { fontSize: 18, fontWeight: "700", marginBottom: 10 },
  servicesRow: { flexDirection: "row", gap: 12 },
  serviceCard: {
    backgroundColor: "#fafafa",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  serviceImage: { width: 60, height: 60, borderRadius: 10 },
  serviceName: { marginTop: 6, fontWeight: "600" },
  servicePrice: { color: "#777" },
  verticalList: { gap: 12 },
  shopCard: { backgroundColor: "#fafafa", borderRadius: 12, padding: 12 },
  shopImage: { width: "100%", height: 150, borderRadius: 10 },
  shopPlaceholder: {
    width: "100%",
    height: 150,
    backgroundColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  shopName: { fontWeight: "700", fontSize: 16 },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "flex-end",
  },
  bottomSheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: screenHeight * 0.8,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  modalTitle: { fontSize: 18, fontWeight: "700" },
  filterCategory: { fontSize: 16, fontWeight: "600", marginVertical: 10 },
  filterOptionsRow: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  filterOptionBox: {
    backgroundColor: "#f3f3f3",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  filterOptionText: { fontSize: 14, color: "#333" },
  bottomButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
  closeBtn: {
    flex: 1,
    backgroundColor: "#eee",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginRight: 10,
  },
  applyBtn: {
    flex: 1,
    backgroundColor: "#000",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
});