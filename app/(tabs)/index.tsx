import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";

interface Game {
  id: string;
  name: string;
  description: string;
  color: string;
}

interface GameState {
  tapCount: number;
  sequence: number[];
  userSequence: number[];
  gameOver: boolean;
}

interface LeaderboardEntry {
  score: number;
  timestamp: string;
}

const styles = StyleSheet.create({
  titleContainer: {
    alignItems: "center",
    gap: 8,
    marginBottom: 24,
    marginTop: 12,
  },
  titleText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#D4C5E8",
  },
  scoreContainer: {
    alignItems: "center",
    marginBottom: 24,
    marginHorizontal: 16,
    padding: 18,
    borderRadius: 20,
    backgroundColor: "#4A2F7D",
    borderWidth: 2,
    borderColor: "#8B6BA8",
  },
  scoreText: {
    fontSize: 28,
    fontWeight: "900",
    color: "#E6D9F5",
  },
  gameCard: {
    padding: 20,
    marginBottom: 14,
    marginHorizontal: 12,
    borderRadius: 20,
    gap: 8,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4.5,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.6)",
  },
  gameCardTitle: {
    color: "#E6D9F5",
    marginBottom: 8,
    fontSize: 18,
    fontWeight: "bold",
  },
  gameCardDescription: {
    color: "#D4C5E8",
    fontSize: 14,
  },
  gameCardCTA: {
    color: "#C9A6E6",
    marginTop: 12,
    fontSize: 13,
    fontWeight: "600",
  },
  gameContainer: {
    gap: 20,
    marginVertical: 32,
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: "#3E2863",
    marginHorizontal: 12,
    borderRadius: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#E6D9F5",
  },
  tapButton: {
    backgroundColor: "#8B6BA8",
    paddingVertical: 36,
    paddingHorizontal: 50,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    elevation: 10,
    shadowColor: "#1a0f2e",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    borderWidth: 3,
    borderColor: "#C9A6E6",
  },
  tapButtonText: {
    fontSize: 52,
    fontWeight: "bold",
    color: "#E6D9F5",
  },
  simonGrid: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 18,
    justifyContent: "center",
    marginVertical: 24,
  },
  simonButton: {
    width: 90,
    height: 90,
    borderRadius: 22,
    margin: 8,
    elevation: 8,
    shadowColor: "#1a0f2e",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    borderWidth: 3,
    borderColor: "#C9A6E6",
  },
  infoContainer: {
    marginVertical: 32,
    marginHorizontal: 16,
    paddingHorizontal: 18,
    paddingVertical: 24,
    paddingBottom: 40,
    backgroundColor: "#4A2F7D",
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#8B6BA8",
  },
});

