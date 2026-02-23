/**
 * Centralized keys for AsyncStorage to avoid typos and scattering
 */
export const STORAGE_KEYS = {
    // Auth
    AUTH_TOKEN: 'auth_token',
    REFRESH_TOKEN: 'auth_refresh_token',
    USER_DATA: 'auth_user_data',

    // Achievements & Profile
    USER_ACHIEVEMENTS: 'cache_user_achievements',
    LEADERBOARD: 'cache_leaderboard',
    BADGES: 'cache_badges',
    CONTRIBUTION_STATS: 'cache_contribution_stats',
    CONTRIBUTION_HISTORY: 'cache_contribution_history',
    TRUST_OVERVIEW: 'cache_trust_overview',

    // Saved Routes
    HOME_ADDRESS: 'home_address',
    WORK_ADDRESS: 'work_address',

    // Location
    CURRENT_LOCATION: 'user_current_location',
    PRIVACY_SETTINGS: 'user_privacy_settings',

    // App State / Flags
    HAS_LAUNCHED: 'has_launched',
    HAS_SEEN_NOTIF_PROMPT: 'HAS_SEEN_NOTIF_PROMPT',
    NOTIFICATION_SETTINGS: 'NOTIFICATION_SETTINGS_CACHE',
    NOTIFICATION_TOKEN: 'notification_token',
};

export const CACHE_TTL = {
    SHORT: 5 * 60 * 1000,    // 5 minutes
    MEDIUM: 30 * 60 * 1000,  // 30 minutes
    LONG: 24 * 60 * 60 * 1000, // 24 hours
};
