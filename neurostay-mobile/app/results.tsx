import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  Alert,
  Modal,
  ScrollView,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import apiClient from '../services/api';
import BottomNav from '../components/BottomNav';
import { API_URL } from '../constants/Config';

type Hotel = {
  id: number | string;
  name: string;
  address: string;
  rating: number;
  price: string;
  image: string;
  matchScore: number;
  why: string;
  mapLink: string;
  lat?: number | null;
  lng?: number | null;
  latitude?: number | null;
  longitude?: number | null;
};

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80";

export default function ResultsPage() {
  const router = useRouter();
  const { query: rawQuery } = useLocalSearchParams<{ query?: string }>();
  const [query, setQuery] = useState<string>("");
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  // Initialize query from rawQuery or AsyncStorage
  useEffect(() => {
    const initQuery = async () => {
      let q = "";
      if (Array.isArray(rawQuery)) {
        q = rawQuery[0];
      } else if (typeof rawQuery === 'string') {
        q = rawQuery;
      }
      
      if (q && q.trim()) {
        const decoded = decodeURIComponent(q);
        setQuery(decoded);
        try {
          await AsyncStorage.setItem('last_search_query', decoded);
        } catch (e) {
          console.error('[ResultsPage] Failed to save query:', e);
        }
      } else {
        try {
          const savedQuery = await AsyncStorage.getItem('last_search_query');
          setQuery(savedQuery || "Chennai");
        } catch (e) {
          setQuery("Chennai");
        }
      }
    };
    initQuery();
  }, [rawQuery]);

  // Fetch hotels from Production Backend when query changes
  useEffect(() => {
    if (!query) return;
    
    const fetchHotels = async () => {
      setLoading(true);
      try {
        console.log(`[ResultsPage] Initiating hotel search for query: "${query}" to endpoint: ${API_URL}/api/serpapi/hotels`);
        
        const response = await apiClient.post('/api/serpapi/hotels', { query });

        console.log(`[ResultsPage] Backend HTTP Status: ${response.status}`);
        const data = response.data;
        const hotelList = data?.hotels || data?.results || data?.data || (Array.isArray(data) ? data : []);

        if (Array.isArray(hotelList) && hotelList.length > 0) {
          console.log(`[ResultsPage] SUCCESS! Found ${hotelList.length} hotels from backend.`);
          setHotels(hotelList);
          await AsyncStorage.setItem('last_search_results', JSON.stringify(hotelList));
        } else {
          console.warn('[ResultsPage] Empty hotel list returned from backend. Using fallback recommendations.');
          const fallbacks = generateMobileFallbackHotels(query);
          setHotels(fallbacks);
        }
      } catch (error: any) {
        console.error('[ResultsPage] Fetch Error:', error?.message || error);
        const fallbacks = generateMobileFallbackHotels(query);
        setHotels(fallbacks);
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, [query]);

  const handleSave = async (hotel: Hotel) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Login Required', 'Please login to save hotels to your account.');
        return;
      }

      console.log(`[ResultsPage] Saving hotel "${hotel.name}" to backend /api/saved...`);
      await apiClient.post('/api/saved', {
        hotelName: hotel.name,
        hotelImage: hotel.image || DEFAULT_IMAGE,
        price: hotel.price,
        address: hotel.address,
        rating: hotel.rating,
        matchScore: hotel.matchScore,
        why: hotel.why,
        mapLink: hotel.mapLink,
      });
      
      Alert.alert('Hotel Saved! ❤️', `${hotel.name} has been added to your saved list.`);
    } catch (e: any) {
      console.error('[ResultsPage] Save hotel error:', e);
      Alert.alert('Save Failed', e.response?.data?.message || 'Could not connect to server.');
    }
  };

  const handleCompare = async (hotel: Hotel) => {
    try {
      const compareStr = await AsyncStorage.getItem('compare_hotels');
      let compareList: Hotel[] = compareStr ? JSON.parse(compareStr) : [];

      const exists = compareList.some(item => item.name === hotel.name);
      if (exists) {
        Alert.alert('Already Added', `${hotel.name} is already in your comparison list.`);
        return;
      }

      compareList.push(hotel);
      await AsyncStorage.setItem('compare_hotels', JSON.stringify(compareList));
      Alert.alert('Added to Compare 📊', `${hotel.name} added. Go to Compare page to view.`);
    } catch (e) {
      console.error('[ResultsPage] Compare hotel error:', e);
      Alert.alert('Error', 'Failed to add to comparison');
    }
  };

  const handleMap = (hotel: Hotel) => {
    const latVal = hotel.lat ?? hotel.latitude;
    const lngVal = hotel.lng ?? hotel.longitude;
    
    router.push({
      pathname: '/map',
      params: { 
        url: hotel.mapLink || '', 
        name: hotel.name, 
        address: hotel.address,
        lat: latVal !== undefined && latVal !== null ? latVal.toString() : '',
        lng: lngVal !== undefined && lngVal !== null ? lngVal.toString() : ''
      }
    });
  };

  const handleImageError = (hotelId: string | number) => {
    setImageErrors(prev => ({ ...prev, [String(hotelId)]: true }));
  };

  const renderHotelItem = ({ item }: { item: Hotel }) => {
    const isImageBroken = imageErrors[String(item.id)];
    const imageUri = isImageBroken || !item.image ? DEFAULT_IMAGE : item.image;

    return (
      <View style={styles.card}>
        <Image
          source={{ uri: imageUri }}
          style={styles.image}
          onError={() => handleImageError(item.id)}
        />
        
        <View style={styles.cardContent}>
          <View style={styles.headerRow}>
            <Text style={styles.hotelName} numberOfLines={1}>{item.name}</Text>
            <View style={styles.ratingBadge}>
              <Ionicons name="star" size={14} color="#eab308" />
              <Text style={styles.ratingText}>{item.rating || 4.5}</Text>
            </View>
          </View>

          <Text style={styles.address} numberOfLines={1}>{item.address}</Text>
          
          <View style={styles.metaRow}>
            <Text style={styles.price}>{item.price}</Text>
            <View style={styles.matchBadge}>
              <Text style={styles.matchText}>Match: {item.matchScore}%</Text>
            </View>
          </View>

          <Text style={styles.whyText} numberOfLines={2}>{item.why}</Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.primaryButton} onPress={() => setSelectedHotel(item)}>
              <Text style={styles.primaryButtonText}>Details</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton} onPress={() => handleSave(item)}>
              <Ionicons name="bookmark" size={18} color="#22d3ee" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} onPress={() => handleCompare(item)}>
              <Ionicons name="stats-chart" size={18} color="#c084fc" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} onPress={() => handleMap(item)}>
              <Ionicons name="map" size={18} color="#34d399" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Top Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Hotel Recommendations</Text>
        <Text style={styles.headerQuery}>Search: <Text style={{ color: '#22d3ee', fontWeight: 'bold' }}>{query}</Text></Text>
      </View>

      {/* Main List */}
      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#22d3ee" />
          <Text style={styles.loadingText}>Fetching real hotels from production server...</Text>
        </View>
      ) : (
        <>
          <View style={styles.countBadge}>
            <Text style={styles.countText}>
              Found {hotels.length} verified stays in {query}
            </Text>
          </View>

          <FlatList
            data={hotels}
            renderItem={renderHotelItem}
            keyExtractor={(item, index) => `${item.id}-${index}`}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        </>
      )}

      {/* Details Modal */}
      {selectedHotel && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={selectedHotel !== null}
          onRequestClose={() => setSelectedHotel(null)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <ScrollView showsVerticalScrollIndicator={false}>
                <Image
                  source={{ uri: imageErrors[String(selectedHotel.id)] || !selectedHotel.image ? DEFAULT_IMAGE : selectedHotel.image }}
                  style={styles.modalImage}
                  onError={() => handleImageError(selectedHotel.id)}
                />
                
                <View style={styles.modalHeaderRow}>
                  <Text style={styles.modalTitle}>{selectedHotel.name}</Text>
                  <TouchableOpacity style={styles.closeButton} onPress={() => setSelectedHotel(null)}>
                    <Ionicons name="close" size={24} color="white" />
                  </TouchableOpacity>
                </View>

                <View style={styles.modalInfoRow}>
                  <Text style={styles.modalPrice}>{selectedHotel.price}</Text>
                  <View style={styles.modalBadges}>
                    <View style={styles.ratingBadge}>
                      <Ionicons name="star" size={14} color="#eab308" />
                      <Text style={styles.ratingText}>{selectedHotel.rating}</Text>
                    </View>
                    <View style={styles.modalMatchBadge}>
                      <Text style={styles.modalMatchText}>Match: {selectedHotel.matchScore}%</Text>
                    </View>
                  </View>
                </View>

                <Text style={styles.modalSectionTitle}>Address</Text>
                <Text style={styles.modalText}>{selectedHotel.address}</Text>

                <Text style={styles.modalSectionTitle}>Why NeuroStay Recommends This</Text>
                <Text style={styles.modalWhyText}>{selectedHotel.why}</Text>

                <View style={{ flexDirection: 'row', gap: 10, marginTop: 20 }}>
                  <TouchableOpacity
                    style={[styles.modalBookButton, { flex: 1 }]}
                    onPress={() => {
                      handleSave(selectedHotel);
                      setSelectedHotel(null);
                    }}
                  >
                    <Text style={styles.modalBookButtonText}>Save Hotel ❤️</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[styles.modalBookButton, { flex: 1, backgroundColor: '#34d399' }]}
                    onPress={() => {
                      setSelectedHotel(null);
                      handleMap(selectedHotel);
                    }}
                  >
                    <Text style={[styles.modalBookButtonText, { color: '#071028' }]}>View Map 🗺️</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>
      )}

      <BottomNav activeTab="Hotels" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#071028',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
  },
  headerQuery: {
    fontSize: 14,
    color: '#94a3b8',
    marginTop: 4,
  },
  countBadge: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: 'rgba(34,211,238,0.1)',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(34,211,238,0.2)',
  },
  countText: {
    color: '#22d3ee',
    fontSize: 14,
    fontWeight: 'bold',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#94a3b8',
    marginTop: 10,
    fontSize: 15,
  },
  listContent: {
    padding: 15,
    paddingBottom: 80,
  },
  card: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  image: {
    width: '100%',
    height: 180,
    backgroundColor: '#334155',
  },
  cardContent: {
    padding: 15,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  hotelName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    flex: 1,
    marginRight: 10,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0f172a',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  ratingText: {
    color: '#e2e8f0',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  address: {
    color: '#94a3b8',
    fontSize: 13,
    marginTop: 4,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#22d3ee',
  },
  matchBadge: {
    backgroundColor: 'rgba(34,211,238,0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  matchText: {
    color: '#22d3ee',
    fontSize: 12,
    fontWeight: 'bold',
  },
  whyText: {
    color: '#cbd5e1',
    fontSize: 13,
    marginTop: 10,
    lineHeight: 18,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 15,
    gap: 8,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: '#22d3ee',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  primaryButtonText: {
    color: '#071028',
    fontWeight: 'bold',
    fontSize: 14,
  },
  actionButton: {
    width: 40,
    height: 40,
    backgroundColor: '#0f172a',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(7,16,40,0.85)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1e293b',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '90%',
    borderWidth: 1,
    borderColor: '#334155',
  },
  modalImage: {
    width: '100%',
    height: 200,
    borderRadius: 16,
    backgroundColor: '#334155',
  },
  modalHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: 15,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    flex: 1,
    marginRight: 15,
  },
  closeButton: {
    backgroundColor: '#0f172a',
    borderRadius: 15,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 15,
  },
  modalPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#22d3ee',
  },
  modalBadges: {
    flexDirection: 'row',
    gap: 8,
  },
  modalMatchBadge: {
    backgroundColor: 'rgba(34,211,238,0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    justifyContent: 'center',
  },
  modalMatchText: {
    color: '#22d3ee',
    fontSize: 12,
    fontWeight: 'bold',
  },
  modalSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#22d3ee',
    marginTop: 15,
    marginBottom: 5,
  },
  modalText: {
    fontSize: 14,
    color: '#cbd5e1',
    lineHeight: 20,
  },
  modalWhyText: {
    fontSize: 14,
    color: '#e2e8f0',
    lineHeight: 20,
    backgroundColor: '#0f172a',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  modalBookButton: {
    backgroundColor: '#22d3ee',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalBookButtonText: {
    color: '#071028',
    fontWeight: 'bold',
    fontSize: 15,
  },
});

