import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Platform,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import BottomNav from '../components/BottomNav';

export default function MapPage() {
  const params = useLocalSearchParams<{ url?: string; name?: string; address?: string; lat?: string; lng?: string }>();
  const [mapQuery, setMapQuery] = useState('Hotels in Chennai');
  const [hotelName, setHotelName] = useState('Interactive Map');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initMapUrl = async () => {
      setLoading(true);
      if (params.name) {
        setHotelName(params.name);

        // 1. Prefer lat/lng from parameters
        const latVal = params.lat;
        const lngVal = params.lng;
        
        if (latVal && lngVal && latVal !== "null" && lngVal !== "null" && latVal !== "" && lngVal !== "") {
          const latNum = parseFloat(latVal);
          const lngNum = parseFloat(lngVal);
          if (!isNaN(latNum) && !isNaN(lngNum)) {
            setMapQuery(`${latNum},${lngNum}`);
            setLoading(false);
            return;
          }
        }

        // 2. Geocode using Nominatim if coordinates are missing
        const cleanAddress = (params.address || "").replace("Address not available", "").trim();
        const query1 = `${params.name}, ${cleanAddress}, India`.replace(/,+/g, ',').replace(/\s+/g, ' ').trim();

        try {
          const res1 = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query1)}&limit=1`);
          const data1 = await res1.json();
          if (data1 && data1.length > 0) {
            setMapQuery(`${parseFloat(data1[0].lat)},${parseFloat(data1[0].lon)}`);
            setLoading(false);
            return;
          }
        } catch (err) {
          console.error("Mobile geocoding query1 error:", err);
        }

        // Fallback 1: address + ", India"
        if (cleanAddress) {
          const query2 = `${cleanAddress}, India`.replace(/,+/g, ',').replace(/\s+/g, ' ').trim();
          try {
            const res2 = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query2)}&limit=1`);
            const data2 = await res2.json();
            if (data2 && data2.length > 0) {
              setMapQuery(`${parseFloat(data2[0].lat)},${parseFloat(data2[0].lon)}`);
              setLoading(false);
              return;
            }
          } catch (err) {
            console.error("Mobile geocoding query2 error:", err);
          }
        }

        // Fallback 2: Default to Mumbai coords
        setMapQuery("19.0760,72.8777");
      } else {
        // Fallback: try to see if there is a recent search
        try {
          const searchesStr = await AsyncStorage.getItem('recent_searches');
          if (searchesStr) {
            const searches: string[] = JSON.parse(searchesStr);
            if (searches.length > 0) {
              setMapQuery(`Hotels in ${searches[0]}`);
              setHotelName(`Maps: ${searches[0]}`);
            }
          }
        } catch (e) {
          console.error('MapPage initMapUrl fallback error:', e);
        }
      }
      setLoading(false);
    };

    initMapUrl();
  }, [params.name, params.address, params.lat, params.lng]);

  const handleDirections = () => {
    if (!params.name) return;
    const cleanAddress = (params.address || "").replace("Address not available", "").trim();
    const query = `${params.name} ${cleanAddress}`;
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
    Linking.openURL(url).catch(err => console.error("Failed to open URL:", err));
  };

  // Use the exact keyless embed format we use on the web app!
  const embedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(mapQuery)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <style>
          body, html { margin: 0; padding: 0; height: 100%; width: 100%; overflow: hidden; background-color: #0f172a; }
          iframe { width: 100%; height: 100%; border: none; }
        </style>
      </head>
      <body>
        <iframe src="${embedUrl}" allowfullscreen></iframe>
      </body>
    </html>
  `;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle} numberOfLines={1}>{hotelName}</Text>
        <Text style={styles.headerSubtitle} numberOfLines={1}>Google Maps Integration</Text>
      </View>

      {/* Embedded Map */}
      <View style={styles.content}>
        {!loading && (
          <WebView 
            source={{ html: htmlContent }} 
            style={styles.webview}
            scalesPageToFit={false}
          />
        )}
      </View>

      {/* Directions button */}
      {params.name && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.directionsButton} onPress={handleDirections}>
            <Ionicons name="navigate" size={20} color="#071028" style={styles.buttonIcon} />
            <Text style={styles.directionsButtonText}>Get Directions</Text>
          </TouchableOpacity>
        </View>
      )}

      <BottomNav activeTab="Map" />
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
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#22d3ee',
    marginTop: 2,
  },
  content: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  webview: {
    flex: 1,
  },
  buttonContainer: {
    padding: 16,
    backgroundColor: '#071028',
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
  },
  directionsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#22d3ee',
    paddingVertical: 14,
    borderRadius: 12,
  },
  buttonIcon: {
    marginRight: 8,
  },
  directionsButtonText: {
    color: '#071028',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
