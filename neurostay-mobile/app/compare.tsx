import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import BottomNav from '../components/BottomNav';

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

export default function ComparePage() {
  const [hotels, setHotels] = useState<Hotel[]>([]);

  const loadCompareHotels = async () => {
    try {
      const compareStr = await AsyncStorage.getItem('compare_hotels');
      if (compareStr) {
        setHotels(JSON.parse(compareStr));
      } else {
        setHotels([]);
      }
    } catch (e) {
      console.error('Failed to load compare list:', e);
    }
  };

  useEffect(() => {
    loadCompareHotels();
  }, []);

  const handleRemove = async (hotel: Hotel) => {
    try {
      const updated = hotels.filter(item => item.name !== hotel.name);
      setHotels(updated);
      await AsyncStorage.setItem('compare_hotels', JSON.stringify(updated));
      Alert.alert('Success', 'Hotel removed from comparison');
    } catch (e) {
      console.error('Failed to remove from compare list:', e);
    }
  };

  const handleClearAll = async () => {
    try {
      setHotels([]);
      await AsyncStorage.removeItem('compare_hotels');
      Alert.alert('Success', 'Comparison list cleared');
    } catch (e) {
      console.error('Failed to clear compare list:', e);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.header}>
        <View style={styles.headerTitleRow}>
          <Text style={styles.headerTitle}>Compare Stays</Text>
          {hotels.length > 0 && (
            <TouchableOpacity onPress={handleClearAll}>
              <Text style={styles.clearText}>Clear All</Text>
            </TouchableOpacity>
          )}
        </View>
        <Text style={styles.headerSubtitle}>Compare curated hotels side-by-side</Text>
      </View>

      {hotels.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="stats-chart-outline" size={48} color="#475569" />
          <Text style={styles.emptyTitle}>No Hotels to Compare</Text>
          <Text style={styles.emptySubtitle}>Go back to hotels results and click the compare icon to add properties.</Text>
        </View>
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={true} contentContainerStyle={styles.scrollContent}>
          {hotels.map((hotel, index) => (
            <View key={`${hotel.id}-${index}`} style={styles.compareColumn}>
              <View style={styles.imageContainer}>
                <Image source={{ uri: hotel.image }} style={styles.image} />
                <TouchableOpacity style={styles.removeButton} onPress={() => handleRemove(hotel)}>
                  <Ionicons name="close-circle" size={24} color="#ef4444" />
                </TouchableOpacity>
              </View>

              <View style={styles.detailsContainer}>
                <Text style={styles.hotelName}>{hotel.name}</Text>
                
                <View style={styles.statBox}>
                  <Text style={styles.statLabel}>Price</Text>
                  <Text style={styles.statValue}>{hotel.price}</Text>
                </View>

                <View style={styles.statBox}>
                  <Text style={styles.statLabel}>Rating</Text>
                  <View style={styles.ratingRow}>
                    <Ionicons name="star" size={16} color="#eab308" />
                    <Text style={styles.statValue}> {hotel.rating}</Text>
                  </View>
                </View>

                <View style={styles.statBox}>
                  <Text style={styles.statLabel}>Match Score</Text>
                  <Text style={[styles.statValue, { color: '#22d3ee' }]}>{hotel.matchScore}%</Text>
                </View>

                <View style={styles.statBox}>
                  <Text style={styles.statLabel}>Address</Text>
                  <Text style={styles.statText}>{hotel.address}</Text>
                </View>

                <View style={styles.statBox}>
                  <Text style={styles.statLabel}>Curator Insight</Text>
                  <Text style={styles.whyText}>{hotel.why}</Text>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      )}

      <BottomNav activeTab="Compare" />
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
  headerTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
  },
  clearText: {
    color: '#ef4444',
    fontSize: 14,
    fontWeight: '500',
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
  scrollContent: {
    padding: 20,
    gap: 15,
  },
  compareColumn: {
    width: 260,
    backgroundColor: '#1e293b',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#334155',
    overflow: 'hidden',
    alignSelf: 'flex-start',
  },
  imageContainer: {
    position: 'relative',
    height: 140,
    width: '100%',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  removeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(7, 16, 40, 0.7)',
    borderRadius: 12,
  },
  detailsContainer: {
    padding: 15,
    gap: 12,
  },
  hotelName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  statBox: {
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
    paddingBottom: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#94a3b8',
    textTransform: 'uppercase',
    marginBottom: 4,
    fontWeight: '600',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: 14,
    color: '#cbd5e1',
    lineHeight: 18,
  },
  whyText: {
    fontSize: 13,
    color: '#94a3b8',
    lineHeight: 18,
    fontStyle: 'italic',
  },
});
