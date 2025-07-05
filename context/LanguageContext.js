import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Translation keys
const translations = {
  en: {
    // Onboarding
    selectLanguage: 'Select a language',
    getStarted: 'Get Started',
    
    // Auth
    welcomeBack: 'Welcome Back',
    signInToAccount: 'Sign in to your TrafficAZ account',
    createAccount: 'Create Account',
    joinTrafficAZ: 'Join TrafficAZ for real-time traffic alerts',
    fullName: 'Full Name',
    phoneNumber: 'Phone Number',
    email: 'Email (Optional)',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    login: 'Login',
    register: 'Register',
    alreadyHaveAccount: 'Already have an account?',
    dontHaveAccount: "Don't have an account?",
    loginHere: 'Login here',
    registerHere: 'Register here',
    
    // OTP
    verifyOtp: 'Verify OTP',
    enterOtpCode: 'Enter the 4-digit code sent to',
    otpCode: 'OTP Code',
    enterOtp: 'Enter 4-digit OTP',
    verifyOtpButton: 'Verify OTP',
    didntReceiveCode: "Didn't receive the code?",
    resend: 'Resend',
    
    // Validation
    nameRequired: 'Name is required',
    phoneRequired: 'Phone number is required',
    validPhone: 'Please enter a valid 9-digit phone number',
    validEmail: 'Please enter a valid email address',
    passwordRequired: 'Password is required',
    passwordLength: 'Password must be at least 6 characters',
    passwordsDontMatch: 'Passwords do not match',
    validOtp: 'Please enter a valid 4-digit OTP',
    
    // Loading states
    creatingAccount: 'Creating Account...',
    signingIn: 'Signing In...',
    verifying: 'Verifying...',
    
    // Home
    welcomeBackUser: 'Welcome back, {name}!',
    realTimeAlerts: 'Real-time traffic alerts',
    latestTrafficAlert: 'Latest Traffic Alert',
    quickActions: 'Quick Actions',
    reportTraffic: 'Report Traffic',
    viewMap: 'View Map',
    
    // Common
    required: 'Required',
    optional: 'Optional',
  },
  fr: {
    // Onboarding
    selectLanguage: 'Sélectionnez une langue',
    getStarted: 'Commencer',
    
    // Auth
    welcomeBack: 'Bon Retour',
    signInToAccount: 'Connectez-vous à votre compte TrafficAZ',
    createAccount: 'Créer un Compte',
    joinTrafficAZ: 'Rejoignez TrafficAZ pour des alertes de trafic en temps réel',
    fullName: 'Nom Complet',
    phoneNumber: 'Numéro de Téléphone',
    email: 'Email (Optionnel)',
    password: 'Mot de Passe',
    confirmPassword: 'Confirmer le Mot de Passe',
    login: 'Se Connecter',
    register: 'S\'inscrire',
    alreadyHaveAccount: 'Vous avez déjà un compte?',
    dontHaveAccount: 'Vous n\'avez pas de compte?',
    loginHere: 'Connectez-vous ici',
    registerHere: 'Inscrivez-vous ici',
    
    // OTP
    verifyOtp: 'Vérifier OTP',
    enterOtpCode: 'Entrez le code à 4 chiffres envoyé à',
    otpCode: 'Code OTP',
    enterOtp: 'Entrez le code OTP à 4 chiffres',
    verifyOtpButton: 'Vérifier OTP',
    didntReceiveCode: 'Vous n\'avez pas reçu le code?',
    resend: 'Renvoyer',
    
    // Validation
    nameRequired: 'Le nom est requis',
    phoneRequired: 'Le numéro de téléphone est requis',
    validPhone: 'Veuillez entrer un numéro de téléphone à 9 chiffres valide',
    validEmail: 'Veuillez entrer une adresse email valide',
    passwordRequired: 'Le mot de passe est requis',
    passwordLength: 'Le mot de passe doit contenir au moins 6 caractères',
    passwordsDontMatch: 'Les mots de passe ne correspondent pas',
    validOtp: 'Veuillez entrer un OTP à 4 chiffres valide',
    
    // Loading states
    creatingAccount: 'Création du compte...',
    signingIn: 'Connexion...',
    verifying: 'Vérification...',
    
    // Home
    welcomeBackUser: 'Bon retour, {name}!',
    realTimeAlerts: 'Alertes de trafic en temps réel',
    latestTrafficAlert: 'Dernière Alerte de Trafic',
    quickActions: 'Actions Rapides',
    reportTraffic: 'Signaler le Trafic',
    viewMap: 'Voir la Carte',
    
    // Common
    required: 'Requis',
    optional: 'Optionnel',
  },
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en'); // Default to 'en'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStoredLanguage();
  }, []);

  const loadStoredLanguage = async () => {
    try {
      const storedLanguage = await AsyncStorage.getItem('selectedLanguage');
      if (storedLanguage) {
        setLanguage(storedLanguage);
      }
      // Always set loading to false, even if no stored language
      setLoading(false);
    } catch (error) {
      console.error('Error loading stored language:', error);
      setLoading(false);
    }
  };

  const changeLanguage = async (newLanguage) => {
    try {
      await AsyncStorage.setItem('selectedLanguage', newLanguage);
      setLanguage(newLanguage);
    } catch (error) {
      console.error('Error storing language:', error);
    }
  };

  const t = (key, params = {}) => {
    const translation = translations[language]?.[key] || translations.en[key] || key;
    
    // Replace parameters in translation
    return translation.replace(/\{(\w+)\}/g, (match, param) => {
      return params[param] || match;
    });
  };

  const value = {
    language,
    changeLanguage,
    t,
    loading,
    availableLanguages: Object.keys(translations),
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}; 