import React, { useEffect, useRef, useState } from 'react';
import { hightlightsSlides } from '../constants';
import gsap from 'gsap';
import { pauseImg, playImg, replayImg } from '../utils';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';


gsap.registerPlugin(ScrollTrigger);

function VideoCarousel() {
    const videoRef = useRef([]);
    const videoSpanRef = useRef([]);
    const videoDivRef = useRef([]);

    const [video, setVideo] = useState({
        isEnd: false,
        startPlay: false,
        videoId: 0,
        isLastVideo: false,
        isPlaying: false,
    });
    const [loadedData, setLoadedData] = useState([]);

    const { isEnd, isLastVideo, startPlay, videoId, isPlaying } = video;

    useEffect(() => {
        if (loadedData.length > 3) {
            if (!isPlaying) {
                videoRef.current[videoId].pause();
            } else {
                startPlay && videoRef.current[videoId].play();
            }
        }
    }, [startPlay, videoId, isPlaying, loadedData]);

    const handleLoadedData = (i, e) => setLoadedData((prev) => [...prev, e]);

    useGSAP(() => {
        gsap.to('#slider', {
            x: `${-100 * videoId}%`,
            duration: 2,
            ease: 'power2.inOut'
        });
        gsap.to(videoRef.current[videoId], {
            scrollTrigger: {
                trigger: videoRef.current[videoId],
                toggleActions: 'restart'
            },
            onComplete: () => {
                setVideo((prev) => ({
                    ...prev,
                    startPlay: true,
                    isPlaying: true
                }));
            }
        });
    }, [videoId]);

    useEffect(() => {
        let currentProgress = 0;
        const span = videoSpanRef.current[videoId];
        if (span) {
            const anim = gsap.to(span, {
                onUpdate: () => {
                    const progress = Math.ceil(anim.progress() * 100);
                    if (progress !== currentProgress) {
                        currentProgress = progress;
                        gsap.to(videoDivRef.current[videoId], {
                            width: window.innerWidth < 760
                                ? '10vw'
                                : window.innerWidth < 1200
                                    ? '10vw'
                                    : '4vw'
                        });
                    }
                    gsap.to(span, {
                        width: `${currentProgress}%`,
                        background: 'white'
                    });
                },
                onComplete: () => {
                    if (isPlaying) {
                        gsap.to(videoDivRef.current[videoId], {
                            width: '12px'
                        });
                        gsap.to(span, {
                            backgroundColor: '#afafaf'
                        });
                    }
                }
            });

            const animUpdate = () => {
                anim.progress(videoRef.current[videoId].currentTime / hightlightsSlides[videoId].videoDuration);
            };

            if (isPlaying) {
                gsap.ticker.add(animUpdate);
            } else {
                gsap.ticker.remove(animUpdate);
            }

            return () => {
                anim.kill();
                gsap.ticker.remove(animUpdate);
            };
        }
    }, [videoId, startPlay, isPlaying]);

    const handleProcess = (type) => {
        switch (type) {
            case 'video-end':
                setVideo((prev) => ({
                    ...prev,
                    isEnd: true,
                    videoId: videoId + 1
                }));
                break;
            case 'video-last':
                setVideo((prev) => ({
                    ...prev,
                    isLastVideo: true
                }));
                break;
            case 'video-reset':
                setVideo((prev) => ({
                    ...prev,
                    isLastVideo: false,
                    videoId: 0
                }));
                break;
            case 'play':
                setVideo((prev) => ({
                    ...prev,
                    isPlaying: !prev.isPlaying
                }));
                break;
            case 'pause':
                setVideo((prev) => ({
                    ...prev,
                    isPlaying: false
                }));
                break;
            default:
                return video;
        }
    };

    return (
        <>
            <div className='flex items-center overflow-hidden'>
                {hightlightsSlides.map((list, i) => (
                    <div key={list.id} id="slider" className='sm:pr-20 pr-10 flex-shrink-0'>
                        <div className='video-carousel_container'>
                            <div className='w-full h-full flex-center rounded-3xl overflow-hidden bg-black'>
                                <video
                                    id="video"
                                    playsInline={true}
                                    preload='auto'
                                    muted
                                    className={`${
                                        list.id === 2 && 'translate-x-44'} pointer-events-none`}
                                    ref={(el) => (videoRef.current[i] = el)}
                                    onEnded={() => i !== hightlightsSlides.length - 1 ? handleProcess('video-end') : handleProcess('video-last')}
                                    onPlay={() => setVideo((prev) => ({ ...prev, isPlaying: true }))}
                                    onLoadedMetadata={(e) => handleLoadedData(i, e)}
                                >
                                    <source src={list.video} type="video/mp4" />
                                </video>
                            </div>
                            <div className='absolute top-12 left-[5%] z-10'>
                                {list.textLists.map((text) => (
                                    <p key={text} className='md:text-2xl text-xl font-medium'>
                                        {text}
                                    </p>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className='relative flex-center mt-10'>
                <div className='flex-center py-5 px-7 bg-gray backdrop-blur rounded-full'>
                    {hightlightsSlides.map((_, i) => (
                        <span
                            key={i}
                            ref={(el) => (videoDivRef.current[i] = el)}
                            className='mx-2 w-3 h-3 bg-gray-200 rounded-full relative cursor-pointer'
                        >
                            <span
                                className='absolute h-full w-full rounded-full'
                                ref={(el) => (videoSpanRef.current[i] = el)}
                            />
                        </span>
                    ))}
                </div>
                <button className='control-btn' onClick={() => handleProcess(isLastVideo ? 'video-reset' : isPlaying ? 'pause' : 'play')}>
                    <img src={isLastVideo ? replayImg : isPlaying ? pauseImg : playImg} alt={isLastVideo ? 'replay' : isPlaying ? 'pause' : 'play'} />
                </button>
            </div>
        </>
    );
}

export default VideoCarousel;
