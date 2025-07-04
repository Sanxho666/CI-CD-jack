import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bluetooth, Plus, Battery, Signal, Navigation, Target } from 'lucide-react-native';
import { BallCard } from '@/components/BallCard';
import { ScanningIndicator } from '@/components/ScanningIndicator';
import { useBallTracking } from '@/hooks/useBallTracking';

export default function BallTrackingScreen() {
  const { balls, isScanning, startScanning, stopScanning, connectToBall, disconnectFromBall } = useBallTracking();
  const [selectedBall, setSelectedBall] = useState<string | null>(null);

  const handleScanToggle = () => {
    if (isScanning) {
      stopScanning();
    } else {
      startScanning();
    }
  };

  const handleBallPress = (ballId: string) => {
    setSelectedBall(ballId === selectedBall ? null : ballId);
  };

  const handleConnectBall = (ballId: string) => {
    const ball = balls.find(b => b.id === ballId);
    if (ball) {
      if (ball.connected) {
        disconnectFromBall(ballId);
      } else {
        connectToBall(ballId);
      }
    }
  };

  const handleNavigateToBall = (ballId: string) => {
    const ball = balls.find(b => b.id === ballId);
    if (ball) {
      Alert.alert(
        'Navigate to Ball',
        `Start navigation to ${ball.name}?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Navigate', onPress: () => {
            // In a real app, this would switch to the map tab and start navigation
            Alert.alert('Navigation Started', `Navigating to ${ball.name}`);
          }},
        ]
      );
    }
  };

  const connectedBalls = balls.filter(ball => ball.connected);
  const availableBalls = balls.filter(ball => !ball.connected);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Ball Tracker</Text>
        <TouchableOpacity
          style={[styles.scanButton, isScanning && styles.scanButtonActive]}
          onPress={handleScanToggle}
        >
          <Bluetooth size={20} color={isScanning ? '#FFFFFF' : '#10B981'} />
          <Text style={[styles.scanButtonText, isScanning && styles.scanButtonTextActive]}>
            {isScanning ? 'Stop Scan' : 'Scan'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {isScanning && (
          <View style={styles.scanningSection}>
            <ScanningIndicator />
            <Text style={styles.scanningText}>Scanning for golf balls...</Text>
          </View>
        )}

        {connectedBalls.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Connected Balls</Text>
            {connectedBalls.map((ball) => (
              <BallCard
                key={ball.id}
                ball={ball}
                isSelected={selectedBall === ball.id}
                onPress={() => handleBallPress(ball.id)}
                onConnect={() => handleConnectBall(ball.id)}
                onNavigate={() => handleNavigateToBall(ball.id)}
              />
            ))}
          </View>
        )}

        {availableBalls.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Available Balls</Text>
            {availableBalls.map((ball) => (
              <BallCard
                key={ball.id}
                ball={ball}
                isSelected={selectedBall === ball.id}
                onPress={() => handleBallPress(ball.id)}
                onConnect={() => handleConnectBall(ball.id)}
                onNavigate={() => handleNavigateToBall(ball.id)}
              />
            ))}
          </View>
        )}

        {balls.length === 0 && !isScanning && (
          <View style={styles.emptyState}>
            <Target size={64} color="#CBD5E1" />
            <Text style={styles.emptyTitle}>No Golf Balls Found</Text>
            <Text style={styles.emptyText}>
              Tap the scan button to search for JackTrack-enabled golf balls nearby.
            </Text>
          </View>
        )}

        <TouchableOpacity style={styles.addButton}>
          <Plus size={24} color="#10B981" />
          <Text style={styles.addButtonText}>Add New Ball</Text>
        </TouchableOpacity>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#1E293B',
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#10B981',
    gap: 8,
  },
  scanButtonActive: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  scanButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#10B981',
  },
  scanButtonTextActive: {
    color: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scanningSection: {
    alignItems: 'center',
    paddingVertical: 24,
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  scanningText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
    marginTop: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1E293B',
    marginBottom: 12,
    marginHorizontal: 20,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
    marginHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#64748B',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 24,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 20,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#10B981',
    borderStyle: 'dashed',
    gap: 8,
  },
  addButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#10B981',
  },
});