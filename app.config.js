import 'dotenv/config';

export default {
    expo: {
        name: "UPortal",
        slug: "UcpPortalClone",
        version: "1.0.0",
        orientation: "portrait",
        icon: "./assets/images/App_Icon.png",
        scheme: "ucpportalclone",
        userInterfaceStyle: "automatic",
        newArchEnabled: true,
        ios: {
            supportsTablet: true,
            bundleIdentifier: "com.abdullah-askari.UcpPortalClone"
        },
        android: {
            adaptiveIcon: {
                backgroundColor: "#ffffff",
                foregroundImage: "./assets/images/App_Icon.png"
            },
            edgeToEdgeEnabled: true,
            package: "com.abdullah.ucpportal",
            googleServicesFile: "./android/app/google-services.json"
        },
        web: {
            output: "static",
            favicon: "./assets/images/favicon.png"
        },
        plugins: [
            "expo-router",
            "@react-native-firebase/app",
            "@react-native-firebase/auth",
            "@react-native-firebase/crashlytics",
            [
                "expo-notifications",
                {
                    icon: "./assets/images/App_Icon.png",
                    color: "#ffffff",
                    sounds: [
                        "./assets/notificationsound.mp3"
                    ]
                }
            ],
            [
                "expo-splash-screen",
                {
                    image: "./assets/images/Logo.png",
                    imageWidth: 200,
                    resizeMode: "contain",
                    backgroundColor: "#ffffff",
                    dark: {
                        backgroundColor: "#000000"
                    }
                }
            ],
            "expo-web-browser",
            "@react-native-google-signin/google-signin"
        ],
        experiments: {
            typedRoutes: true
        },
        extra: {
            router: {},
            eas: {
                projectId: "a91705e4-1e2f-4a4a-a4c6-7222f7380430"
            },
            // Environment variables loaded from .env file
            firebaseApiKey: process.env.FIREBASE_API_KEY,
            firebaseAuthDomain: process.env.FIREBASE_AUTH_DOMAIN,
            firebaseProjectId: process.env.FIREBASE_PROJECT_ID,
            firebaseStorageBucket: process.env.FIREBASE_STORAGE_BUCKET,
            firebaseMessagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
            firebaseAppId: process.env.FIREBASE_APP_ID,
            webClientId: process.env.WEB_CLIENT_ID,
            cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME,
            cloudinaryUploadPreset: process.env.CLOUDINARY_UPLOAD_PRESET
        },
        owner: "abdullah_askari"
    }
};