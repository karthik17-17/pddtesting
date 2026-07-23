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
import apiClient from '../services/api';
import BottomNav from '../components/BottomNav';
import { API_URL } from '../constants/Config';

export default function ProfilePage() {
  const router = useRouter();
  const [name, setName] = useState('Traveler');
  const [email, setEmail] = useState('traveler@example.com');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
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
          console.log(`[ProfilePage] Loading stats from ${API_URL}/api/saved`);
          const res = await apiClient.get('/api/saved');
          if (res.data.success && res.data.hotels) {
            setSavedHotels(res.data.hotels.length);
          }
        } catch (e) {
          console.error('[ProfilePage] Failed to load saved hotel count:', e);
        }
      }

      const searchesStr = await AsyncStorage.getItem('recent_searches');
      if (searchesStr) {
        setRecentSearches(JSON.parse(searchesStr));
      }
    } catch (e) {
      console.error('[ProfilePage] Failed to load user profile data:', e);
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
              console.error('[ProfilePage] Logout failed:', e);
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
      console.error('[ProfilePage] Failed to clear search history:', e);
    }
  };

  const handleSearchPress = (query: string) => {
    router.push(`/results?query=${encodeURIComponent(query)}`);
  };

  const handleEditProfile = async () => {
    try {
      setLoading(true);
      console.log(`[ProfilePage] Updating profile to ${API_URL}/api/auth/profile`);
      const res = await apiClient.put('/api/auth/profile', { email, name: editName });
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
      console.log(`[ProfilePage] Updating password to ${API_URL}/api/auth/password`);
      const res = await apiClient.put('/api/auth/password', { email, currentPassword, newPassword });
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

          <View style={styles.badgeRow}>
            <View style={styles.verifiedBadge}>
              <Ionicons name="checkmark-circle" size={14} color="#22d3ee" />
              <Text style={styles.verifiedText}>Verified Account</Text>
            </View>
          </View>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <TouchableOpacity style={styles.statBox} onPress={() => router.push('/saved')}>
            <Ionicons name="bookmark" size={24} color="#22d3ee" />
            <Text style={styles.statNumber}>{savedHotels}</Text>
            <Text style={styles.statLabel}>Saved Hotels</Text>
          </TouchableOpacity>

          <View style={styles.statBox}>
            <Ionicons name="search" size={24} color="#a855f7" />
            <Text style={styles.statNumber}>{recentSearches.length}</Text>
            <Text style={styles.statLabel}>Recent Searches</Text>
          </View>
        </View>

        {/* Account Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Settings</Text>

          <TouchableOpacity style={styles.menuItem} onPress={() => setShowEditProfile(true)}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="person-outline" size={20} color="#94a3b8" />
              <Text style={styles.menuItemText}>Edit Profile</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#64748b" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => setShowChangePassword(true)}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="lock-closed-outline" size={20} color="#94a3b8" />
              <Text style={styles.menuItemText}>Change Password</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#64748b" />
          </TouchableOpacity>
        </View>

        {/* Recent Search History */}
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
            <Text style={styles.emptyText}>No recent searches found.</Text>
          ) : (
            recentSearches.map((item, idx) => (
              <TouchableOpacity key={idx} style={styles.historyItem} onPress={() => handleSearchPress(item)}>
                <Ionicons name="time-outline" size={18} color="#22d3ee" />
                <Text style={styles.historyText}>{item}</Text>
              </TouchableOpacity>
            ))
          )}
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#ef4444" />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal visible={showEditProfile} transparent animationType="slide" onRequestClose={() => setShowEditProfile(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Edit Profile</Text>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              value={editName}
              onChangeText={setEditName}
              placeholder="Enter full name"
              placeholderTextColor="#475569"
            />
            <TouchableOpacity style={styles.modalButton} onPress={handleEditProfile} disabled={loading}>
              {loading ? <ActivityIndicator color="#071028" /> : <Text style={styles.modalButtonText}>Save Changes</Text>}
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={() => setShowEditProfile(false)}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Change Password Modal */}
      <Modal visible={showChangePassword} transparent animationType="slide" onRequestClose={() => setShowChangePassword(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Change Password</Text>
            <Text style={styles.label}>Current Password</Text>
            <TextInput
              style={styles.input}
              secureTextEntry
              value={currentPassword}
              onChangeText={setCurrentPassword}
              placeholder="••••••••"
              placeholderTextColor="#475569"
            />
            <Text style={styles.label}>New Password</Text>
            <TextInput
              style={styles.input}
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder="••••••••"
              placeholderTextColor="#475569"
            />
            <TouchableOpacity style={styles.modalButton} onPress={handleChangePassword} disabled={loading}>
              {loading ? <ActivityIndicator color="#071028" /> : <Text style={styles.modalButtonText}>Update Password</Text>}
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={() => setShowChangePassword(false)}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
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
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#94a3b8',
    marginTop: 4,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 80,
  },
  userCard: {
    backgroundColor: '#1e293b',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 20,
  },
  avatarContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#22d3ee',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#071028',
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
  },
  badgeRow: {
    flexDirection: 'row',
    marginTop: 12,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(34,211,238,0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  verifiedText: {
    color: '#22d3ee',
    fontSize: 12,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 25,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 6,
  },
  statLabel: {
    fontSize: 12,
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
    fontSize: 16,
    fontWeight: 'bold',
    color: '#22d3ee',
    marginBottom: 12,
  },
  clearText: {
    color: '#ef4444',
    fontSize: 13,
    fontWeight: '600',
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 10,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuItemText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '500',
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 8,
    gap: 10,
  },
  historyText: {
    color: '#e2e8f0',
    fontSize: 14,
  },
  emptyText: {
    color: '#64748b',
    fontSize: 14,
    fontStyle: 'italic',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(239,68,68,0.1)',
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.3)',
    gap: 8,
    marginTop: 10,
  },
  logoutText: {
    color: '#ef4444',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(7,16,40,0.85)',
    justifyContent: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: '#1e293b',
    padding: 24,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#22d3ee',
    textAlign: 'center',
    marginBottom: 20,
  },
  label: {
    color: '#94a3b8',
    fontSize: 13,
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#071028',
    color: 'white',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 16,
    fontSize: 15,
  },
  modalButton: {
    backgroundColor: '#22d3ee',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  modalButtonText: {
    color: '#071028',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cancelButton: {
    alignItems: 'center',
    padding: 12,
    marginTop: 8,
  },
  cancelText: {
    color: '#64748b',
    fontSize: 14,
  },
});
