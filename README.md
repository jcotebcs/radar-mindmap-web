# Radar MindMap Assistant — Web (v5)

This is a **standalone PWA** that pairs with your server pack (Caddy + MediaMTX + coturn) and exposes:
- **Firebase Email Link auth**
- **WHIP (WebRTC) streaming client** for sub-second camera preview via MediaMTX
- **Timesheet** starter (local timer + Background Sync queue)
- **Exports** stub (server endpoints to render DOCX/PDF/MD/Slides)
- **Offline PWA** with service worker + background sync

## Quick start

1) Serve this folder over HTTPS (required for camera + PWA):
   - Easiest: drop `web/` into the `server-docker-pack-v5/web/dist/` then run `docker compose up -d`.

2) Create `/config.json` at the web root:
```json
{
  "firebase": {
    "apiKey": "YOUR_API_KEY",
    "authDomain": "your-project.firebaseapp.com",
    "projectId": "your-project",
    "appId": "YOUR_APP_ID"
  },
  "webrtc": {
    "whipEndpoint": "https://your-domain/whip",
    "iceServers": [
      {"urls": ["stun:stun.l.google.com:19302"]},
      {"urls": ["turn:turn.your-domain:3478"], "username": "user", "credential": "pass"}
    ]
  }
}
```

3) Open site, send yourself a magic link, sign in, and press **Start** under **Live Preview**.

## Files

- `index.html` – UI layout
- `manifest.webmanifest` – PWA metadata
- `sw.js` – cache + background sync
- `scripts/` – app modules
  - `auth.js` – Firebase Email Link login
  - `whipClient.js` – WHIP (POST SDP → answer)
  - `timesheet.js` – minimal timer + queue
  - `backgroundSync.js` – IndexedDB + Sync API
  - `export.js` – stubs to call server export endpoints
- `assets/icons/` – placeholder icons (replace with real PNGs)

## Notes

- The **Exports** buttons call `/api/export/*` — wire these on your server to generate files and return a URL.
- For **WebRTC** beyond a LAN, configure **coturn** and set `iceServers` in `config.json`.
- To customize auth flows or add voice wake-word, layer in Porcupine Web or a client VAD and call into your pipeline.

