# Meet Bot - Quick Reference

## 🚀 Quick Start

### Dashboard (Manual Join)
```
URL: /meet-bot
Feature: Manual URL input
Use Case: Join meetings from main website
```

### Add-on (Auto Join)
```
URL: /meet-addon
Feature: Auto-detect meeting
Use Case: Join from Google Meet side panel
```

## 📍 Routes

### Dashboard Routes
```
/meet-bot                          → Start bot (manual URL)
/meet-bot/transcripts              → All transcripts
/meet-bot/transcripts/[id]         → Transcript detail
/meet-bot/summaries                → All summaries
/meet-bot/summaries/[id]           → Summary detail
```

### Add-on Routes
```
/meet-addon                        → Start bot (auto-detect)
/meet-addon/transcripts            → All transcripts
/meet-addon/transcripts/[id]       → Transcript detail
/meet-addon/summaries              → All summaries
/meet-addon/summaries/[id]         → Summary detail
```

## 🧩 Components

### Import
```tsx
import {
    RecordingControl,
    StatusBadge,
    MeetingInfoCard,
    RecentTranscripts,
} from '@/components/meet-bot';
```

### Usage
```tsx
// Status indicator
<StatusBadge
    phase={phase}
    jobStatus={jobStatus}
    isReady={isReady}
    hasMeeting={hasMeeting}
    isApiPending={isApiPending}
/>

// Meeting info (with manual input)
<MeetingInfoCard
    meetingCode={meetingCode}
    showManualInput={true}
    meetUrl={meetUrl}
    onMeetUrlChange={setMeetUrl}
/>

// Start/Stop button
<RecordingControl
    isRecording={isRecording}
    isApiPending={isApiPending}
    isProcessing={isProcessing}
    hasMeeting={hasMeeting}
    isReady={true}
    onStart={handleStartRecording}
    onStop={handleStopRecording}
/>

// Recent transcripts
<RecentTranscripts
    transcripts={transcripts}
    isLoading={isLoading}
    basePath="/meet-bot/transcripts"
/>
```

## 🪝 Custom Hook

```tsx
import { useMeetBot } from '@/hooks/use-meet-bot';

const {
    meetUrl,
    setMeetUrl,
    meetingCode,
    setMeetingCode,
    phase,
    statusNote,
    apiErrorMessage,
    isApiPending,
    hasMeeting,
    isRecording,
    isProcessing,
    handleStartRecording,
    handleStopRecording,
} = useMeetBot(onTranscriptReady);
```

## 🎯 Key Differences

| Feature | Dashboard | Add-on |
|---------|-----------|--------|
| URL Input | ✅ Manual | ❌ Auto |
| Layout | Full page | Side panel |
| Path | `/meet-bot` | `/meet-addon` |

## 📝 Common Tasks

### Add Manual URL Input
```tsx
<MeetingInfoCard
    meetingCode={meetingCode}
    showManualInput={true}  // ← Enable manual input
    meetUrl={meetUrl}
    onMeetUrlChange={setMeetUrl}
/>
```

### Change Transcript Base Path
```tsx
<RecentTranscripts
    transcripts={transcripts}
    isLoading={isLoading}
    basePath="/meet-bot/transcripts"  // ← Custom path
/>
```

### Handle Transcript Ready
```tsx
const refreshTranscripts = useCallback(async () => {
    const payload = await getAllTranscripts();
    setTranscripts(normalizeTranscriptList(payload));
}, []);

const bot = useMeetBot(refreshTranscripts);  // ← Callback
```

## 🔍 Debugging

### Check Bot Status
```tsx
console.log('Phase:', phase);
console.log('Job Status:', jobStatus);
console.log('Has Meeting:', hasMeeting);
console.log('Is Recording:', isRecording);
```

### Check Meeting Info
```tsx
console.log('Meet URL:', meetUrl);
console.log('Meeting Code:', meetingCode);
```

### Check Errors
```tsx
console.log('API Error:', apiErrorMessage);
```

## 🎨 Styling

All components use Tailwind CSS and shadcn/ui:
- Consistent spacing: `gap-4`, `p-4`
- Responsive: `md:p-6`
- Dark mode: Automatic
- Colors: `text-muted-foreground`, `bg-muted/20`

## 📦 Files Created

```
Components:
✅ src/components/meet-bot/recording-control.tsx
✅ src/components/meet-bot/status-badge.tsx
✅ src/components/meet-bot/meeting-info-card.tsx
✅ src/components/meet-bot/recent-transcripts.tsx
✅ src/components/meet-bot/index.ts

Hook:
✅ src/hooks/use-meet-bot.ts

Dashboard Pages:
✅ src/app/(dashboard)/meet-bot/page.tsx
✅ src/app/(dashboard)/meet-bot/transcripts/page.tsx
✅ src/app/(dashboard)/meet-bot/transcripts/[id]/page.tsx
✅ src/app/(dashboard)/meet-bot/summaries/page.tsx
✅ src/app/(dashboard)/meet-bot/summaries/[id]/page.tsx

Updated:
✅ src/app/meet-addon/page.tsx (now uses reusable components)
✅ src/components/app-sidebar.tsx (updated routes)
```

## ✅ Status

All files created ✅
No diagnostic errors ✅
Fully typed ✅
Responsive design ✅
Dark mode support ✅

---

**Need help?** Check `MEET_BOT_PAGES_SUMMARY.md` for detailed documentation.
