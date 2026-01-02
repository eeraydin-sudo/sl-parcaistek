import React from 'react';
import { User, Music } from 'lucide-react';

const SongCard = ({ song, userName, isAnonymous, timestamp, isoTimestamp }) => {
    // Determine if it's truly anonymous
    const anonymous = isAnonymous === true || isAnonymous === 'true';

    const formatTime = (isoStr, timeZone, suffix) => {
        if (!isoStr) return "";
        try {
            const date = new Date(isoStr);
            return date.toLocaleTimeString('tr-TR', {
                hour: '2-digit',
                minute: '2-digit',
                timeZone: timeZone
            }) + " " + suffix;
        } catch (e) {
            return "";
        }
    };

    const slTime = formatTime(isoTimestamp, "America/Los_Angeles", "SL");
    const trTime = formatTime(isoTimestamp, "Europe/Istanbul", "TR");

    return (
        <div className="song-card">
            <div className="song-main">
                <div className="song-title">
                    {song}
                </div>
                <div className="song-meta">
                    {anonymous ? (
                        <div className="meta-item">
                            <User size={14} />
                            <span>Gizli</span>
                        </div>
                    ) : (
                        <div className="meta-item">
                            <User size={14} />
                            <span>{userName}</span>
                        </div>
                    )}
                </div>
            </div>
            <div className="song-right">
                <div className="song-time">
                    {slTime} / {trTime}
                </div>
            </div>
        </div>
    );
};

export default SongCard;
