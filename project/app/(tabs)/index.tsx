import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, Platform, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Location from 'expo-location';
import { Navigation, MapPin, Target, Ruler } from 'lucide-react-native';
import { CourseHeader } from '@/components/CourseHeader';
import { BallMarker } from '@/components/BallMarker';
import { DistanceCard } from '@/components/DistanceCard';
import { NavigationCard } from '@/components/NavigationCard';
import { PlatformMapView, PlatformMarker, PlatformPolyline } from '@/components/PlatformMapView';
import { useLocationTracking } from '@/hooks/useLocationTracking';
import { useBallTracking } from '@/hooks/useBallTracking';

const { width, height } = Dimensions.get('window');

export default function CourseMapScreen() {
  const [selectedBall, setSelectedBall] = useState<string | null>(null);
  const [isNavigating, setIsNavigating] = useState(false);
  
  const { userLocation, locationError } = useLocationTracking();
  const { balls, isScanning } = useBallTracking();

  // Sample course data - in production, this would come from a golf course API
  const courseData = {
    name: 'Pebble Beach Golf Links',
    hole: 7,
    par: 4,
    yardage: 392,
    holeLocation: {
      latitude: 36.5674,
      longitude: -121.9500,
    },
    teeLocation: {
      latitude: 36.5650,
      longitude: -121.9480,
    },
  };

  const region = {
    latitude: userLocation?.latitude || courseData.teeLocation.latitude,
    longitude: userLocation?.longitude || courseData.teeLocation.longitude,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    return Math.round(distance * 1000); // Convert to meters
  };

  const selectedBallData = selectedBall ? balls.find(ball => ball.id === selectedBall) : null;
  const distanceToSelectedBall = selectedBallData && userLocation 
    ? calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        selectedBallData.latitude,
        selectedBallData.longitude
      )
    : null;

  const distanceToHole = userLocation 
    ? calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        courseData.holeLocation.latitude,
        courseData.holeLocation.longitude
      )
    : null;

  const handleBallPress = (ballId: string) => {
    setSelectedBall(ballId === selectedBall ? null : ballId);
  };

  const handleNavigate = () => {
    if (selectedBallData) {
      setIsNavigating(true);
      Alert.alert(
        'Navigation Started',
        `Navigating to ${selectedBallData.name}`,
        [
          { text: 'Stop Navigation', onPress: () => setIsNavigating(false) },
          { text: 'Continue', style: 'default' },
        ]
      );
    }
  };

  if (locationError) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Location access required</Text>
          <Text style={styles.errorSubtext}>
            Please enable location services to track your position on the course.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <CourseHeader
        courseName={courseData.name}
        hole={courseData.hole}
        par={courseData.par}
        yardage={courseData.yardage}
        isScanning={isScanning}
      />
      
      <View style={styles.mapContainer}>
        <PlatformMapView
          style={styles.map}
          region={region}
          mapType="satellite"
          showsUserLocation={true}
          showsCompass={true}
          showsScale={true}
          followsUserLocation={false}
        >
          {/* Hole marker */}
          <PlatformMarker
            coordinate={courseData.holeLocation}
            title="Hole 7"
            description="Par 4 - 392 yards"
            pinColor="#F59E0B"
          />

          {/* Tee marker */}
          <PlatformMarker
            coordinate={courseData.teeLocation}
            title="Tee"
            description="Hole 7 Tee"
            pinColor="#10B981"
          />

          {/* Ball markers */}
          {balls.map((ball) => (
            <PlatformMarker
              key={ball.id}
              coordinate={{ latitude: ball.latitude, longitude: ball.longitude }}
              onPress={() => handleBallPress(ball.id)}
            >
              <BallMarker
                ballName={ball.name}
                isSelected={selectedBall === ball.id}
                batteryLevel={ball.batteryLevel}
                signalStrength={ball.signalStrength}
              />
            </PlatformMarker>
          ))}

          {/* Navigation line */}
          {isNavigating && selectedBallData && userLocation && (
            <PlatformPolyline
              coordinates={[
                { latitude: userLocation.latitude, longitude: userLocation.longitude },
                { latitude: selectedBallData.latitude, longitude: selectedBallData.longitude },
              ]}
              strokeColor="#0EA5E9"
              strokeWidth={3}
              lineDashPattern={[5, 5]}
            />
          )}
        </PlatformMapView>
      </View>

      {/* Distance information */}
      <View style={styles.infoContainer}>
        <DistanceCard
          title="To Hole"
          distance={distanceToHole}
          icon={<Target size={20} color="#10B981" />}
        />
        
        {selectedBallData && (
          <DistanceCard
            title={`To ${selectedBallData.name}`}
            distance={distanceToSelectedBall}
            icon={<MapPin size={20} color="#0EA5E9" />}
          />
        )}
      </View>

      {/* Navigation controls */}
      {selectedBallData && (
        <NavigationCard
          ballName={selectedBallData.name}
          distance={distanceToSelectedBall}
          isNavigating={isNavigating}
          onNavigate={handleNavigate}
          onStop={() => setIsNavigating(false)}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  mapContainer: {
    flex: 1,
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  infoContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 12,
    gap: 12,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#EF4444',
    textAlign: 'center',
    marginBottom: 8,
  },
  errorSubtext: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748B',
    textAlign: 'center',
  },
});