import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import BottomNav from '../components/BottomNav';

export default function ProfilePage() {
  const router = useRouter();
  const [name, setName] = useState('Traveler');
  const [email, setEmail] = useState('traveler@example.com');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const loadUserData = async () => {
    try {
      const userStr = await AsyncStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        if (user.name) setName(user.name);
        if (user.email) setEmail(user.email);
      }

      const searchesStr = await AsyncStorage.getItem('recent_searches');
      if (searchesStr) {
        setRecentSearches(JSON.parse(searchesStr));
      }
    } catch (e) {
      console.error('Failed to load profile user data:', e);
    }
  };

  useEffect(() => {
    loadUserData();
  }, []);

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to log out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('token');
              await AsyncStorage.removeItem('user');
              router.replace('/login');
            } catch (e) {
              console.error('Logout failed:', e);
            }
          },
        },
      ]
    );
  };

  const handleClearSearches = async () => {
    try {
      setRecentSearches([]);
      await AsyncStorage.removeItem('recent_searches');
      Alert.alert('Success', 'Search history cleared');
    } catch (e) {
      console.error('Failed to clear search history:', e);
    }
  };

  const handleSearchPress = (query: string) => {
    router.push(`/results?query=${encodeURIComponent(query)}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>User Profile</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* User Card */}
        <View style={styles.userCard}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person" size={40} color="#22d3ee" />
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{name}</Text>
            <Text style={styles.userEmail}>{email}</Text>
          </View>
        </View>

        {/* Recent Searches */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Recent Searches</Text>
            {recentSearches.length > 0 && (
              <TouchableOpacity onPress={handleClearSearches}>
                <Text style={styles.clearText}>Clear</Text>
              </TouchableOpacity>
            )}
          </View>

          {recentSearches.length === 0 ? (
            <View style={styles.emptySearchBox}>
              <Ionicons name="search-outline" size={24} color="#475569" />
              <Text style={styles.emptySearchText}>Your search history is empty</Text>
            </View>
          ) : (
            <View style={styles.searchList}>
              {recentSearches.map((search, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.searchItem}
                  onPress={() => handleSearchPress(search)}
                >
                  <View style={styles.searchItemLeft}>
                    <Ionicons name="time-outline" size={18} color="#64748b" style={styles.timeIcon} />
                    <Text style={styles.searchText}>{search}</Text>
                  </View>
                  <Ionicons name="arrow-forward" size={16} color="#64748b" />
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Actions */}
        <View style={styles.logoutSection}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={20} color="#ef4444" style={styles.logoutIcon} />
            <Text style={styles.logoutButtonText}>Log Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <BottomNav activeTab="Profile" />
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
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
  },
  scrollContent: {
    padding: 20,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 25,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#071028',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  userInfo: {
    marginLeft: 15,
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  userEmail: {
    fontSize: 14,
    color: '#94a3b8',
    marginTop: 2,
  },
  section: {
    marginBottom: 25,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#22d3ee',
  },
  clearText: {
    color: '#ef4444',
    fontSize: 14,
    fontWeight: '500',
  },
  emptySearchBox: {
    backgroundColor: '#1e293b',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#334155',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  emptySearchText: {
    color: '#64748b',
    fontSize: 14,
  },
  searchList: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#334155',
    overflow: 'hidden',
  },
  searchItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  searchItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  timeIcon: {
    marginRight: 10,
  },
  searchText: {
    color: '#e2e8f0',
    fontSize: 15,
  },
  logoutSection: {
    marginTop: 10,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)',
    padding: 15,
    borderRadius: 12,
  },
  logoutIcon: {
    marginRight: 8,
  },
  logoutButtonText: {
    color: '#ef4444',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
