import React, { useState, useEffect } from 'react';
import './QueuePage.css';

const AdminPage = () => {
    const [requests, setRequests] = useState([]);

    const fetchQueue = async () => {
        try {
            const response = await fetch('https://api-l2ngdeqllq-uc.a.run.app/admin/queue');
            if (response.ok) {
                const data = await response.json();
                setRequests(data);
            }
        } catch (error) {
            console.error('Error fetching admin queue:', error);
        }
    };

    const handleApprove = async (id) => {
        try {
            const response = await fetch(`https://api-l2ngdeqllq-uc.a.run.app/queue/${id}/approve`, {
                method: 'PATCH'
            });

            if (response.ok) {
                setRequests(prev => prev.map(req =>
                    req.id === id ? { ...req, status: 'approved' } : req
                ));
            } else {
                alert('Onaylama başarısız oldu.');
            }
        } catch (error) {
            console.error('Error approving request:', error);
            alert('Bir hata oluştu.');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Bu isteği silmek istediğinize emin misiniz?')) return;

        try {
            const response = await fetch(`https://api-l2ngdeqllq-uc.a.run.app/queue/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                setRequests(prev => prev.filter(req => req.id !== id));
            } else {
                alert('Silme başarısız oldu.');
            }
        } catch (error) {
            console.error('Error deleting request:', error);
            alert('Bir hata oluştu.');
        }
    };

    useEffect(() => {
        fetchQueue();
        const interval = setInterval(fetchQueue, 10000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="queue-container">
            <header className="queue-header">
                <h1 className="queue-title" style={{ color: '#ff5555', textShadow: '0 0 5px #ff5555' }}>
                    YÖNETİM PANELİ
                </h1>
                <div className="live-badge" style={{ backgroundColor: '#ff5555', color: '#fff' }}>
                    ADMIN
                </div>
            </header>

            <div className="queue-list">
                {requests.map(req => (
                    <div key={req.id} className="song-card" style={{
                        borderLeftColor: req.status === 'approved' ? '#00ff88' : '#ffcc00',
                        opacity: req.status === 'approved' ? 0.7 : 1
                    }}>
                        <div className="song-info">
                            <h3 className="song-title">
                                {req.song}
                            </h3>
                            <div style={{ fontSize: '11px', color: '#999' }}>
                                {(() => {
                                    const date = new Date(req.isoTimestamp);
                                    const f = (tz, s) => date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', timeZone: tz }) + " " + s;
                                    return `${f("America/Los_Angeles", "SL")} / ${f("Europe/Istanbul", "TR")}`;
                                })()} [{req.status === 'approved' ? 'Onaylandı' : 'Bekliyor'}]
                            </div>
                            <div style={{ fontSize: '13px', color: '#ddd', marginTop: '4px' }}>
                                👤 {req.user_name}
                                {req.is_anonymous && <span style={{ color: '#ffcc00', marginLeft: '5px' }}>(Gizli)</span>}
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            {req.status !== 'approved' && (
                                <button
                                    onClick={() => handleApprove(req.id)}
                                    style={{
                                        backgroundColor: '#00ff88',
                                        color: '#000',
                                        border: 'none',
                                        padding: '5px 12px',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    ONAY
                                </button>
                            )}
                            <button
                                onClick={() => handleDelete(req.id)}
                                style={{
                                    backgroundColor: '#ff5555',
                                    color: 'white',
                                    border: 'none',
                                    padding: '5px 12px',
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    fontWeight: 'bold'
                                }}
                            >
                                SİL
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {requests.length === 0 && (
                <div className="empty-state" style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                    İstek bulunamadı.
                </div>
            )}
        </div>
    );
};

export default AdminPage;
