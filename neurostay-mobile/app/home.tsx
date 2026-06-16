import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import BottomNav from '../components/BottomNav';

export default function HomePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [userName, setUserName] = useState('Traveler');

  useEffect(() => {
    const getUserData = async () => {
      try {
        const userStr = await AsyncStorage.getItem('user');
        if (userStr) {
          const user = JSON.parse(userStr);
          if (user.name) setUserName(user.name);
        }
      } catch (e) {
        console.error('HomePage getUserData error:', e);
      }
    };
    getUserData();
  }, []);

  const handleSearch = async (query: string) => {
    if (!query.trim()) return;

    try {
      // Save query to recent searches
      const recentsStr = await AsyncStorage.getItem('recent_searches');
      let recents = recentsStr ? JSON.parse(recentsStr) : [];
      
      // Remove duplicate if exists, then add to front
      recents = recents.filter((item: string) => item.toLowerCase() !== query.toLowerCase());
      recents.unshift(query);
      
      // Limit to 5 recent searches
      if (recents.length > 5) recents.pop();

      await AsyncStorage.setItem('recent_searches', JSON.stringify(recents));
    } catch (e) {
      console.error('HomePage handleSearch error:', e);
    }

    // Navigate to Results page with search query
    router.push(`/results?query=${encodeURIComponent(query)}`);
  };

  const searchExamples = [
    'Cheap hotels in Chennai',
    'Luxury hotels in Hyderabad',
    'Hotels near railway station',
    'Premium rooms in Mumbai',
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.greeting}>Hello, {userName} 👋</Text>
          <Text style={styles.welcomeTitle}>Find Your Perfect Stay</Text>
          <Text style={styles.welcomeSubtitle}>NeuroStay AI assistant finds best matching hotels using smart AI curation.</Text>
        </View>

        {/* Search Input Card */}
        <View style={styles.searchCard}>
          <View style={styles.inputContainer}>
            <Ionicons name="search" size={20} color="#64748b" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search city, budget or style..."
              placeholderTextColor="#64748b"
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={() => handleSearch(searchQuery)}
              returnKeyType="search"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={18} color="#64748b" />
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity style={styles.searchButton} onPress={() => handleSearch(searchQuery)}>
            <Text style={styles.searchButtonText}>Explore Accommodations</Text>
          </TouchableOpacity>
        </View>

        {/* Search Examples */}
        <View style={styles.examplesContainer}>
          <Text style={styles.sectionTitle}>Try Searching</Text>
          <View style={styles.examplesGrid}>
            {searchExamples.map((example, index) => (
              <TouchableOpacity
                key={index}
                style={styles.exampleBadge}
                onPress={() => handleSearch(example)}
              >
                <Ionicons name="flash-outline" size={14} color="#22d3ee" style={styles.exampleIcon} />
                <Text style={styles.exampleText}>{example}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
      </ScrollView>
      <BottomNav activeTab="Home" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#071028',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    paddingTop: Platform.OS === 'android' ? 40 : 20,
  },
  welcomeSection: {
    marginBottom: 30,
  },
  greeting: {
    fontSize: 16,
    color: '#94a3b8',
    fontWeight: '500',
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 5,
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: '#94a3b8',
    marginTop: 10,
    lineHeight: 20,
  },
  searchCard: {
    backgroundColor: '#1e293b',
    padding: 20,
    borderRadius: 20,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#071028',
    borderRadius: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: 'white',
    paddingVertical: 12,
    fontSize: 16,
  },
  searchButton: {
    backgroundColor: '#22d3ee',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 15,
  },
  searchButtonText: {
    color: '#071028',
    fontWeight: 'bold',
    fontSize: 16,
  },
  examplesContainer: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#22d3ee',
    marginBottom: 15,
  },
  examplesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  exampleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  exampleIcon: {
    marginRight: 6,
  },
  exampleText: {
    color: '#e2e8f0',
    fontSize: 14,
  },
});
