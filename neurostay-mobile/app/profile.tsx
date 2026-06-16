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
  Platform,
  Modal,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import BottomNav from '../components/BottomNav';

const API_URL = "https://neurostay-ai.onrender.com";

export default function ProfilePage() {
  const router = useRouter();
  const [name, setName] = useState('Traveler');
  const [email, setEmail] = useState('traveler@example.com');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [totalBookings, setTotalBookings] = useState(0);
  const [savedHotels, setSavedHotels] = useState(0);

  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [editName, setEditName] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const loadUserData = async () => {
    try {
      const userStr = await AsyncStorage.getItem('user');
      const token = await AsyncStorage.getItem('token');
      if (userStr) {
        const user = JSON.parse(userStr);
        if (user.name) {
          setName(user.name);
          setEditName(user.name);
        }
        if (user.email) setEmail(user.email);
      }

      if (token) {
        try {
          const res = await axios.get(`${API_URL}/api/saved`, {
            headers: { Authorization: `Bearer ${token}`, 'Bypass-Tunnel-Reminder': 'true' }
          });
          if (res.data.success && res.data.hotels) {
            setSavedHotels(res.data.hotels.length);
          }
        } catch (e) {
          console.error('Failed to load stats:', e);
        }
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

  const handleEditProfile = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      const res = await axios.put(`${API_URL}/api/auth/profile`, 
        { email, name: editName },
        { headers: { Authorization: `Bearer ${token}`, 'Bypass-Tunnel-Reminder': 'true' } }
      );
      if (res.data.success) {
        setName(editName);
        const userStr = await AsyncStorage.getItem('user');
        if (userStr) {
          const user = JSON.parse(userStr);
          user.name = editName;
          await AsyncStorage.setItem('user', JSON.stringify(user));
        }
        Alert.alert('Success', 'Profile updated successfully');
        setShowEditProfile(false);
      }
    } catch (e: any) {
      Alert.alert('Error', e.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      const res = await axios.put(`${API_URL}/api/auth/password`, 
        { email, currentPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}`, 'Bypass-Tunnel-Reminder': 'true' } }
      );
      if (res.data.success) {
        Alert.alert('Success', 'Password updated successfully');
        setShowChangePassword(false);
        setCurrentPassword('');
        setNewPassword('');
      }
    } catch (e: any) {
      Alert.alert('Error', e.response?.data?.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile Dashboard</Text>
        <Text style={styles.headerSubtitle}>Manage your account and view your activity</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* User Card */}
        <View style={styles.userCard}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>{name ? name[0].toUpperCase() : 'M'}</Text>
          </View>
          <Text style={styles.userName}>{name}</Text>
          <Text style={styles.userEmail}>{email}</Text>
          
          <TouchableOpacity style={styles.blueButton} onPress={() => setShowEditProfile(true)}>
            <Ionicons name="pencil" size={16} color="white" style={styles.btnIcon} />
            <Text style={styles.buttonText}>Edit Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.purpleButton} onPress={() => setShowChangePassword(true)}>
            <Ionicons name="lock-closed" size={16} color="white" style={styles.btnIcon} />
            <Text style={styles.buttonText}>Change Password</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.redButton} onPress={handleLogout}>
            <Ionicons name="log-out" size={16} color="white" style={styles.btnIcon} />
            <Text style={styles.buttonText}>Logout</Text>
          </TouchableOpacity>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Ionicons name="receipt-outline" size={24} color="#e2e8f0" style={styles.statIcon} />
            <View style={styles.statBottom}>
              <Text style={styles.statLabel}>Total Bookings</Text>
              <Text style={styles.statValue}>{totalBookings}</Text>
            </View>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="heart" size={24} color="#f43f5e" style={styles.statIcon} />
            <View style={styles.statBottom}>
              <Text style={styles.statLabel}>Saved Hotels</Text>
              <Text style={styles.statValue}>{savedHotels}</Text>
            </View>
          </View>
        </View>

        {/* Account Status Card */}
        <View style={styles.statusCard}>
          <Ionicons name="checkbox" size={24} color="#4ade80" style={styles.statIcon} />
          <View style={styles.statBottom}>
            <Text style={styles.statusLabel}>Account Status</Text>
            <Text style={styles.statusValue}>Active</Text>
            <View style={styles.verifiedBadge}>
              <Text style={styles.verifiedText}>Verified</Text>
            </View>
          </View>
        </View>

        {/* Recent Searches */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionTitleRow}>
              <Ionicons name="search" size={20} color="#22d3ee" style={{ marginRight: 8 }} />
              <Text style={styles.sectionTitle}>Recent Searches</Text>
            </View>
            {recentSearches.length > 0 && (
              <TouchableOpacity onPress={handleClearSearches}>
                <Text style={styles.clearText}>Clear All</Text>
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
                    <Ionicons name="time-outline" size={18} color="#94a3b8" style={styles.timeIcon} />
                    <Text style={styles.searchText}>{search}</Text>
                  </View>
                  <Text style={styles.searchAgainText}>Search again →</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal visible={showEditProfile} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Profile</Text>
            <Text style={styles.inputLabel}>Name</Text>
            <TextInput
              style={styles.input}
              value={editName}
              onChangeText={setEditName}
              placeholder="Your Name"
              placeholderTextColor="#94a3b8"
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={() => setShowEditProfile(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, styles.saveButton]} onPress={handleEditProfile} disabled={loading}>
                {loading ? <ActivityIndicator color="white" /> : <Text style={styles.buttonText}>Save</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Change Password Modal */}
      <Modal visible={showChangePassword} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Change Password</Text>
            <Text style={styles.inputLabel}>Current Password</Text>
            <TextInput
              style={styles.input}
              value={currentPassword}
              onChangeText={setCurrentPassword}
              placeholder="Current Password"
              placeholderTextColor="#94a3b8"
              secureTextEntry
            />
            <Text style={styles.inputLabel}>New Password</Text>
            <TextInput
              style={styles.input}
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder="New Password"
              placeholderTextColor="#94a3b8"
              secureTextEntry
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={() => setShowChangePassword(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, styles.saveButton]} onPress={handleChangePassword} disabled={loading}>
                {loading ? <ActivityIndicator color="white" /> : <Text style={styles.buttonText}>Save</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <BottomNav activeTab="Profile" />
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
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 4,
  },
  scrollContent: {
    padding: 20,
  },
  userCard: {
    backgroundColor: '#1e293b',
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 15,
    alignItems: 'center',
  },
  avatarContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#6366f1',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  userEmail: {
    fontSize: 14,
    color: '#94a3b8',
    marginTop: 4,
    marginBottom: 20,
  },
  blueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3b82f6',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    width: '100%',
    justifyContent: 'center',
    marginBottom: 10,
  },
  purpleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#a855f7',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    width: '100%',
    justifyContent: 'center',
    marginBottom: 10,
  },
  redButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#b91c1c',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    width: '100%',
    justifyContent: 'center',
  },
  btnIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    gap: 15,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#334155',
    justifyContent: 'space-between',
    minHeight: 120,
  },
  statIcon: {
    marginBottom: 10,
  },
  statBottom: {
    marginTop: 'auto',
  },
  statLabel: {
    fontSize: 12,
    color: '#94a3b8',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#22d3ee',
  },
  statusCard: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 25,
    minHeight: 120,
    justifyContent: 'space-between',
  },
  statusLabel: {
    fontSize: 12,
    color: '#94a3b8',
    marginBottom: 4,
  },
  statusValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4ade80',
    marginBottom: 8,
  },
  verifiedBadge: {
    backgroundColor: 'rgba(74, 222, 128, 0.1)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(74, 222, 128, 0.2)',
  },
  verifiedText: {
    color: '#4ade80',
    fontSize: 10,
    fontWeight: 'bold',
  },
  section: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 30,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  clearText: {
    color: '#ef4444',
    fontSize: 12,
  },
  searchList: {
    gap: 1,
    backgroundColor: '#334155',
    borderRadius: 8,
    overflow: 'hidden',
  },
  searchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#1e293b',
  },
  searchItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  timeIcon: {
    marginRight: 12,
  },
  searchText: {
    fontSize: 14,
    color: '#e2e8f0',
    flex: 1,
  },
  searchAgainText: {
    fontSize: 12,
    color: '#475569',
  },
  emptySearchBox: {
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptySearchText: {
    color: '#94a3b8',
    fontSize: 14,
    marginTop: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: '#334155',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 8,
    color: 'white',
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 10,
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: 'transparent',
  },
  saveButton: {
    backgroundColor: '#3b82f6',
  },
  cancelButtonText: {
    color: '#94a3b8',
    fontWeight: 'bold',
  },
});