export default function HomeScreen() {
  const [playerName, setPlayerName] = useState("");
  const [hasEnteredName, setHasEnteredName] = useState(false);
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [simonGameStarted, setSimonGameStarted] = useState(false);
  const [isPlayingSequence, setIsPlayingSequence] = useState(false);
  const [highlightedColor, setHighlightedColor] = useState<number | null>(null);
  const [gameState, setGameState] = useState<GameState>({
    tapCount: 0,
    sequence: [],
    userSequence: [],
    gameOver: false,
  });
  const [score, setScore] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(30);
  const [simonTimeRemaining, setSimonTimeRemaining] = useState(30);
  const [numberGameTimeRemaining, setNumberGameTimeRemaining] = useState(30);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Number Guessing Game State
  const [guess, setGuess] = useState("");
  const [randomNumber, setRandomNumber] = useState(
    Math.floor(Math.random() * 100) + 1,
  );
  const [attempts, setAttempts] = useState(0);
  const [message, setMessage] = useState("");
  const [hint, setHint] = useState("");

  const quizQuestions = [
    {
      question: "What year was the first mobile game released?",
      options: [
        { text: "1989 (Tetris on Game Boy)", correct: true },
        { text: "1995 (Snake on Nokia)", correct: false },
      ],
    },
    {
      question: "Which game popularized mobile gaming on phones?",
      options: [
        { text: "Angry Birds", correct: false },
        { text: "Snake", correct: true },
      ],
    },
    {
      question: "What is the most downloaded mobile game ever?",
      options: [
        { text: "Candy Crush Saga", correct: true },
        { text: "PUBG Mobile", correct: false },
      ],
    },
    {
      question: "Which company created Pokemon GO?",
      options: [
        { text: "Niantic", correct: true },
        { text: "Nintendo only", correct: false },
      ],
    },
  ];

  // Load leaderboard from storage on mount
  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    // Leaderboard is stored in component state only
  };

  const addScoreToLeaderboard = async (finalScore: number) => {
    const newEntry: LeaderboardEntry = {
      score: finalScore,
      timestamp: new Date().toLocaleTimeString(),
    };
    const updatedLeaderboard = [newEntry, ...leaderboard].sort(
      (a, b) => b.score - a.score,
    );
    const topScores = updatedLeaderboard.slice(0, 5);
    setLeaderboard(topScores);
  };

  const games: Game[] = [
    {
      id: "tap",
      name: "🎯 Tap Rush",
      description: "Tap as fast as you can!",
      color: "#6B4BA0",
    },
    {
      id: "simon",
      name: "🎨 Simon Says",
      description: "Remember the sequence!",
      color: "#5D3F8E",
    },
    {
      id: "quiz",
      name: "❓ Quick Quiz",
      description: "Answer mobile game questions",
      color: "#7A5BA8",
    },
    {
      id: "memory",
      name: "🧠 Number Guess",
      description: "Guess the number!",
      color: "#8B6BA8",
    },
  ];

  const handleTapGame = () => {
    setGameState((prev) => ({
      ...prev,
      tapCount: prev.tapCount + 1,
    }));
    setScore(score + 1);
  };

  const handleSimonTap = (colorIndex: number) => {
    // Don't allow taps while sequence is playing or if game hasn't started
    if (!simonGameStarted || isPlayingSequence) return;

    const newUserSequence = [...gameState.userSequence, colorIndex];
    setGameState((prev) => ({
      ...prev,
      userSequence: newUserSequence,
    }));

    if (
      newUserSequence[newUserSequence.length - 1] !==
      gameState.sequence[newUserSequence.length - 1]
    ) {
      Alert.alert(
        "Game Over!",
        `You got ${gameState.sequence.length} levels correct!\nTime: ${30 - simonTimeRemaining}s`,
      );
      setGameState({
        tapCount: 0,
        sequence: [],
        userSequence: [],
        gameOver: true,
      });
      setSimonGameStarted(false);
      setSelectedGame(null);
    } else if (newUserSequence.length === gameState.sequence.length) {
      const newSequence = [
        ...gameState.sequence,
        Math.floor(Math.random() * 6),
      ];
      setScore(score + 1);
      setGameState({
        tapCount: 0,
        sequence: newSequence,
        userSequence: [],
        gameOver: false,
      });
    }
  };

  const startSimonGame = () => {
    const initialSequence = [Math.floor(Math.random() * 6)];
    setGameState({
      tapCount: 0,
      sequence: initialSequence,
      userSequence: [],
      gameOver: false,
    });
    setSimonGameStarted(true);
    setSimonTimeRemaining(30);
  };

  const resetGame = () => {
    setSelectedGame(null);
    setGameStarted(false);
    setSimonGameStarted(false);
    setGameState({
      tapCount: 0,
      sequence: [],
      userSequence: [],
      gameOver: false,
    });
    setScore(0);
    setTimeRemaining(30);
    setSimonTimeRemaining(30);
    setNumberGameTimeRemaining(30);
    setCurrentQuestionIndex(0);
    setGuess("");
    setAttempts(0);
    setMessage("");
    setRandomNumber(Math.floor(Math.random() * 100) + 1);
  };

  const startTapGame = () => {
    setGameStarted(true);
    setGameState({
      tapCount: 0,
      sequence: [],
      userSequence: [],
      gameOver: false,
    });
    setScore(0);
    setTimeRemaining(30);
  };

  // Effect to play the Simon sequence
  useEffect(() => {
    if (!simonGameStarted || gameState.sequence.length === 0) return;

    setIsPlayingSequence(true);

    const playSequence = async () => {
      // Small delay before starting
      await new Promise((resolve) => setTimeout(resolve, 500));

      for (let i = 0; i < gameState.sequence.length; i++) {
        await new Promise((resolve) => {
          setTimeout(() => {
            setHighlightedColor(gameState.sequence[i]);
            setTimeout(() => {
              setHighlightedColor(null);
              resolve(null);
            }, 500);
          }, 600);
        });
      }

      setIsPlayingSequence(false);
    };

    playSequence();
  }, [gameState.sequence, simonGameStarted]);

  // Simon Says timer effect
  useEffect(() => {
    if (selectedGame !== "simon" || !simonGameStarted) return;

    if (simonTimeRemaining <= 0) {
      Alert.alert(
        "Time's Up! ⏰",
        `You reached level ${gameState.sequence.length}!\nScore: ${score}`,
        [
          {
            text: "Back to Games",
            onPress: () => {
              setSimonGameStarted(false);
              setSelectedGame(null);
            },
          },
        ],
      );
      return;
    }

    const timer = setTimeout(() => {
      setSimonTimeRemaining(simonTimeRemaining - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [
    simonTimeRemaining,
    selectedGame,
    simonGameStarted,
    gameState.sequence.length,
    score,
  ]);

  // Timer effect for Tap Rush game
  useEffect(() => {
    if (selectedGame !== "tap" || !gameStarted) return;

    if (timeRemaining <= 0) {
      addScoreToLeaderboard(score);
      Alert.alert(
        "Time's Up! ⏰",
        `You got ${gameState.tapCount} taps!\nFinal Score: ${score}`,
        [
          {
            text: "Back to Games",
            onPress: resetGame,
          },
        ],
      );
      return;
    }

    const timer = setTimeout(() => {
      setTimeRemaining(timeRemaining - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeRemaining, selectedGame, gameStarted]);

  // Timer effect for Number Guessing game
  useEffect(() => {
    if (selectedGame !== "memory") return;

    if (numberGameTimeRemaining <= 0) {
      Alert.alert(
        "⏰ Time's Up!",
        `The number was ${randomNumber}.\nYou made ${attempts} attempts.\nScore: ${score}`,
        [
          {
            text: "Back to Games",
            onPress: () => {
              setGuess("");
              setAttempts(0);
              setMessage("");
              setNumberGameTimeRemaining(30);
              setRandomNumber(Math.floor(Math.random() * 100) + 1);
              resetGame();
            },
          },
        ],
      );
      return;
    }

    const timer = setTimeout(() => {
      setNumberGameTimeRemaining(numberGameTimeRemaining - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [numberGameTimeRemaining, selectedGame, randomNumber, attempts, score]);

  // Tap Rush Pre-Game Screen
  if (selectedGame === "tap" && !gameStarted) {
    return (
      <ParallaxScrollView
        headerBackgroundColor={{ light: "#6B4BA0", dark: "#4A2F7D" }}
        headerImage={
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#6B4BA0",
            }}
          >
            <ThemedText type="title" style={{ color: "#E6D9F5", fontSize: 28 }}>
              🎯 Tap Rush
            </ThemedText>
          </View>
        }
      >
        <ThemedView style={styles.gameContainer}>
          <ThemedText
            type="subtitle"
            style={{
              fontSize: 22,
              fontWeight: "bold",
              color: "#E6D9F5",
              marginBottom: 16,
              textAlign: "center",
            }}
          >
            Tap as many times as you can in 30 seconds!
          </ThemedText>

          {leaderboard.length > 0 && (
            <ThemedView
              style={{
                marginVertical: 20,
                paddingHorizontal: 16,
                paddingVertical: 16,
                backgroundColor: "#4A2F7D",
                borderRadius: 16,
                borderWidth: 2,
                borderColor: "#8B6BA8",
              }}
            >
              <ThemedText
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                  color: "#E6D9F5",
                  marginBottom: 12,
                  textAlign: "center",
                }}
              >
                🏆 Top Scores
              </ThemedText>
              {leaderboard.map((entry, index) => (
                <ThemedText
                  key={index}
                  style={{
                    fontSize: 14,
                    color: "#D4C5E8",
                    marginBottom: 6,
                  }}
                >
                  {index + 1}. {entry.score} taps {entry.timestamp}
                </ThemedText>
              ))}
            </ThemedView>
          )}

          <Button
            title="🚀 Start Game"
            onPress={startTapGame}
            color="#C9A6E6"
          />
          <Button
            title="Back to Games"
            onPress={() => setSelectedGame(null)}
            color="#8B6BA8"
          />
        </ThemedView>
      </ParallaxScrollView>
    );
  }

  // Tap Rush Game Screen
  if (selectedGame === "tap" && gameStarted) {
    return (
      <ParallaxScrollView
        headerBackgroundColor={{ light: "#6B4BA0", dark: "#4A2F7D" }}
        headerImage={
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#6B4BA0",
            }}
          >
            <ThemedText type="title" style={{ color: "#E6D9F5", fontSize: 28 }}>
              🎯 Tap Rush
            </ThemedText>
          </View>
        }
      >
        <ThemedView style={styles.gameContainer}>
          <ThemedText type="subtitle" style={styles.scoreText}>
            💥 Score: {score}
          </ThemedText>
          <ThemedText
            style={{ fontSize: 18, marginBottom: 20, color: "#D4C5E8" }}
          >
            Taps: {gameState.tapCount}
          </ThemedText>
          <ThemedText
            style={{
              fontSize: 24,
              fontWeight: "bold",
              marginBottom: 20,
              color: timeRemaining <= 10 ? "#FF6B9D" : "#C9A6E6",
            }}
          >
            ⏱️ {timeRemaining}s
          </ThemedText>
          <Pressable
            style={[
              styles.tapButton,
              { opacity: timeRemaining <= 0 ? 0.5 : 1 },
            ]}
            onPress={handleTapGame}
            disabled={timeRemaining <= 0}
          >
            <Text style={[styles.tapButtonText]}>TAP!</Text>
          </Pressable>
          <View style={{ marginVertical: 10 }} />
          <Button
            title="Back to Games"
            onPress={() => {
              setTimeRemaining(30);
              resetGame();
            }}
            color="#C9A6E6"
          />
        </ThemedView>
      </ParallaxScrollView>
    );
  }

  // Simon Says Pre-Game Screen
  if (selectedGame === "simon" && !simonGameStarted) {
    return (
      <ParallaxScrollView
        headerBackgroundColor={{ light: "#5D3F8E", dark: "#3E2863" }}
        headerImage={
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#5D3F8E",
            }}
          >
            <ThemedText type="title" style={{ color: "#E6D9F5", fontSize: 28 }}>
              🎨 Simon Says
            </ThemedText>
          </View>
        }
      >
        <ThemedView style={styles.gameContainer}>
          <ThemedText
            type="subtitle"
            style={{
              fontSize: 18,
              fontWeight: "bold",
              color: "#E6D9F5",
              marginBottom: 16,
              textAlign: "center",
            }}
          >
            Remember the sequence and repeat it!
          </ThemedText>
          <ThemedText
            style={{
              fontSize: 14,
              color: "#D4C5E8",
              marginBottom: 20,
              textAlign: "center",
            }}
          >
            Each level adds one more color to remember. You have 30 seconds to
            get as far as you can!
          </ThemedText>

          <Button
            title="🎮 Start Game"
            onPress={startSimonGame}
            color="#C9A6E6"
          />
          <Button
            title="✨ Back to Games"
            onPress={() => setSelectedGame(null)}
            color="#8B6BA8"
          />
        </ThemedView>
      </ParallaxScrollView>
    );
  }

  // Simon Says Game Screen (Active Gameplay)
  if (selectedGame === "simon" && simonGameStarted) {
    const colors = [
      "#FF6B6B",
      "#4ECDC4",
      "#FFE66D",
      "#95E1D3",
      "#C7B3F5",
      "#FF8B94",
    ];
    return (
      <ParallaxScrollView
        headerBackgroundColor={{ light: "#5D3F8E", dark: "#3E2863" }}
        headerImage={
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#5D3F8E",
            }}
          >
            <ThemedText type="title" style={{ color: "#E6D9F5", fontSize: 28 }}>
              🎨 Simon Says
            </ThemedText>
          </View>
        }
      >
        <ThemedView style={styles.gameContainer}>
          <ThemedText type="subtitle" style={styles.scoreText}>
            ⭐ Level: {gameState.sequence.length}
          </ThemedText>
          <ThemedText
            style={{
              fontSize: 24,
              fontWeight: "bold",
              marginBottom: 20,
              color: simonTimeRemaining <= 5 ? "#FF6B9D" : "#C9A6E6",
            }}
          >
            ⏱️ {simonTimeRemaining}s
          </ThemedText>

          {isPlayingSequence && (
            <ThemedText
              style={{
                fontSize: 16,
                fontStyle: "italic",
                marginBottom: 16,
                color: "#FFE66D",
                fontWeight: "bold",
              }}
            >
              👀 Watch the sequence...
            </ThemedText>
          )}

          <View style={styles.simonGrid}>
            {colors.map((color, index) => (
              <Pressable
                key={index}
                style={[
                  styles.simonButton,
                  {
                    backgroundColor: color,
                    opacity:
                      highlightedColor === index
                        ? 1
                        : gameState.userSequence.includes(index)
                          ? 0.6
                          : isPlayingSequence
                            ? 0.5
                            : 1,
                    elevation: highlightedColor === index ? 15 : 8,
                    shadowOpacity: highlightedColor === index ? 0.4 : 0.3,
                  },
                ]}
                onPress={() => handleSimonTap(index)}
                disabled={isPlayingSequence}
              />
            ))}
          </View>

          {!isPlayingSequence && gameState.sequence.length > 0 && (
            <ThemedText
              style={{
                fontSize: 14,
                color: "#C9A6E6",
                marginBottom: 16,
                fontStyle: "italic",
              }}
            >
              Your turn! Repeat the sequence
            </ThemedText>
          )}

          <Button
            title="✨ Back to Games"
            onPress={() => {
              setSimonGameStarted(false);
              setSelectedGame(null);
            }}
            color="#C9A6E6"
          />
        </ThemedView>
      </ParallaxScrollView>
    );
  }

  // Quiz Game Screen
  if (selectedGame === "quiz") {
    const currentQuestion = quizQuestions[currentQuestionIndex];

    const handleQuizAnswer = (isCorrect: boolean) => {
      if (isCorrect) {
        setScore(score + 10);
        Alert.alert(
          "Correct! 🎉",
          `You earned 10 points! Total: ${score + 10}`,
        );
      } else {
        Alert.alert("Wrong! ❌", `Try again. Score: ${score}`);
      }

      // Move to next question
      if (currentQuestionIndex < quizQuestions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        Alert.alert(
          "Quiz Complete! 🏆",
          `Final Score: ${score + (isCorrect ? 10 : 0)}`,
          [
            {
              text: "Back to Games",
              onPress: () => {
                setCurrentQuestionIndex(0);
                resetGame();
              },
            },
          ],
        );
      }
    };

    return (
      <ParallaxScrollView
        headerBackgroundColor={{ light: "#7A5BA8", dark: "#4A2F7D" }}
        headerImage={
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#7A5BA8",
            }}
          >
            <ThemedText type="title" style={{ color: "#E6D9F5", fontSize: 28 }}>
              ❓ Quick Quiz
            </ThemedText>
          </View>
        }
      >
        <ThemedView style={styles.gameContainer}>
          <ThemedText type="subtitle" style={styles.scoreText}>
            🏆 Score: {score} 🏆
          </ThemedText>

          <ThemedText
            style={{
              fontSize: 14,
              color: "#D4C5E8",
              marginBottom: 16,
              textAlign: "center",
            }}
          >
            Question {currentQuestionIndex + 1} of {quizQuestions.length}
          </ThemedText>

          <ThemedText
            style={{
              fontSize: 18,
              marginBottom: 30,
              fontWeight: "bold",
              color: "#D4C5E8",
            }}
          >
            {currentQuestion.question}
          </ThemedText>

          {currentQuestion.options.map((option, index) => (
            <View key={index} style={{ marginVertical: 8, width: "100%" }}>
              <Button
                title={option.text}
                onPress={() => handleQuizAnswer(option.correct)}
                color="#C9A6E6"
              />
            </View>
          ))}

          <View style={{ marginVertical: 10 }} />
          <Button
            title="🎮 Back to Games"
            onPress={() => {
              setCurrentQuestionIndex(0);
              resetGame();
            }}
            color="#C9A6E6"
          />
        </ThemedView>
      </ParallaxScrollView>
    );
  }

  /// Number Guess hint generator
  useEffect(() => {
    if (selectedGame === "memory") {
      const hints = [
        `🔺 The number is higher than ${Math.floor(randomNumber / 2)}`,
        `🔻 The number is lower than ${randomNumber + Math.floor((100 - randomNumber) / 2)}`,
        `🔢 The number is between ${Math.max(1, randomNumber - 10)} and ${Math.min(100, randomNumber + 10)}`,
        `✖️ The number is divisible by ${randomNumber % 5 === 0 ? 5 : 1}`,
      ];

      const randomHint = hints[Math.floor(Math.random() * hints.length)];
      setHint(randomHint);
    }
  }, [selectedGame, randomNumber]);

  // Guess handler
  const handleGuess = () => {
    const userGuess = parseInt(guess);

    if (isNaN(userGuess)) {
      Alert.alert("Invalid Input", "Please enter a valid number!");
      return;
    }

    setAttempts((prev) => prev + 1);

    if (userGuess === randomNumber) {
      setScore((prev) => prev + 50);

      Alert.alert(
        "🎉 Correct!",
        `You guessed the number in ${attempts + 1} attempts!\nTime Left: ${numberGameTimeRemaining}s\nYou earned 50 points!`,
        [
          {
            text: "Play Again",
            onPress: () => {
              const newNumber = Math.floor(Math.random() * 100) + 1;

              setGuess("");
              setAttempts(0);
              setMessage("");
              setNumberGameTimeRemaining(30);
              setRandomNumber(newNumber);
            },
          },
        ],
      );
    } else if (userGuess < randomNumber) {
      setMessage("📈 Too low! Try higher");
    } else {
      setMessage("📉 Too high! Try lower");
    }

    setGuess("");
  };

  // Number Guess Screen
  if (selectedGame === "memory") {
    return (
      <ParallaxScrollView
        headerBackgroundColor={{ light: "#8B6BA8", dark: "#5D3F8E" }}
        headerImage={
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#8B6BA8",
            }}
          >
            <ThemedText type="title" style={{ color: "#E6D9F5", fontSize: 28 }}>
              🎯 Number Guess
            </ThemedText>
          </View>
        }
      >
        <ThemedView style={styles.gameContainer}>
          <ThemedText type="subtitle" style={styles.scoreText}>
            💎 Score: {score}
          </ThemedText>

          <ThemedText
            style={{ fontSize: 16, marginBottom: 10, color: "#D4C5E8" }}
          >
            Guess the secret number between 1 and 100!
          </ThemedText>

          {hint !== "" && (
            <ThemedText
              style={{
                fontSize: 16,
                marginBottom: 16,
                fontWeight: "bold",
                color: "#FFD700",
                textAlign: "center",
              }}
            >
              💡 Hint: {hint}
            </ThemedText>
          )}

          <ThemedText
            style={{
              fontSize: 24,
              fontWeight: "bold",
              marginBottom: 20,
              color: numberGameTimeRemaining <= 10 ? "#FF6B9D" : "#C9A6E6",
            }}
          >
            ⏱️ {numberGameTimeRemaining}s
          </ThemedText>

          <ThemedText
            style={{ fontSize: 14, marginBottom: 10, color: "#C9A6E6" }}
          >
            Attempts: {attempts}
          </ThemedText>

          {message !== "" && (
            <ThemedText
              style={{
                fontSize: 16,
                marginBottom: 16,
                fontWeight: "bold",
                color: "#FFE66D",
              }}
            >
              {message}
            </ThemedText>
          )}

          <TextInput
            style={{
              width: "100%",
              borderWidth: 2,
              borderColor: "#C9A6E6",
              backgroundColor: "#4A2F7D",
              color: "#E6D9F5",
              fontSize: 18,
              padding: 12,
              borderRadius: 12,
              marginBottom: 16,
              textAlign: "center",
            }}
            placeholder="Enter your guess..."
            value={guess}
            onChangeText={setGuess}
            keyboardType="numeric"
            placeholderTextColor="#8B6BA8"
            editable={numberGameTimeRemaining > 0}
          />

          <Button
            title="🎯 Guess"
            onPress={handleGuess}
            color="#C9A6E6"
            disabled={numberGameTimeRemaining <= 0}
          />

          <View style={{ marginVertical: 10 }} />

          <Button
            title="🎮 Back to Games"
            onPress={() => {
              const newNumber = Math.floor(Math.random() * 100) + 1;

              setGuess("");
              setAttempts(0);
              setMessage("");
              setNumberGameTimeRemaining(30);
              setRandomNumber(newNumber);

              resetGame();
            }}
            color="#8B6BA8"
          />
        </ThemedView>
      </ParallaxScrollView>
    );
  }

  // Name Entry Screen
  if (!hasEnteredName) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#2D1B4E",
          paddingHorizontal: 20,
        }}
      >
        <ThemedText
          style={{
            fontSize: 25,
            fontWeight: "bold",
            color: "#E6D9F5",
            marginBottom: 16,
            textAlign: "center",
          }}
        >
          Hi!{"\n"}
          Welcome to StressLess Ghub 228!
        </ThemedText>

        <ThemedText
          style={{
            fontSize: 18,
            color: "#D4C5E8",
            marginBottom: 32,
            textAlign: "center",
          }}
        >
          Enter your name to get started.
        </ThemedText>

        <TextInput
          style={{
            width: "100%",
            borderWidth: 2,
            borderColor: "#C9A6E6",
            backgroundColor: "#4A2F7D",
            color: "#E6D9F5",
            fontSize: 18,
            padding: 16,
            borderRadius: 12,
            marginBottom: 20,
          }}
          placeholder="Enter your name..."
          value={playerName}
          onChangeText={setPlayerName}
          placeholderTextColor="#8B6BA8"
        />

        <Button
          title="🚀 Enter"
          onPress={() => {
            if (playerName.trim().length > 0) {
              Alert.alert(
                "Hello, " + playerName + "!",
                "Welcome to StressLess GameHub 228!",
                [
                  {
                    text: "OK",
                    onPress: () => setHasEnteredName(true),
                  },
                ],
              );
            } else {
              Alert.alert("Please enter your name first!");
            }
          }}
          color="#C9A6E6"
        />
      </View>
    );
  }

  // Main Games Hub Screen
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#4A2F7D", dark: "#2D1B4E" }}
      headerImage={
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#4A2F7D",
          }}
        >
          <ThemedText style={styles.titleText}>StressLess Ghub 228</ThemedText>
        </View>
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="subtitle" style={styles.headerText}>
          Welcome, {playerName}!👋
        </ThemedText>
        <ThemedText style={{ fontSize: 14, color: "#D4C5E8", marginTop: 8 }}>
          Let's play some games and have fun!
        </ThemedText>
        <View style={{ paddingHorizontal: 16, marginTop: 16 }}>
          <Button
            title="🔄 Change name"
            onPress={() => setHasEnteredName(false)}
            color="#8B6BA8"
          />
        </View>
      </ThemedView>

      <ThemedView style={styles.scoreContainer}>
        <ThemedText style={styles.scoreText}>🏆 Score: {score}</ThemedText>
      </ThemedView>

      <ScrollView style={{ paddingHorizontal: 0 }}>
        {games.map((game) => (
          <Pressable
            key={game.id}
            style={[styles.gameCard, { backgroundColor: game.color }]}
            onPress={() => {
              setSelectedGame(game.id);
              setGameState({
                tapCount: 0,
                sequence: [],
                userSequence: [],
                gameOver: false,
              });
              if (game.id === "tap") {
                setTimeRemaining(30);
              }
              if (game.id === "simon") {
                setSimonTimeRemaining(30);
              }
              if (game.id === "memory") {
                setNumberGameTimeRemaining(30);
              }
            }}
          >
            <ThemedText type="subtitle" style={styles.gameCardTitle}>
              {game.name}
            </ThemedText>
            <ThemedText style={styles.gameCardDescription}>
              {game.description}
            </ThemedText>
            <ThemedText style={styles.gameCardCTA}>Tap to Play →</ThemedText>
          </Pressable>
        ))}
      </ScrollView>

      <ThemedView style={styles.infoContainer}>
        <ThemedText
          type="subtitle"
          style={{ fontSize: 20, marginBottom: 12, color: "#FF1493" }}
        >
          How to Play 💜
        </ThemedText>
        <ThemedText style={{ marginTop: 8, lineHeight: 26, fontSize: 15 }}>
          {`🎯 Tap Rush:\nTap the button as fast as you can! Each tap earns a point.\n\n🎨 Simon Says:\nWatch & remember the colors, then tap them back!\n\n❓ Quick Quiz:\nAnswer gaming trivia to earn bonus points! 🎉\n\n🧠 Number Guess:\nGuess the secret number in 30 seconds! 🌟`}
        </ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}
