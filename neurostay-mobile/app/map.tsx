import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  TouchableOpacity,
  Linking,
} from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BottomNav from '../components/BottomNav';

export default function MapPage() {
  const params = useLocalSearchParams<{ url?: string; name?: string }>();
  const [mapUrl, setMapUrl] = useState('https://www.google.com/maps/search/hotels');
  const [hotelName, setHotelName] = useState('Hotels Map');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initMapUrl = async () => {
      if (params.url) {
        setMapUrl(params.url);
        if (params.name) setHotelName(params.name);
      } else {
        // Fallback: try to see if there is a recent search city to show maps for
        try {
          const searchesStr = await AsyncStorage.getItem('recent_searches');
          if (searchesStr) {
            const searches: string[] = JSON.parse(searchesStr);
            if (searches.length > 0) {
              const lastSearch = searches[0];
              setMapUrl(`https://www.google.com/maps/search/${encodeURIComponent(lastSearch)}`);
              setHotelName(`Maps: ${lastSearch}`);
            }
          }
        } catch (e) {
          console.error('MapPage initMapUrl fallback error:', e);
        }
      }
      setLoading(false);
    };

    initMapUrl();
  }, [params.url, params.name]);

  const handleOpenMap = async () => {
    try {
      await WebBrowser.openBrowserAsync(mapUrl);
    } catch (error) {
      console.error('Failed to open web browser, trying Linking:', error);
      Linking.openURL(mapUrl).catch((err) => alert('Could not open map: ' + err));
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle} numberOfLines={1}>{hotelName}</Text>
        <Text style={styles.headerSubtitle} numberOfLines={1}>Google Maps Integration</Text>
      </View>

      {/* Map Content */}
      <View style={styles.content}>
        <View style={styles.mapCard}>
          <Ionicons name="map-outline" size={80} color="#22d3ee" style={styles.mapIcon} />
          
          <Text style={styles.stayTitle}>{hotelName}</Text>
          <Text style={styles.stayDescription}>
            For the best interactive experience with street view and directions, please open the location in your device's browser or Google Maps app.
          </Text>

          <TouchableOpacity style={styles.button} onPress={handleOpenMap}>
            <Ionicons name="navigate" size={20} color="#071028" style={styles.buttonIcon} />
            <Text style={styles.buttonText}>Open Map View</Text>
          </TouchableOpacity>
        </View>
      </View>

      <BottomNav activeTab="Map" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#071028',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  mapCard: {
    backgroundColor: '#0f172a',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1e293b',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
    width: '100%',
  },
  mapIcon: {
    marginBottom: 20,
  },
  stayTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 10,
  },
  stayDescription: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 30,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#22d3ee',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    width: '100%',
    justifyContent: 'center',
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: '#071028',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
