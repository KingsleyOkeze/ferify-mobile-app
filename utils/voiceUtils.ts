/**
 * Voice Utility - Checks if voice recognition is available
 * @react-native-voice/voice requires a custom development build
 * and will not work in Expo Go
 */

let voiceAvailable: boolean | null = null;

export const isVoiceAvailable = async (): Promise<boolean> => {
    // Return cached result if already checked
    if (voiceAvailable !== null) {
        return voiceAvailable;
    }

    try {
        // Try to import the voice module
        const Voice = require('@react-native-voice/voice').default;

        // Check if the module is properly initialized
        if (!Voice || typeof Voice.start !== 'function') {
            voiceAvailable = false;
            return false;
        }

        // Try to check if speech recognition is available
        const available = await Voice.isAvailable();
        voiceAvailable = available === 1 || available === true;
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
