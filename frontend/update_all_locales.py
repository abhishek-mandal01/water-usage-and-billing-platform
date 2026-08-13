import os
import json

locales_dir = r"d:\My projects\water-usage-and-billing-platform\frontend\src\locales"

translations = {
    "en": {
        "chat": {
            "tooltip": "Hi! I am SmartBot. Need help? 💧",
            "headerTitle": "SmartBot AI Assistant",
            "inputPlaceholder": "Ask SmartBot about bills, usage..."
        },
        "communityAdmin": {
            "GENERAL": "General Notice",
            "MAINTENANCE": "Maintenance Alert",
            "CONSERVATION": "Water Conservation Campaign",
            "URGENT": "Urgent Supply Disruption",
            "recent": "Recent"
        },
        "dashboard": {
            "lastMonthUsage": "Last Month Usage",
            "latestReading": "Latest Reading",
            "myDashboard": "My Dashboard",
            "tip1": "Fix dripping taps promptly to prevent wastage.",
            "tip2": "Use aeration attachments on faucets.",
            "tip3": "Water plants during early mornings or late evenings.",
            "tip4": "Install dual-flush toilets to save water.",
            "tip5": "Check for underground pipe leaks regularly."
        }
    },
    "hi": {
        "chat": {
            "tooltip": "नमस्ते! मैं स्मार्टबॉट हूँ। क्या आपको मदद चाहिए? 💧",
            "headerTitle": "स्मार्टबॉट एआई सहायक",
            "inputPlaceholder": "स्मार्टबॉट से बिल, उपयोग के बारे में पूछें..."
        },
        "communityAdmin": {
            "GENERAL": "सामान्य सूचना",
            "MAINTENANCE": "रखरखाव चेतावनी",
            "CONSERVATION": "जल संरक्षण अभियान",
            "URGENT": "आपातकालीन आपूर्ति बाधा",
            "recent": "हाल ही में"
        },
        "dashboard": {
            "lastMonthUsage": "पिछले महीने का उपयोग",
            "latestReading": "नवीनतम रीडिंग"
        }
    },
    "bn": {
        "chat": {
            "tooltip": "নমস্কার! আমি স্মার্টবট। কোনো সাহায্যের প্রয়োজন? 💧",
            "headerTitle": "স্মার্টবট এআই সহকারী",
            "inputPlaceholder": "বিল, ব্যবহার সম্পর্কে স্মার্টবটকে জিজ্ঞাসা করুন..."
        },
        "communityAdmin": {
            "GENERAL": "সাধারণ বিজ্ঞপ্তি",
            "MAINTENANCE": "রক্ষণাবেক্ষণ সতর্কতা",
            "CONSERVATION": "জল সংরক্ষণ অভিযান",
            "URGENT": "জরুরী সরবরাহ বিঘ্ন",
            "recent": "সাম্প্রতিক"
        },
        "dashboard": {
            "lastMonthUsage": "গত মাসের ব্যবহার",
            "latestReading": "সর্বশেষ রিডিং"
        }
    },
    "ta": {
        "chat": {
            "tooltip": "வணக்கம்! நான் SmartBot. உதவி தேவையா? 💧",
            "headerTitle": "SmartBot AI உதவியாளர்",
            "inputPlaceholder": "பில்கள், பயன்பாடு பற்றி SmartBot-இடம் கேளுங்கள்..."
        },
        "communityAdmin": {
            "GENERAL": "பொது அறிவிப்பு",
            "MAINTENANCE": "பராமரிப்பு எச்சரிக்கை",
            "CONSERVATION": "நீர் சேமிப்பு பிரச்சாரம்",
            "URGENT": "அவசர விநியோக தடை",
            "recent": "சமீபத்திய"
        },
        "dashboard": {
            "lastMonthUsage": "கடந்த மாத பயன்பாடு",
            "latestReading": "சமீபத்திய வாசிப்பு"
        }
    },
    "te": {
        "chat": {
            "tooltip": "నమస్కారం! నేను SmartBot. సహాయం కావాలా? 💧",
            "headerTitle": "SmartBot AI సహాయకుడు",
            "inputPlaceholder": "బిల్లులు, వినియోగం గురించి SmartBotని అడగండి..."
        },
        "communityAdmin": {
            "GENERAL": "సాధారణ నోటీసు",
            "MAINTENANCE": "నిర్వహణ హెచ్చరిక",
            "CONSERVATION": "నీటి సంరక్షణ ప్రచారం",
            "URGENT": "అత్యవసర సరఫరా అంతరాయం",
            "recent": "ఇటీవలి"
        },
        "dashboard": {
            "lastMonthUsage": "గత నెల వినియోగం",
            "latestReading": "తాజా రీడింగ్"
        }
    },
    "mr": {
        "chat": {
            "tooltip": "नमस्ते! मी स्मार्टबॉट आहे. काही मदत हवी आहे का? 💧",
            "headerTitle": "स्मार्टबॉट एआय सहाय्यक",
            "inputPlaceholder": "स्मार्टबॉटला बिले, वापराबद्दल विचारा..."
        },
        "communityAdmin": {
            "GENERAL": "सामान्य सूचना",
            "MAINTENANCE": "देखभाल सूचना",
            "CONSERVATION": "पाणी संवर्धन मोहीम",
            "URGENT": "तातडीचा पुरवठा खंडित",
            "recent": "नुकतेच"
        },
        "dashboard": {
            "lastMonthUsage": "मागील महिन्याचा वापर",
            "latestReading": "नवीनतम वाचन"
        }
    }
}

for lang, extra in translations.items():
    file_path = os.path.join(locales_dir, f"{lang}.json")
    with open(file_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    for section, keys in extra.items():
        if section not in data:
            data[section] = {}
        for k, v in keys.items():
            data[section][k] = v

    with open(file_path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

print("Updated all locale files successfully!")
