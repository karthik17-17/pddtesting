import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Platform,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BottomNav from '../components/BottomNav';

export default function MapPage() {
  const params = useLocalSearchParams<{ url?: string; name?: string; address?: string }>();
  const [mapQuery, setMapQuery] = useState('Hotels in Chennai');
  const [hotelName, setHotelName] = useState('Interactive Map');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initMapUrl = async () => {
      if (params.name) {
        // If we came from a specific hotel, use its name and address for the pin
        const query = `${params.name} ${params.address || ''}`;
        setMapQuery(query);
        setHotelName(params.name);
      } else {
        // Fallback: try to see if there is a recent search
        try {
          const searchesStr = await AsyncStorage.getItem('recent_searches');
          if (searchesStr) {
            const searches: string[] = JSON.parse(searchesStr);
            if (searches.length > 0) {
              setMapQuery(searches[0]);
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
  }, [params.name, params.address]);

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
});
