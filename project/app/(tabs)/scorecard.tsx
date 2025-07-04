import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, Minus, Save, RotateCcw, Trophy } from 'lucide-react-native';
import { ScorecardHeader } from '@/components/ScorecardHeader';
import { HoleCard } from '@/components/HoleCard';
import { StatsCard } from '@/components/StatsCard';
import { useScorecard } from '@/hooks/useScorecard';

export default function ScorecardScreen() {
  const { currentGame, holes, updateHoleScore, saveGame, resetGame, gameStats } = useScorecard();
  const [playerName, setPlayerName] = useState('Player 1');

  const handleScoreChange = (holeNumber: number, newScore: number) => {
    if (newScore >= 0 && newScore <= 15) {
      updateHoleScore(holeNumber, newScore);
    }
  };

  const handleSaveGame = () => {
    if (gameStats.totalScore === 0) {
      Alert.alert('No Scores', 'Please enter at least one score before saving.');
      return;
    }

    Alert.alert(
      'Save Game',
      `Save game for ${playerName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Save', onPress: () => {
          saveGame(playerName);
          Alert.alert('Game Saved', 'Your scorecard has been saved successfully!');
        }},
      ]
    );
  };

  const handleResetGame = () => {
    Alert.alert(
      'Reset Scorecard',
      'Are you sure you want to reset all scores?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Reset', style: 'destructive', onPress: resetGame },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScorecardHeader
        courseName="Pebble Beach Golf Links"
        date={new Date().toLocaleDateString()}
        totalScore={gameStats.totalScore}
        totalPar={gameStats.totalPar}
      />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.playerSection}>
          <Text style={styles.playerLabel}>Player Name</Text>
          <TextInput
            style={styles.playerInput}
            value={playerName}
            onChangeText={setPlayerName}
            placeholder="Enter player name"
            placeholderTextColor="#94A3B8"
          />
        </View>

        <View style={styles.statsSection}>
          <StatsCard
            title="Total Score"
            value={gameStats.totalScore.toString()}
            subtitle={gameStats.totalScore > 0 ? `${gameStats.totalScore > gameStats.totalPar ? '+' : ''}${gameStats.totalScore - gameStats.totalPar}` : '-'}
            color="#10B981"
          />
          <StatsCard
            title="Holes Played"
            value={gameStats.holesPlayed.toString()}
            subtitle={`of ${holes.length}`}
            color="#0EA5E9"
          />
          <StatsCard
            title="Average"
            value={gameStats.averageScore.toFixed(1)}
            subtitle="per hole"
            color="#F59E0B"
          />
        </View>

        <View style={styles.holesSection}>
          <Text style={styles.sectionTitle}>Holes</Text>
          {holes.map((hole) => (
            <HoleCard
              key={hole.number}
              hole={hole}
              score={currentGame.scores[hole.number] || 0}
              onScoreChange={(newScore) => handleScoreChange(hole.number, newScore)}
            />
          ))}
        </View>

        <View style={styles.actionsSection}>
          <TouchableOpacity style={styles.resetButton} onPress={handleResetGame}>
            <RotateCcw size={20} color="#EF4444" />
            <Text style={styles.resetButtonText}>Reset</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.saveButton} onPress={handleSaveGame}>
            <Save size={20} color="#FFFFFF" />
            <Text style={styles.saveButtonText}>Save Game</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollView: {
    flex: 1,
  },
  playerSection: {
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 24,
  },
  playerLabel: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1E293B',
    marginBottom: 8,
  },
  playerInput: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1E293B',
  },
  statsSection: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 24,
    gap: 12,
  },
  holesSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1E293B',
    marginBottom: 12,
    marginHorizontal: 20,
  },
  actionsSection: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 32,
    gap: 12,
  },
  resetButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#EF4444',
    gap: 8,
  },
  resetButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#EF4444',
  },
  saveButton: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10B981',
    paddingVertical: 14,
    borderRadius: 8,
    gap: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
});