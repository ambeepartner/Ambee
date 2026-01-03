import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { db } from "@/app/firebaseConfig";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { useCart } from "@/app/CartContext";
import { useNavigation } from "@react-navigation/native";

type Shop = {
  id: string;
  name?: string;
  address?: string;
  imageUrl?: string;
  isOpenNow?: boolean;
  rating?: number;
  distance?: string;
  genderCategory?: string[];
  locality?: string;
  offers?: string[];
};

type Service = {
  id: string;
  name: string;
  price?: number | string;
  image?: string;
};

export default function ShopDetails() {
  const router = useRouter();
  const navigation = useNavigation();
  const { shopId } = useLocalSearchParams<{ shopId: string }>();

  const [shop, setShop] = useState<Shop | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  const {
    cartItems,
    addToCart,
    increaseQty,
    decreaseQty,
    totalPrice,
    setCurrentShop,
    clearCart,
    currentShopId,
  } = useCart();

  // ⭐ NEW — Review bottom sheet toggle
  const [showReview, setShowReview] = useState(false);

  // Fetch shop + clear different shop cart
  useEffect(() => {
    if (shopId) {
      if (currentShopId && currentShopId !== shopId) {
        clearCart();
      }
      setCurrentShop(shopId);
      fetchShopData(shopId);
    }
  }, [shopId]);

  // Clear cart when leaving screen
  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", (e) => {
      const nextRoute =
        typeof e.data.action?.payload === "object" &&
        "name" in e.data.action.payload
          ? (e.data.action.payload.name as string)
          : null;

      if (nextRoute !== "Checkout" && nextRoute !== "ShopDetails") {
        clearCart();
      }
    });

    return unsubscribe;
  }, [navigation]);

  const fetchShopData = async (id: string) => {
    try {
      setLoading(true);
      const shopRef = doc(db, "shops", id);
      const shopSnap = await getDoc(shopRef);

      if (!shopSnap.exists()) {
        setShop(null);
        setLoading(false);
        return;
      }

      const shopData = { id, ...shopSnap.data() } as Shop;
      setShop(shopData);

      const subcollectionNames = [
        "services",
        "services1",
        "service1",
        "service2",
        "service3",
      ];
      const allServices: Service[] = [];

      for (const subName of subcollectionNames) {
        const colRef = collection(db, "shops", id, subName);
        const colSnap = await getDocs(colRef);
        colSnap.forEach((docSnap) => {
          const data = docSnap.data();
          allServices.push({
            id: docSnap.id,
            name: data.name || "Unnamed Service",
            price: Number(data.price) || 0,
            image:
              data.image ||
              "https://cdn-icons-png.flaticon.com/512/2921/2921822.png",
          });
        });
      }

      setServices(allServices);
    } catch (error) {
      console.error("Error fetching shop details:", error);
    } finally {
      setLoading(false);
    }
  };

  const getQty = (serviceId: string) => {
    const item = cartItems.find((i) => i.id === serviceId);
    return item ? item.qty : 0;
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.qty, 0);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!shop) {
    return (
      <View style={styles.centered}>
        <Text>Shop not found.</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>

        {shop.imageUrl ? (
          <Image source={{ uri: shop.imageUrl }} style={styles.shopImage} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Ionicons name="image" size={40} color="#aaa" />
          </View>
        )}

        <View style={styles.infoContainer}>
          <View style={styles.shopHeader}>
            <Text style={styles.shopName}>{shop.name}</Text>
            {shop.rating && (
              <Text style={styles.rating}>⭐ {shop.rating.toFixed(1)}</Text>
            )}
          </View>
          {shop.distance && (
            <Text style={styles.distance}>{shop.distance} km away</Text>
          )}
          <Text style={styles.shopAddress}>{shop.address || shop.locality}</Text>
          <Text style={styles.status}>
            {shop.isOpenNow ? "🟢 Open Now" : "🔴 Closed"}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Services</Text>
          {services.length === 0 ? (
            <Text style={{ color: "#555" }}>No services found.</Text>
          ) : (
            services.map((service) => {
              const qty = getQty(service.id);
              return (
                <View key={service.id} style={styles.serviceCard}>
                  <View style={styles.serviceInfo}>
                    <Text style={styles.serviceName}>{service.name}</Text>
                    {service.price ? (
                      <Text style={styles.servicePrice}>₹{service.price}</Text>
                    ) : null}
                  </View>

                  <View style={styles.serviceRight}>
                    <Image
                      source={{ uri: service.image }}
                      style={styles.serviceImage}
                    />
                    {qty === 0 ? (
                      <TouchableOpacity
                        style={styles.addButton}
                        onPress={() =>
                          addToCart({
                            id: service.id,
                            name: service.name,
                            price: Number(service.price) || 0,
                            image: service.image,
                            qty: 1,
                          })
                        }
                      >
                        <Text style={styles.addButtonText}>ADD</Text>
                      </TouchableOpacity>
                    ) : (
                      <View style={styles.qtyContainer}>
                        <TouchableOpacity onPress={() => decreaseQty(service.id)}>
                          <Text style={styles.qtyBtn}>-</Text>
                        </TouchableOpacity>
                        <Text style={styles.qtyText}>{qty}</Text>
                        <TouchableOpacity onPress={() => increaseQty(service.id)}>
                          <Text style={styles.qtyBtn}>+</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                </View>
              );
            })
          )}
        </View>
      </ScrollView>

      {/* ⭐ UPDATED CHECKOUT BAR WITH ARROW */}
      {totalItems > 0 && (
        <>
          <View style={styles.checkoutBar}>
            <TouchableOpacity onPress={() => setShowReview(!showReview)}>
              <Text style={styles.checkoutText}>
                {totalItems} items {showReview ? "▲" : "▼"}
              </Text>
              <Text style={styles.checkoutPrice}>
                ₹{totalPrice.toLocaleString()}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.checkoutButton}
              onPress={() =>
                router.push({
                  pathname: "/Checkout",
                  params: { shopId },
                })
              }
            >
              <Text style={styles.checkoutButtonText}>CHECKOUT</Text>
            </TouchableOpacity>
          </View>

          {/* ⭐ REVIEW BOTTOM PANEL */}
          {showReview && (
            <View style={styles.reviewPanel}>
              <Text style={styles.reviewTitle}>Review Items</Text>

              {cartItems.map((item) => (
                <View key={item.id} style={styles.reviewItem}>
                  <Image source={{ uri: item.image }} style={styles.reviewImage} />

                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={styles.reviewName}>{item.name}</Text>
                    <Text style={styles.reviewPrice}>₹{item.price}</Text>
                  </View>

                  <View style={styles.qtyContainerSmall}>
                    <TouchableOpacity onPress={() => decreaseQty(item.id)}>
                      <Text style={styles.qtyBtn}>-</Text>
                    </TouchableOpacity>

                    <Text style={styles.qtyText}>{item.qty}</Text>

                    <TouchableOpacity onPress={() => increaseQty(item.id)}>
                      <Text style={styles.qtyBtn}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}

              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalAmount}>
                  ₹{totalPrice.toLocaleString()}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.doneBtn}
                onPress={() => setShowReview(false)}
              >
                <Text style={styles.doneBtnText}>DONE</Text>
              </TouchableOpacity>
            </View>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  backButton: { padding: 16 },
  shopImage: { width: "100%", height: 220 },
  imagePlaceholder: {
    width: "100%",
    height: 220,
    backgroundColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
  },
  infoContainer: { padding: 16 },
  shopHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  shopName: { fontSize: 22, fontWeight: "700" },
  rating: { fontSize: 16, fontWeight: "600", color: "#444" },
  distance: { fontSize: 14, color: "#777", marginTop: 4 },
  shopAddress: { color: "#555", marginVertical: 4 },
  status: { fontSize: 15, fontWeight: "600" },
  section: { paddingHorizontal: 16, paddingTop: 10, marginBottom: 100 },
  sectionTitle: { fontSize: 18, fontWeight: "700", marginBottom: 10 },
  serviceCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    alignItems: "center",
  },
  serviceInfo: { flex: 1 },
  serviceName: { fontSize: 17, fontWeight: "600", color: "#333" },
  servicePrice: { fontSize: 15, color: "#777", marginTop: 4 },
  serviceRight: { alignItems: "center" },
  serviceImage: {
    width: 70,
    height: 70,
    borderRadius: 10,
    backgroundColor: "#eee",
  },
  addButton: {
    marginTop: 8,
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 6,
    borderRadius: 25,
  },
  addButtonText: { color: "#fff", fontWeight: "600", fontSize: 14 },
  qtyContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 25,
    marginTop: 8,
    paddingHorizontal: 14,
    justifyContent: "space-between",
    minWidth: 80,
  },
  qtyBtn: { fontSize: 22, fontWeight: "700", color: Colors.primary },
  qtyText: { fontSize: 17, fontWeight: "600", color: "#333" },
  checkoutBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    elevation: 8,
  },
  checkoutText: { fontSize: 15, fontWeight: "600", color: "#333" },
  checkoutPrice: { fontSize: 16, fontWeight: "700", color: Colors.primary },
  checkoutButton: {
    backgroundColor: "green",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
  },
  checkoutButtonText: { color: "#fff", fontSize: 15, fontWeight: "700" },

  /* ⭐ ADDED NEW STYLES BELOW ⭐ */

  reviewPanel: {
    position: "absolute",
    bottom: 60,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: "60%",
    elevation: 20,
  },
  reviewTitle: { fontSize: 20, fontWeight: "700", marginBottom: 15 },
  reviewItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f4f4f4",
    borderRadius: 12,
    padding: 10,
    marginBottom: 12,
  },
  reviewImage: { width: 55, height: 55, borderRadius: 8 },
  reviewName: { fontSize: 16, fontWeight: "600" },
  reviewPrice: { fontSize: 14, color: "green", marginTop: 4 },
  qtyContainerSmall: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 3,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: "#ddd",
  },
  totalLabel: { fontSize: 17, fontWeight: "700" },
  totalAmount: { fontSize: 18, fontWeight: "700", color: Colors.primary },
  doneBtn: {
    backgroundColor: "green",
    marginTop: 15,
    paddingVertical: 12,
    borderRadius: 25,
  },
  doneBtnText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "700",
    fontSize: 16,
  },
});
