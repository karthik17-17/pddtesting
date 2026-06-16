import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
  Modal,
  ScrollView,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
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

export default function SavedPage() {
  const router = useRouter();
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);

  const loadSavedHotels = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) return;

      const response = await axios.get(`${API_URL}/api/saved`, {
        headers: { Authorization: `Bearer ${token}`, 'Bypass-Tunnel-Reminder': 'true' }
      });

      if (response.data.success) {
        setHotels(response.data.hotels || []);
      }
    } catch (e) {
      console.error('Failed to load saved hotels:', e);
    }
  };

  useEffect(() => {
    loadSavedHotels();
  }, []);

  const handleRemove = async (hotel: Hotel) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) return;

      // Ensure we use the MongoDB _id for removal if available, fallback to searching by name
      const hotelId = (hotel as any)._id || hotel.id;

      await axios.delete(`${API_URL}/api/saved/${hotel._id || hotel.id}`, {
        headers: { Authorization: `Bearer ${token}`, 'Bypass-Tunnel-Reminder': 'true' }
      });

      const updated = hotels.filter(item => item.name !== hotel.name);
      setHotels(updated);
      Alert.alert('Success', 'Hotel removed from cloud');
    } catch (e: any) {
      console.error('Failed to remove hotel:', e);
      Alert.alert('Error', e.response?.data?.message || 'Failed to remove hotel');
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
      console.error('Failed to add to compare:', e);
    }
  };

  const handleMap = (hotel: Hotel) => {
    if (!hotel.mapLink) {
      Alert.alert('Error', 'No map link available');
      return;
    }
    router.push({
      pathname: '/map',
      params: { url: hotel.mapLink, name: hotel.name }
    });
  };

  const renderHotelItem = ({ item }: { item: Hotel }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} />
      
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

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.primaryButton} onPress={() => setSelectedHotel(item)}>
            <Text style={styles.primaryButtonText}>Details</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.removeButton} onPress={() => handleRemove(item)}>
            <Ionicons name="trash-outline" size={18} color="#ef4444" />
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
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Saved Stays</Text>
        <Text style={styles.headerSubtitle}>Hotels you have bookmarked for later</Text>
      </View>

      {hotels.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="bookmark-outline" size={48} color="#475569" />
          <Text style={styles.emptyTitle}>No Saved Hotels</Text>
          <Text style={styles.emptySubtitle}>Go back to hotels tab and press bookmark to save your recommendations.</Text>
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

      <BottomNav activeTab="Saved" />
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
  headerSubtitle: {
    fontSize: 13,
    color: '#94a3b8',
    marginTop: 4,
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
    lineHeight: 20,
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
  removeButton: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)',
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
