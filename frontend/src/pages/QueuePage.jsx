import React, { useState, useEffect } from 'react';
import { LayoutList } from 'lucide-react';
import SongCard from '../components/SongCard';
import './QueuePage.css';

const QueuePage = () => {
    const [requests, setRequests] = useState([]);

    const fetchQueue = async () => {
        try {
            const response = await fetch('https://api-l2ngdeqllq-uc.a.run.app/queue');
            if (response.ok) {
                const data = await response.json();
                setRequests(data);
            }
        } catch (error) {
            console.error('Error fetching queue:', error);
        }
    };

    useEffect(() => {
        fetchQueue();
        const interval = setInterval(fetchQueue, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="queue-container">
            <header className="queue-header">
                <div className="queue-header-top">
                    <h1 className="queue-title">
                        SİZİN İSTEKLERİNİZ
                    </h1>
                </div>
                <div className="queue-instructions">
                    Parça isteklerinizi local chat'e <span className="highlight">/istek parça ismi - şarkıcı</span> şeklinde yazabilirsiniz.
                    <div className="example-box">
                        Örnek: /istek Firuze - Sezen Aksu
                    </div>
                </div>
            </header>

            <div className="queue-list">
                {requests.slice(0, 10).map(req => (
                    <SongCard
                        key={req.id}
                        song={req.song}
                        userName={req.user_name}
                        isAnonymous={req.is_anonymous}
                        timestamp={req.timestamp}
                        isoTimestamp={req.isoTimestamp}
                    />
                ))}

                {requests.length === 0 && (
                    <div className="empty-state-container">
                        <div className="empty-state-box">
                            <LayoutList size={24} />
                            <span className="empty-state-text">Yeni istekler bekleniyor...</span>
                        </div>
                    </div>
                )}
            </div>

            {requests.length >= 10 && (
                <div className="warning-message">
                    Lütfen istek listesinin azalmasını bekleyin.
                </div>
            )}

        </div>
    );
};

export default QueuePage;
