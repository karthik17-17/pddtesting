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
import axios from 'axios';
import BottomNav from '../components/BottomNav';

const API_URL = "https://neurostay-ai.onrender.com";

type Hotel = {
  id: number;
  name: string;
  address: string;
  rating: number;
  price: string;
  image: string;
  matchScore: number;
  why: string;
  mapLink: string;
};

export default function ResultsPage() {
  const router = useRouter();
  const { query: rawQuery } = useLocalSearchParams<{ query?: string }>();
  const query = rawQuery || "Chennai";

  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);

  useEffect(() => {
    const fetchHotels = async () => {
      setLoading(true);
      try {
        const response = await axios.post(`${API_URL}/api/serpapi/hotels`, { query }, {
          headers: { 'Bypass-Tunnel-Reminder': 'true' }
        });
        const data = response.data;

        if (data.success === true && Array.isArray(data.hotels)) {
          setHotels(data.hotels);
        } else {
          setHotels([]);
        }
      } catch (error) {
        console.error("ResultsPage fetch error:", error);
        setHotels([]);
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
        Alert.alert('Error', 'Please login to save hotels');
        return;
      }

      await axios.post(`${API_URL}/api/saved`, hotel, {
        headers: { Authorization: `Bearer ${token}`, 'Bypass-Tunnel-Reminder': 'true' }
      });
      
      Alert.alert('Success', 'Hotel saved to cloud successfully');
    } catch (e: any) {
      console.error('Save hotel error:', e);
      Alert.alert('Error', e.response?.data?.message || 'Failed to save hotel');
    }
  };

  const handleCompare = async (hotel: Hotel) => {
    try {
      const compareStr = await AsyncStorage.getItem('compare_hotels');
      let compareList: Hotel[] = compareStr ? JSON.parse(compareStr) : [];

      const exists = compareList.some(item => item.name === hotel.name);
      if (exists) {
        Alert.alert('Info', 'Hotel already added to comparison');
        return;
      }

      compareList.push(hotel);
      await AsyncStorage.setItem('compare_hotels', JSON.stringify(compareList));
      Alert.alert('Success', 'Hotel added to compare list');
    } catch (e) {
      console.error('Compare hotel error:', e);
      Alert.alert('Error', 'Failed to add to comparison');
    }
  };

  const handleMap = (hotel: Hotel) => {
    if (!hotel.mapLink) {
      Alert.alert('Error', 'No map link available');
      return;
    }
    router.push({
      pathname: '/map',
      params: { url: hotel.mapLink, name: hotel.name, address: hotel.address }
    });
  };

  const renderHotelItem = ({ item }: { item: Hotel }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} defaultSource={require('../assets/images/react-logo.png')} />
      
      <View style={styles.cardContent}>
        <View style={styles.headerRow}>
          <Text style={styles.hotelName} numberOfLines={1}>{item.name}</Text>
          <View style={styles.ratingBadge}>
            <Ionicons name="star" size={14} color="#eab308" />
            <Text style={styles.ratingText}>{item.rating}</Text>
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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Top Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Recommendations</Text>
        <Text style={styles.headerQuery}>Search: {query}</Text>
      </View>

      {/* Main List */}
      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#22d3ee" />
          <Text style={styles.loadingText}>Analyzing stays...</Text>
        </View>
      ) : hotels.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="search-outline" size={48} color="#475569" />
          <Text style={styles.emptyTitle}>No Hotels Found</Text>
          <Text style={styles.emptySubtitle}>Try adjusting your search criteria or query.</Text>
        </View>
      ) : (
        <FlatList
          data={hotels}
          renderItem={renderHotelItem}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
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
                <Image source={{ uri: selectedHotel.image }} style={styles.modalImage} />
                
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

                <TouchableOpacity 
                  style={styles.modalBookButton}
                  onPress={() => {
                    Alert.alert("Success", "Booking initialized successfully!");
                    setSelectedHotel(null);
                  }}
                >
                  <Text style={styles.modalBookButtonText}>Book This Room</Text>
                </TouchableOpacity>
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
    color: '#22d3ee',
    marginTop: 4,
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#e2e8f0',
    marginTop: 15,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 8,
  },
  listContent: {
    padding: 15,
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
    marginVertical: 20,
  },
  modalBookButtonText: {
    color: '#071028',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
