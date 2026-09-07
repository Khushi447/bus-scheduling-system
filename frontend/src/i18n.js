import { useEffect, useState } from "react";

const translations = {
  en: {
    home: "Home",
    contacts: "Contacts",
    settings: "Settings",
    signup: "Sign Up",
    login: "Login",
    profile: "Profile",
    admin: "Admin",
    profileSettings: "Profile Settings",
    preferences: "Preferences",
    security: "Security Settings",
    fullName: "Full Name",
    email: "Email",
    phone: "Phone",
    depot: "Depot",
    saveChanges: "Save Changes",
    updatePreferences: "Update Preferences",
    theme: "Theme",
    language: "Language",
    english: "English",
    hindi: "Hindi",
    emailAlerts: "Email Alerts",
    smsAlerts: "SMS Alerts",
    currentPassword: "Current Password",
    newPassword: "New Password",
    confirmNewPassword: "Confirm New Password",
    changePassword: "Change Password",
    uploadPicture: "Upload Picture",
    uploading: "Uploading...",
    loading: "Loading...",
    personalInformation: "Personal Information",
    recentSchedules: "Recent Schedules",
    noAssignedDuties: "No duties are assigned to you yet.",
  },
  hi: {
    home: "होम",
    contacts: "संपर्क",
    settings: "सेटिंग्स",
    signup: "साइन अप",
    login: "लॉगिन",
    profile: "प्रोफ़ाइल",
    admin: "एडमिन",
    profileSettings: "प्रोफ़ाइल सेटिंग्स",
    preferences: "प्राथमिकताएं",
    security: "सुरक्षा सेटिंग्स",
    fullName: "पूरा नाम",
    email: "ईमेल",
    phone: "फ़ोन",
    depot: "डिपो",
    saveChanges: "बदलाव सेव करें",
    updatePreferences: "प्राथमिकताएं अपडेट करें",
    theme: "थीम",
    language: "भाषा",
    english: "अंग्रेज़ी",
    hindi: "हिंदी",
    emailAlerts: "ईमेल अलर्ट",
    smsAlerts: "एसएमएस अलर्ट",
    currentPassword: "वर्तमान पासवर्ड",
    newPassword: "नया पासवर्ड",
    confirmNewPassword: "नए पासवर्ड की पुष्टि करें",
    changePassword: "पासवर्ड बदलें",
    uploadPicture: "फ़ोटो अपलोड करें",
    uploading: "अपलोड हो रहा है...",
    loading: "लोड हो रहा है...",
    personalInformation: "व्यक्तिगत जानकारी",
    recentSchedules: "हाल की ड्यूटी",
    noAssignedDuties: "अभी आपको कोई ड्यूटी नहीं दी गई है।",
  },
};

export const getLanguage = () => localStorage.getItem("language") || "en";

export const setLanguage = (language) => {
  localStorage.setItem("language", language);
  window.dispatchEvent(new Event("languagechange"));
};

export const useLanguage = () => {
  const [language, setCurrentLanguage] = useState(getLanguage);

  useEffect(() => {
    const updateLanguage = () => setCurrentLanguage(getLanguage());
    window.addEventListener("languagechange", updateLanguage);
    return () => window.removeEventListener("languagechange", updateLanguage);
  }, []);

  return { language, t: (key) => translations[language]?.[key] || translations.en[key] || key };
};
