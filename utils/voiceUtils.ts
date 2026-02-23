/**
 * Voice Utility - Checks if voice recognition is available
 * expo-speech-recognition requires a custom development build
 * and will not work in Expo Go
 */

import { ExpoSpeechRecognitionModule } from "expo-speech-recognition";

let voiceAvailable: boolean | null = null;

export const isVoiceAvailable = async (): Promise<boolean> => {
    // Return cached result if already checked
    if (voiceAvailable !== null) {
        return voiceAvailable;
    }

    try {
        // Try to check if speech recognition is available
        const available = await ExpoSpeechRecognitionModule.isRecognitionAvailable();
        voiceAvailable = available;
        return voiceAvailable;
    } catch (error) {
        console.log('Voice recognition not available:', error);
        voiceAvailable = false;
        return false;
    }
};

export const getVoiceUnavailableMessage = (): string => {
    return "Voice search requires a custom development build. It's not available in Expo Go.";
};
