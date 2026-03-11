const express = require("express");
const cors = require("cors");
const { AccessToken } = require("livekit-server-sdk");

const app = express();
app.use(cors());

app.get("/api/token", async (req, res) => {
    try {
        const { roomName, participantName } = req.query;
        if (!roomName || !participantName) {
            return res.status(400).json({ error: "roomName and participantName required" });
        }
        const apiKey = process.env.LIVEKIT_API_KEY;
        const apiSecret = process.env.LIVEKIT_API_SECRET;
        if (!apiKey || !apiSecret) {
            return res.status(500).json({ error: "Missing credentials" });
        }
        const token = new AccessToken(apiKey, apiSecret, {
            identity: participantName,
            ttl: "1h",
        });
        token.addGrant({
            room: roomName,
            roomJoin: true,
            canPublish: true,
            canSubscribe: true,
        });
        const jwt = await token.toJwt();
        return res.json({ token: jwt });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server on port ${PORT}`));