# 🎬 EDITBRIDGE — Creator–Editor Collaboration & Project Management Platform
> **Hackathon Edition** • Designed to Win! • 1990s Digital Workstation UI with Modern SaaS Precision

EditBridge is a purpose-built collaboration platform connecting video creators (YouTubers, podcasters, documentarians) with professional video editors. It eliminates fragmented WhatsApp/Drive workflows by centralizing **editor discovery, structured briefs, frame-accurate timestamp video reviews, revision scope tracking, and 30%/70% milestone escrow payments with access-controlled master downloads**.

---

## ⚡ Quick Start

```bash
# Install dependencies (already installed)
npm install

# Start local development server
npm run dev
# Open http://localhost:3000 in your browser!
```

Or run the optimized production build:
```bash
npm run build
npm start
```

---

## 🏆 How to Win the Hackathon (The 3-Minute Demo Pitch)

Follow the exact **Section 19 Hackathon Demo Scenario** built right into the platform:

1. **The Hook (Pitch in 30 Seconds):**
   > *"Creators don't just need another freelance directory like Fiverr. Video editing is a recurring operational workflow. Instructions get lost in WhatsApp chats, revisions blow out of control, and clients or editors fight over unpaid invoices or unreleased master files. EditBridge brings the entire lifecycle into one retro 90s digital workstation."*

2. **Step 1: Editor Discovery & Trust (Click `/editors`):**
   - Show **Alex Rivera**'s verified profile: *High-Retention Long-form Editor for Finance & Tech Creators*.
   - Filter by software (DaVinci Resolve, Premiere Pro) or niche (Finance, Shorts).
   - Click **"Invite My Existing Editor"** — point out this key feature: creators don't have to fire their current editor to use EditBridge!

3. **Step 2: The Structured Brief (Click `/projects/new` or view `/workspace` > Brief tab):**
   - Show how briefs are standardized: Aspect Ratio (16:9), Duration (14 min), 4K Resolution, Captions, Sound Design, Budget ($600), and **strict 2-round revision limits**.
   - Show the **30% Upfront ($180) / 70% Final Master ($420)** milestone split.

4. **Step 3: The Star Feature — Frame-Accurate Timestamp Feedback (Click `/workspace` > Review tab):**
   - Play the draft video preview.
   - Point out the **gold pins on the scrubber timeline**.
   - Click on the comment `00:43 - Replace B-Roll`: the video **instantly jumps to 00:43**!
   - Type a new comment (e.g. `01:15 - Cut dead air`) and hit **"Drop Note"**: it pins directly to the video and updates the revision counter.

5. **Step 4: Role Switcher & Editor Checklist:**
   - In the top header bar, click **"🎬 Editor (Alex)"**.
   - Alex checks off items on the checklist: toggles `PENDING` → `IN PROGRESS` → `RESOLVED`.
   - The progress meter moves live!

6. **Step 5: The Climax — Controlled Master Lock & Final Payout:**
   - Go to **File Vault tab**: Show that the uncompressed 4K Master is **LOCKED (Access Protected)**.
   - Switch back to **"👤 Creator (Marcus)"**.
   - Click **"Release Milestone 2 (70% - $420.00)"**.
   - 💥 **Celebration Confetti & 90s Ka-Ching chime fires!**
   - The 4K Master file **immediately unlocks** with a verified download link and an official settlement invoice!

7. **Step 6: Bonus Differentiators:**
   - Click **"Review Room"** button in the header: shows the synchronized WebRTC screen-sharing room (future differentiator).
   - Click the **CRT icon** in the header to toggle authentic 90s scanlines on/off!
   - Visit `/admin` to demonstrate Trust & Dispute operations with timecode evidence logs.

---

## 🎨 Design System: The 1990s Digital Aesthetic

- **Retro Computing Chrome:** Title bars, window bevels, 3D raised/sunken buttons, classic Windows 95 teal desktop (`#008080`), and classic bottom taskbar.
- **Modern SaaS Usability:** 100% accessible contrast ratios, clean typography, responsive layout for mobile and desktop, and instant client-side reactivity.
- **Built-in Web Audio Synthesizer:** Authentic 90s clicks, chimes, and coin sounds synthesized dynamically in the browser (zero external MP3 dependencies).
- **CRT Phosphor Scanlines:** One-click toggleable overlay.

---

## 🛠️ Architecture & Free Server / Database Deployment

### Free Database & Backend Options
1. **Zero-Config Embedded (Current):**
   - Uses local persistent state with full JSON-schema integrity matching Section 12 of the blueprint.
   - Ready for instant hackathon demonstrations without needing internet connection or database seeds.
2. **Supabase / PostgreSQL (Free Tier):**
   - Included Prisma-compatible schema matching `users`, `editor_profiles`, `projects`, `revisions`, `payments`, `files`, and `reviews`.
   - Connect by setting `DATABASE_URL` in `.env`.
3. **Free Server Hosting:**
   - **Vercel:** Run `vercel` or connect GitHub repo for instant free deployment.
   - **Render / Railway:** Supports one-click Docker or Node deployment.

---

## 📂 Project Structure

```
├── app/
│   ├── layout.tsx             # Root layout, Header & 90s Status Bar
│   ├── page.tsx               # Public Landing Page (Modules A & B)
│   ├── workspace/page.tsx     # The Core Workspace (Review, Files, Chat, Escrow)
│   ├── projects/page.tsx      # All Projects Directory & Filter
│   ├── projects/new/page.tsx  # Structured Brief Wizard (Module D)
│   ├── editors/page.tsx       # Editor Directory & Search (Module C)
│   ├── editors/[id]/page.tsx  # Editor Profile, Showreel & Packages
│   ├── admin/page.tsx         # Admin Trust & Dispute Operations (Module H)
│   └── api/                   # Backend REST API Routes
├── components/
│   ├── RetroHeader.tsx        # Top bar with Persona Switcher & Hackathon Guide
│   ├── RetroStatusBar.tsx     # 90s bottom status bar with live clock
│   ├── RetroWindow.tsx        # Reusable 90s beveled window
│   ├── TimestampPlayer.tsx    # Interactive video player with scrubber pins
│   ├── RevisionChecklist.tsx  # Editor revision checklist with status toggles
│   ├── FileVault.tsx          # Raw footage & access-locked Master files
│   ├── ProjectChat.tsx        # Project IRC message thread
│   ├── MilestoneCard.tsx      # 30/70 escrow cards & invoice generator
│   ├── LiveReviewModal.tsx    # WebRTC live review room simulator
│   ├── InviteEditorModal.tsx  # Invite existing editor link generator
│   └── ReviewModal.tsx        # Structured 5-star review modal
├── lib/
│   ├── store.tsx              # Reactive state context with LocalStorage backup
│   ├── mockData.ts            # Realistic data matching Section 19 Demo scenario
│   └── soundEffects.ts        # Web Audio API 90s system synthesizer
└── types/
    └── index.ts               # Full TypeScript data models matching Section 12
```

---

Good luck with your Hackathon! 🚀
