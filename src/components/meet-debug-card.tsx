'use client';

import { useCallback, useEffect, useState } from 'react';
import {
    meet,
    type MeetSidePanelClient,
    type MeetingInfo,
    type ActivityStartingState,
    type FrameType,
    type FrameOpenReason,
    type FrameToFrameMessage,
} from '@googleworkspace/meet-addons/meet.addons';
import { Bug, ChevronDown, ChevronUp, Copy, Check } from 'lucide-react';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

// ─── Types ────────────────────────────────────────────────────────────────────

interface DebugData {
    // Addon-level
    frameType: FrameType | null;

    // Meeting info
    meetingInfo: MeetingInfo | null;

    // Frame open reason
    frameOpenReason: FrameOpenReason | null;

    // Activity starting state
    activityStartingState: ActivityStartingState | null;

    // Frame-to-frame messages received
    frameMessages: FrameToFrameMessage[];

    // Errors encountered
    errors: string[];

    // Timestamps
    initializedAt: string | null;
    lastUpdated: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function StatusDot({ status }: { status: 'ok' | 'error' | 'pending' }) {
    const colors = {
        ok: 'bg-emerald-500',
        error: 'bg-red-500',
        pending: 'bg-amber-500 animate-pulse',
    };
    return <span className={`inline-block size-2 rounded-full ${colors[status]}`} />;
}

function Row({ label, value, mono = true }: { label: string; value: React.ReactNode; mono?: boolean }) {
    return (
        <div className="flex items-start justify-between gap-3 py-1.5 text-[12px]">
            <span className="shrink-0 text-muted-foreground">{label}</span>
            <span className={`text-right break-all ${mono ? 'font-mono' : ''} text-foreground`}>
                {value ?? <span className="text-muted-foreground/60 italic">—</span>}
            </span>
        </div>
    );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="space-y-0.5">
            <div className="text-[10px] font-semibold tracking-[0.18em] text-muted-foreground/80 uppercase">
                {title}
            </div>
            <div className="divide-y divide-border/40">{children}</div>
        </div>
    );
}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * 🧪 TEMPORARY DEBUG CARD — Remove after testing.
 *
 * Queries every available API from the Google Meet Add-ons SDK (v1.2)
 * and displays the results. Add this to your meet-addon page to see
 * what data is accessible at runtime.
 */
