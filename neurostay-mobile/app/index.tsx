import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

export default function IndexPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const userStr = await AsyncStorage.getItem('user');

        // Validate both token and user exist and user has required fields
        if (token && userStr) {
          try {
            const user = JSON.parse(userStr);
            if (user && user.name && user.email) {
              router.replace('/home');
              return;
            }
          } catch (e) {
            // Invalid user JSON - clear and redirect to login
            await AsyncStorage.removeItem('token');
            await AsyncStorage.removeItem('user');
          }
        }

        // No valid auth - go to login
        router.replace('/login');
      } catch (error) {
        console.error('IndexPage checkAuth error:', error);
        router.replace('/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#22d3ee" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#071028',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