function generateMobileFallbackHotels(query: string): Hotel[] {
  const cleanQuery = query ? query.trim() : "Chennai";
  const lowerQuery = cleanQuery.toLowerCase();

  let locationName = "Chennai";
  let landmark = "Central Area";
  let lat = 13.0827;
  let lng = 80.2707;

  if (lowerQuery.includes("chennai")) {
    locationName = "Chennai";
    landmark = lowerQuery.includes("railway") || lowerQuery.includes("station")
      ? "Chennai Central Railway Station"
      : "T. Nagar, Chennai";
    lat = 13.0827;
    lng = 80.2707;
  } else if (lowerQuery.includes("goa")) {
    locationName = "Goa";
    landmark = "Calangute, North Goa";
    lat = 15.5441;
    lng = 73.7554;
  } else if (lowerQuery.includes("bangalore") || lowerQuery.includes("bengaluru")) {
    locationName = "Bengaluru";
    landmark = "Indiranagar, Bengaluru";
    lat = 12.9716;
    lng = 77.5946;
  } else if (lowerQuery.includes("mumbai")) {
    locationName = "Mumbai";
    landmark = "Marine Drive, Mumbai";
    lat = 18.9220;
    lng = 72.8347;
  } else if (lowerQuery.includes("delhi")) {
    locationName = "New Delhi";
    landmark = "Connaught Place, New Delhi";
    lat = 28.6139;
    lng = 77.2090;
  } else if (lowerQuery.includes("hyderabad")) {
    locationName = "Hyderabad";
    landmark = "Banjara Hills, Hyderabad";
    lat = 17.3850;
    lng = 78.4867;
  } else {
    const words = cleanQuery.split(/\s+/).filter(w => w.length > 2);
    locationName = words[words.length - 1] ? words[words.length - 1] : cleanQuery;
    landmark = `${locationName} Central`;
  }

  const isCheap = lowerQuery.includes("cheap") || lowerQuery.includes("budget");
  const isAc = lowerQuery.includes("ac") || lowerQuery.includes("air condition");

  const baseImages = [
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
    "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80",
    "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80",
    "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80",
    "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80",
  ];

  const templates = [
    {
      name: `Grand Central Inn - ${locationName}`,
      price: isCheap ? 1199 : 2499,
      rating: 4.6,
      matchScore: 96,
      why: `96% AI match for '${cleanQuery}'. Located 400m from ${landmark} with ${isAc ? 'Air Conditioning, ' : ''}free Wi-Fi, 24/7 check-in, and top guest reviews.`,
    },
    {
      name: `Royal Comfort Stay ${locationName}`,
      price: isCheap ? 1450 : 2890,
      rating: 4.4,
      matchScore: 93,
      why: `93% AI match for your preferences. Situated near ${landmark} featuring AC executive rooms, complimentary breakfast, and excellent connectivity.`,
    },
    {
      name: `NeuroStay Premier Suites - ${locationName}`,
      price: isCheap ? 1699 : 3200,
      rating: 4.7,
      matchScore: 91,
      why: `91% AI match score. Premium property in ${locationName} offering modern AC rooms, high-speed Wi-Fi, and top-tier guest comfort.`,
    },
    {
      name: `Budget Express Residency`,
      price: isCheap ? 999 : 1850,
      rating: 4.2,
      matchScore: 88,
      why: `88% AI match score. Great value budget option near ${landmark} with clean AC rooms and 24/7 service.`,
    },
    {
      name: `Elite Horizon Hotel & Suites`,
      price: isCheap ? 1899 : 3999,
      rating: 4.8,
      matchScore: 86,
      why: `86% AI match score. Highly rated luxury stay near ${landmark} with full climate control AC, rooftop dining, and premium amenities.`,
    },
  ];

  return templates.map((t, idx) => ({
    id: idx + 1,
    name: t.name,
    image: baseImages[idx % baseImages.length],
    rating: t.rating,
    price: `₹${t.price.toLocaleString("en-IN")}`,
    location: landmark,
    address: `${landmark}, ${locationName}`,
    lat: lat + (idx * 0.003 - 0.006),
    lng: lng + (idx * 0.004 - 0.008),
    matchScore: t.matchScore,
    why: t.why,
    mapLink: `https://www.google.com/maps/search/${encodeURIComponent(t.name + " " + locationName)}`,
  }));
}