export function MeetDebugCard({
    sidePanelClient,
}: {
    sidePanelClient: MeetSidePanelClient | undefined;
}) {
    const [collapsed, setCollapsed] = useState(false);
    const [copied, setCopied] = useState(false);
    const [data, setData] = useState<DebugData>({
        frameType: null,
        meetingInfo: null,
        frameOpenReason: null,
        activityStartingState: null,
        frameMessages: [],
        errors: [],
        initializedAt: null,
        lastUpdated: new Date().toISOString(),
    });

    // ── Query all SDK APIs ───────────────────────────────────────────────

    const queryAllData = useCallback(async () => {
        const errors: string[] = [];

        // 1. Frame type (sync, from meet.addon)
        let frameType: FrameType | null = null;
        try {
            frameType = meet.addon.getFrameType();
        } catch (e) {
            errors.push(`getFrameType: ${e instanceof Error ? e.message : String(e)}`);
        }

        // 2. Meeting info
        let meetingInfo: MeetingInfo | null = null;
        if (sidePanelClient) {
            try {
                meetingInfo = await sidePanelClient.getMeetingInfo();
            } catch (e) {
                errors.push(`getMeetingInfo: ${e instanceof Error ? e.message : String(e)}`);
            }
        }

        // 3. Frame open reason
        let frameOpenReason: FrameOpenReason | null = null;
        if (sidePanelClient) {
            try {
                frameOpenReason = await sidePanelClient.getFrameOpenReason();
            } catch (e) {
                errors.push(`getFrameOpenReason: ${e instanceof Error ? e.message : String(e)}`);
            }
        }

        // 4. Activity starting state
        let activityStartingState: ActivityStartingState | null = null;
        if (sidePanelClient) {
            try {
                activityStartingState = await sidePanelClient.getActivityStartingState();
            } catch (e) {
                errors.push(`getActivityStartingState: ${e instanceof Error ? e.message : String(e)}`);
            }
        }

        setData((prev) => ({
            ...prev,
            frameType,
            meetingInfo,
            frameOpenReason,
            activityStartingState,
            errors,
            initializedAt: prev.initializedAt ?? new Date().toISOString(),
            lastUpdated: new Date().toISOString(),
        }));
    }, [sidePanelClient]);

    // ── Register frame-to-frame message listener ─────────────────────────

    useEffect(() => {
        if (!sidePanelClient) return;

        sidePanelClient.on('frameToFrameMessage', (message: FrameToFrameMessage) => {
            setData((prev) => ({
                ...prev,
                frameMessages: [...prev.frameMessages, message],
                lastUpdated: new Date().toISOString(),
            }));
        });
    }, [sidePanelClient]);

    // ── Initial + periodic query ─────────────────────────────────────────

    useEffect(() => {
        queueMicrotask(() => {
            void queryAllData();
        });
    }, [queryAllData]);

    // ── Copy all data as JSON ────────────────────────────────────────────

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(JSON.stringify(data, null, 2));
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // clipboard may not be available in iframe
        }
    };

    // ── Render ───────────────────────────────────────────────────────────

    const overallStatus = !sidePanelClient ? 'pending' : data.errors.length > 0 ? 'error' : 'ok';

    return (
        <Card className="border-dashed border-amber-500/50 bg-amber-500/[0.03]">
            <CardHeader className="flex items-center justify-between gap-2 pb-2">
                <div className="flex items-center gap-2">
                    <Bug className="size-3.5 text-amber-500" />
                    <span className="text-[11px] font-semibold tracking-[0.12em] text-amber-600 dark:text-amber-400 uppercase">
                        SDK Debug — Remove after testing
                    </span>
                    <StatusDot status={overallStatus} />
                </div>
                <div className="flex items-center gap-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="size-6"
                        onClick={copyToClipboard}
                        title="Copy debug data as JSON"
                    >
                        {copied ? <Check className="size-3 text-emerald-500" /> : <Copy className="size-3" />}
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="size-6"
                        onClick={() => setCollapsed((c) => !c)}
                        title={collapsed ? 'Expand' : 'Collapse'}
                    >
                        {collapsed ? <ChevronDown className="size-3" /> : <ChevronUp className="size-3" />}
                    </Button>
                </div>
            </CardHeader>

            {!collapsed && (
                <CardContent className="space-y-4 pt-0 text-[12px]">
                    {/* ── Connection ──────────────────────────── */}
                    <Section title="Connection">
                        <Row
                            label="Side Panel Client"
                            value={sidePanelClient ? '✅ Connected' : '⏳ Initializing…'}
                            mono={false}
                        />
                        <Row label="Frame Type" value={data.frameType} />
                        <Row label="Frame Open Reason" value={data.frameOpenReason} />
                    </Section>

                    {/* ── Meeting Info ────────────────────────── */}
                    <Section title="Meeting Info">
                        <Row label="Meeting ID" value={data.meetingInfo?.meetingId} />
                        <Row label="Meeting Code" value={data.meetingInfo?.meetingCode} />
                    </Section>

                    {/* ── Activity Starting State ─────────────── */}
                    <Section title="Activity Starting State">
                        <Row label="Main Stage URL" value={data.activityStartingState?.mainStageUrl} />
                        <Row label="Side Panel URL" value={data.activityStartingState?.sidePanelUrl} />
                        <Row label="Additional Data" value={data.activityStartingState?.additionalData} />
                    </Section>

                    {/* ── Frame-to-Frame Messages ─────────────── */}
                    <Section title={`Frame-to-Frame Messages (${data.frameMessages.length})`}>
                        {data.frameMessages.length === 0 ? (
                            <Row label="Messages" value="None received yet" mono={false} />
                        ) : (
                            data.frameMessages.slice(-5).map((msg, i) => (
                                <Row
                                    key={i}
                                    label={`From ${msg.originator}`}
                                    value={msg.payload.slice(0, 100) + (msg.payload.length > 100 ? '…' : '')}
                                />
                            ))
                        )}
                    </Section>

                    {/* ── Available SDK Capabilities ───────────── */}
                    <Section title="SDK Capabilities (v1.2)">
                        <Row label="Side Panel → Main Stage messaging" value="✅ notifyMainStage()" mono={false} />
                        <Row label="CoDoing (shared binary state)" value="✅ createCoDoingClient()" mono={false} />
                        <Row label="CoWatching (synced media)" value="✅ createCoWatchingClient()" mono={false} />
                        <Row label="Activity lifecycle" value="✅ start / end / close" mono={false} />
                        <Row label="Set activity starting state" value="✅ setActivityStartingState()" mono={false} />
                    </Section>

                    {/* ── NOT Available from SDK ───────────────── */}
                    <Section title="NOT Available from SDK (need other APIs)">
                        <Row label="Current user identity" value="❌ Use Google OAuth / ID token" mono={false} />
                        <Row label="Participant list" value="❌ Use Meet REST API + meetingId" mono={false} />
                        <Row label="Audio / Video streams" value="❌ Not exposed" mono={false} />
                        <Row label="Chat messages" value="❌ Not exposed" mono={false} />
                        <Row label="Meeting settings / policies" value="❌ Not exposed" mono={false} />
                    </Section>

                    {/* ── Errors ──────────────────────────────── */}
                    {data.errors.length > 0 && (
                        <Section title={`Errors (${data.errors.length})`}>
                            {data.errors.map((err, i) => (
                                <div key={i} className="py-1 text-[11px] text-red-500 break-all">
                                    {err}
                                </div>
                            ))}
                        </Section>
                    )}

                    {/* ── Timestamps ──────────────────────────── */}
                    <div className="flex items-center justify-between border-t border-border/30 pt-2 text-[10px] text-muted-foreground/60">
                        <span>Initialized: {data.initializedAt ?? '—'}</span>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-5 px-1.5 text-[10px]"
                            onClick={queryAllData}
                        >
                            Refresh
                        </Button>
                    </div>
                </CardContent>
            )}
        </Card>
    );
}
