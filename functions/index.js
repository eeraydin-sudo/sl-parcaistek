const { onRequest } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");

admin.initializeApp();
const db = admin.firestore();

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

// GET /api/queue (Public - only approved)
app.get("/queue", async (req, res) => {
    try {
        const snapshot = await db.collection("requests")
            .where("status", "==", "approved")
            .orderBy("timestamp", "asc")
            .limit(10)
            .get();

        const queue = [];
        snapshot.forEach((doc) => {
            const data = doc.data();
            const date = new Date(data.timestamp);
            const timeStr = date.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });

            queue.push({
                id: doc.id,
                song: data.song,
                timestamp: timeStr,
                isoTimestamp: data.timestamp,
                user_name: data.user_name,
                is_anonymous: data.is_anonymous,
                status: data.status
            });
        });

        res.json(queue);
    } catch (error) {
        console.error("Queue Read Error:", error);
        res.status(500).json({ error: "Veri okunamadi" });
    }
});

// GET /api/admin/queue (Admin - all requests)
app.get("/admin/queue", async (req, res) => {
    try {
        const snapshot = await db.collection("requests")
            .orderBy("timestamp", "desc")
            .get();

        const queue = [];
        snapshot.forEach((doc) => {
            const data = doc.data();
            const date = new Date(data.timestamp);
            const timeStr = date.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });

            queue.push({
                id: doc.id,
                song: data.song,
                timestamp: timeStr,
                isoTimestamp: data.timestamp,
                user_name: data.user_name,
                is_anonymous: data.is_anonymous,
                status: data.status || "pending"
            });
        });

        res.json(queue);
    } catch (error) {
        console.error("Admin Queue Read Error:", error);
        res.status(500).json({ error: "Veri okunamadi" });
    }
});

// PATCH /api/queue/:id/approve
app.patch("/queue/:id/approve", async (req, res) => {
    const { id } = req.params;
    try {
        await db.collection("requests").doc(id).update({
            status: "approved"
        });
        res.json({ success: true });
    } catch (error) {
        console.error("Approve Error:", error);
        res.status(500).json({ error: "Onaylama basarisiz" });
    }
});

// POST /api/request
app.post("/request", async (req, res) => {
    const { song, note, user_uuid, user_name, is_anonymous } = req.body;

    if (!song) {
        return res.status(400).json({ error: "Sarki adi gerekli" });
    }

    let finalSong = song;
    let finalIsAnonymous = is_anonymous === true || is_anonymous === "true";

    // Fail-safe: Check if .gizli is in the song name (case insensitive)
    if (finalSong.toLowerCase().includes(".gizli")) {
        finalSong = finalSong.replace(/\.gizli/gi, "").trim();
        finalIsAnonymous = true;
    }

    try {
        // Pending list limit (only count pending requests)
        const snapshot = await db.collection("requests").where("status", "==", "pending").get();
        if (snapshot.size >= 10) {
            return res.status(400).send("Lütfen istek listesinin onaylanmasını bekleyin.");
        }

        const newRequest = {
            song: finalSong,
            note: note || "",
            user_uuid: user_uuid || "anonymous",
            user_name: finalIsAnonymous ? "Gizli" : (user_name || "Bilinmiyor"),
            is_anonymous: finalIsAnonymous,
            status: "pending",
            timestamp: new Date().toISOString()
        };

        const docRef = await db.collection("requests").add(newRequest);
        res.status(201).json({ success: true, id: docRef.id });
    } catch (error) {
        console.error("Request Write Error:", error);
        res.status(500).json({ error: "Kayit basarisiz" });
    }
});

// DELETE /api/queue/:id
app.delete("/queue/:id", async (req, res) => {
    const { id } = req.params;

    try {
        await db.collection("requests").doc(id).delete();
        res.json({ success: true });
    } catch (error) {
        console.error("Request Delete Error:", error);
        res.status(500).json({ error: "Silme basarisiz" });
    }
});

exports.api = onRequest(app);
