import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  User, 
  Bell, 
  Shield, 
  Smartphone, 
  HelpCircle, 
  Star, 
  ChevronRight,
  Info,
  Database,
  Bluetooth
} from 'lucide-react-native';
import { SettingsSection } from '@/components/SettingsSection';
import { SettingsItem } from '@/components/SettingsItem';

export default function SettingsScreen() {
  const [notifications, setNotifications] = useState(true);
  const [locationTracking, setLocationTracking] = useState(true);
  const [bleAlwaysOn, setBleAlwaysOn] = useState(true);
  const [hapticFeedback, setHapticFeedback] = useState(true);

  const handleClearData = () => {
    Alert.alert(
      'Clear All Data',
      'This will permanently delete all game history and settings. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear Data', style: 'destructive', onPress: () => {
          Alert.alert('Data Cleared', 'All data has been successfully cleared.');
        }},
      ]
    );
  };

  const handleExportData = () => {
    Alert.alert(
      'Export Data',
      'Your game data will be exported as a CSV file.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Export', onPress: () => {
          Alert.alert('Export Complete', 'Data exported successfully!');
        }},
      ]
    );
  };

  const handleRateApp = () => {
    Alert.alert(
      'Rate JackTrack',
      'Enjoying JackTrack? Please rate us on the App Store!',
      [
        { text: 'Later', style: 'cancel' },
        { text: 'Rate Now', onPress: () => {
          // In a real app, this would open the App Store
          Alert.alert('Thank you!', 'Rating functionality would open the App Store.');
        }},
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <SettingsSection title="Account">
          <SettingsItem
            icon={<User size={20} color="#64748B" />}
            title="Profile"
            subtitle="Manage your profile information"
            onPress={() => Alert.alert('Profile', 'Profile settings would open here.')}
            showArrow
          />
        </SettingsSection>

        <SettingsSection title="Tracking">
          <SettingsItem
            icon={<Bell size={20} color="#64748B" />}
            title="Notifications"
            subtitle="Ball tracking and game alerts"
            rightElement={
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{ false: '#E2E8F0', true: '#10B981' }}
                thumbColor={notifications ? '#FFFFFF' : '#CBD5E1'}
              />
            }
          />
          <SettingsItem
            icon={<Smartphone size={20} color="#64748B" />}
            title="Location Tracking"
            subtitle="GPS tracking for distance measurements"
            rightElement={
              <Switch
                value={locationTracking}
                onValueChange={setLocationTracking}
                trackColor={{ false: '#E2E8F0', true: '#10B981' }}
                thumbColor={locationTracking ? '#FFFFFF' : '#CBD5E1'}
              />
            }
          />
          <SettingsItem
            icon={<Bluetooth size={20} color="#64748B" />}
            title="Bluetooth Always On"
            subtitle="Keep BLE connection active"
            rightElement={
              <Switch
                value={bleAlwaysOn}
                onValueChange={setBleAlwaysOn}
                trackColor={{ false: '#E2E8F0', true: '#10B981' }}
                thumbColor={bleAlwaysOn ? '#FFFFFF' : '#CBD5E1'}
              />
            }
          />
        </SettingsSection>

        <SettingsSection title="Device">
          <SettingsItem
            icon={<Shield size={20} color="#64748B" />}
            title="Privacy"
            subtitle="Data privacy and permissions"
            onPress={() => Alert.alert('Privacy', 'Privacy settings would open here.')}
            showArrow
          />
          <SettingsItem
            icon={<Smartphone size={20} color="#64748B" />}
            title="Haptic Feedback"
            subtitle="Vibration feedback for interactions"
            rightElement={
              <Switch
                value={hapticFeedback}
                onValueChange={setHapticFeedback}
                trackColor={{ false: '#E2E8F0', true: '#10B981' }}
                thumbColor={hapticFeedback ? '#FFFFFF' : '#CBD5E1'}
              />
            }
          />
        </SettingsSection>

        <SettingsSection title="Data">
          <SettingsItem
            icon={<Database size={20} color="#64748B" />}
            title="Export Game Data"
            subtitle="Export your game history"
            onPress={handleExportData}
            showArrow
          />
          <SettingsItem
            icon={<Database size={20} color="#EF4444" />}
            title="Clear All Data"
            subtitle="Permanently delete all data"
            onPress={handleClearData}
            showArrow
          />
        </SettingsSection>

        <SettingsSection title="Support">
          <SettingsItem
            icon={<HelpCircle size={20} color="#64748B" />}
            title="Help & Support"
            subtitle="FAQ and contact support"
            onPress={() => Alert.alert('Support', 'Help documentation would open here.')}
            showArrow
          />
          <SettingsItem
            icon={<Star size={20} color="#64748B" />}
            title="Rate JackTrack"
            subtitle="Rate us on the App Store"
            onPress={handleRateApp}
            showArrow
          />
          <SettingsItem
            icon={<Info size={20} color="#64748B" />}
            title="About"
            subtitle="Version 1.0.0"
            onPress={() => Alert.alert('About', 'JackTrack Golf Ball Tracker\nVersion 1.0.0\n\nNever lose a golf ball again!')}
            showArrow
          />
        </SettingsSection>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#1E293B',
  },
  scrollView: {
    flex: 1,
  },
});