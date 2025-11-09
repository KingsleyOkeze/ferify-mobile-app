import React, { useState, useEffect } from 'react';
import { View, Text, Alert, TextInput, TouchableOpacity, Platform, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Voice from '@react-native-voice/voice';
import { SpeechResultsEvent, SpeechErrorEvent } from '@react-native-voice/voice';


// Type for Web Speech API
declare global {
    interface Window {
        SpeechRecognition: any;
        webkitSpeechRecognition: any;
    }
}


const VoiceSearch = () => {
    const [isListening, setIsListening] = useState(false);
    const [voiceText, setVoiceText] = useState('');
    const [recognition, setRecognition] = useState<any>(null);
    const [isSupported, setIsSupported] = useState(true);


    useEffect(() => {
        if (Platform.OS === 'web') {
            initializeWebSpeech();
        } else {
            // For mobile, import dynamically only when needed
            initializeMobileSpeech();
        }


        return () => {
            if (Platform.OS === 'web' && recognition) {
                recognition.stop();
            }
        };
    }, []);


    const initializeWebSpeech = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        
        if (!SpeechRecognition) {
            console.log('Speech recognition not supported in this browser');
            setIsSupported(false);
            return;
        }


        const recognitionInstance = new SpeechRecognition();
        recognitionInstance.lang = 'en-NG'; // Nigerian English
        recognitionInstance.continuous = false;
        recognitionInstance.interimResults = true;


        recognitionInstance.onstart = () => {
            setIsListening(true);
            console.log('Voice recognition started');
        };


        recognitionInstance.onresult = (event: any) => {
            const transcript = Array.from(event.results)
                .map((result: any) => result[0])
                .map((result: any) => result.transcript)
                .join('');
            
            setVoiceText(transcript);
            
            // If final result, search
            if (event.results[0].isFinal) {
                searchRoute(transcript);
            }
        };


        recognitionInstance.onerror = (event: any) => {
            console.error('Speech recognition error:', event.error);
            setIsListening(false);
            
            if (event.error === 'not-allowed') {
                Alert.alert('Permission Denied', 'Please allow microphone access in your browser');
            } else if (event.error === 'no-speech') {
                Alert.alert('No Speech Detected', 'Please try speaking again');
            }
        };


        recognitionInstance.onend = () => {
            setIsListening(false);
            console.log('Voice recognition ended');
        };


        setRecognition(recognitionInstance);
    };


    const initializeMobileSpeech = async () => {
        try {
            // Dynamic import for mobile only
            const Voice = await import('@react-native-voice/voice');
            
            Voice.default.onSpeechStart = () => setIsListening(true);
            Voice.default.onSpeechEnd = () => setIsListening(false);
            
            Voice.default.onSpeechResults = (e: any) => {
                if (e.value && e.value.length > 0) {
                    const recognizedText = e.value[0];
                    setVoiceText(recognizedText);
                    searchRoute(recognizedText);
                }
            };


            Voice.default.onSpeechError = (e: any) => {
                console.error('Speech error:', e.error);
                setIsListening(false);
                Alert.alert('Error', 'Could not recognize speech. Please try again.');
            };


            setIsSupported(true);
        } catch (error) {
            console.error('Voice module not available:', error);
            setIsSupported(false);
        }
    };


    const startListening = async () => {
        if (!isSupported) {
            Alert.alert(
                'Not Supported', 
                Platform.OS === 'web' 
                    ? 'Speech recognition not supported. Please use Chrome or Edge browser.'
                    : 'Voice input not available on emulator. Test on a real device.'
            );
            return;
        }


        if (Platform.OS === 'web') {
            // Web Speech API
            if (!recognition) {
                Alert.alert('Error', 'Speech recognition not initialized');
                return;
            }
            
            try {
                recognition.start();
            } catch (error) {
                console.error('Error starting recognition:', error);
                // If already started, stop and restart
                recognition.stop();
                setTimeout(() => recognition.start(), 100);
            }
        } else {
            // Mobile
            try {
                const Voice = await import('@react-native-voice/voice');
                await Voice.default.start('en-NG'); // Nigerian English
                // Also supports 'yo-NG' for Yoruba, 'ig-NG' for Igbo, 'ha-NG' for Hausa
            } catch (e) {
                console.error(e);
                Alert.alert('Error', 'Could not start voice input');
            }
        }
    };


    const stopListening = async () => {
        if (Platform.OS === 'web' && recognition) {
            recognition.stop();
        } else {
            try {
                const Voice = await import('@react-native-voice/voice');
                await Voice.default.stop();
            } catch (e) {
                console.error(e);
            }
        }
        setIsListening(false);
    };


    const searchRoute = async (query: string) => {
        console.log('Searching for:', query);
        
        try {
            const response = await fetch('YOUR_BACKEND_URL/api/search', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query })
            });
            
            if (!response.ok) {
                throw new Error('Search failed');
            }
            
            const results = await response.json();
            console.log('Search results:', results);
            // Handle results - update your UI with the routes found
        } catch (error) {
            console.error('Search error:', error);
            Alert.alert('Search Error', 'Could not search for routes. Please try again.');
        }
    };


    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <TextInput 
                    value={voiceText}
                    onChangeText={setVoiceText}
                    placeholder="Where are you going?"
                    placeholderTextColor="#999"
                    style={styles.input}
                    onSubmitEditing={() => voiceText && searchRoute(voiceText)}
                />
                <TouchableOpacity 
                    onPress={isListening ? stopListening : startListening}
                    style={[
                        styles.micButton,
                        isListening && styles.micButtonActive
                    ]}
                    disabled={!isSupported}
                >
                    <Ionicons 
                        name={isListening ? "mic" : "mic-outline"} 
                        size={24} 
                        color={isSupported ? (isListening ? "#dc2626" : "#2563eb") : "#ccc"}
                    />
                </TouchableOpacity>
            </View>
            
            {isListening && (
                <Text style={styles.listeningText}>🎤 Listening...</Text>
            )}
            
            {!isSupported && (
                <Text style={styles.warningText}>
                    {Platform.OS === 'web' 
                        ? 'Use Chrome or Edge for voice input' 
                        : 'Voice input only works on real devices'}
                </Text>
            )}
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        paddingHorizontal: 12,
        paddingVertical: 8,
    },
    input: {
        flex: 1,
        fontSize: 16,
        paddingVertical: 8,
        color: '#333',
    },
    micButton: {
        padding: 8,
        marginLeft: 8,
    },
    micButtonActive: {
        backgroundColor: '#fee2e2',
        borderRadius: 20,
    },
    listeningText: {
        marginTop: 8,
        color: '#dc2626',
        fontSize: 14,
        textAlign: 'center',
    },
    warningText: {
        marginTop: 8,
        color: '#999',
        fontSize: 12,
        textAlign: 'center',
    },
});


export default VoiceSearch;
