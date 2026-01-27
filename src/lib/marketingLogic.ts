export interface UserContext {
    date: Date;
    timezone: string;
    locale: string;
}

export interface PopupContent {
    shouldShow: boolean;
    mode: 'standard' | 'tuesday_closed' | 'hidden';
}

export function determinePopupState(context: UserContext): PopupContent {
    const { date, timezone, locale } = context;

    // --- DEV MODE OVERRIDE (1 Hour Activation) ---
    // Sim Date: Jan 24 2026. 
    // Setting expiry to allow immediate testing for "about one hour" (plus buffer)
    const DEV_EXPIRY = new Date('2026-01-24T23:59:59Z').getTime();
    if (Date.now() < DEV_EXPIRY) {
        const isTuesday = date.getDay() === 2;
        return { 
            shouldShow: true, 
            mode: isTuesday ? 'tuesday_closed' : 'standard' 
        };
    }
    // ---------------------------------------------

    // 1. STRICT BLOCK: SPANISH SPEAKERS
    // "Bajo ninguna circunstancia locales, costarricenses o gente que hable español"
    if (locale.toLowerCase().startsWith('es')) {
        return { shouldShow: false, mode: 'hidden' };
    }

    // 2. TARGET AUDIENCE SELECTOR
    let isTargetAudience = false;
    const lang = locale.split('-')[0].toLowerCase();

    // A. Tourists ALREADY in Costa Rica (Quepos/Manuel Antonio)
    // Logic: Timezone is CR, but Language is NOT Spanish (already filtered above)
    // This captures "Gringos que lleguen a Quepos"
    if (timezone === 'America/Costa_Rica') {
        isTargetAudience = true;
    }

    // B. International Target Markets (USA, Canada, China, Korea)
    // Detect via Language preferences
    const targetLangs = ['en', 'fr', 'zh', 'ko']; // English, French, Chinese, Korean
    if (targetLangs.includes(lang)) {
        isTargetAudience = true;
    }

    // If not in target audience, HIDE
    if (!isTargetAudience) {
        return { shouldShow: false, mode: 'hidden' };
    }

    // 3. TUESDAY LOGIC (For the target audience)
    // Manuel Antonio Park is closed on Tuesdays
    const isTuesday = date.getDay() === 2;

    if (isTuesday) {
        return { shouldShow: true, mode: 'tuesday_closed' };
    }

    return { shouldShow: true, mode: 'standard' };
}
