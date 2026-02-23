/**
 * Get the appropriate Android Client ID based on environment
 */
export const getAndroidClientId = (): string | undefined => {
    if (__DEV__) {
        return process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID_DEBUG;
    } else {
        return process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID_RELEASE;
    }
};

export const getWebClientId = (): string | undefined => {
    return process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
};

export const getIosClientId = (): string | undefined => {
    return process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID;
};