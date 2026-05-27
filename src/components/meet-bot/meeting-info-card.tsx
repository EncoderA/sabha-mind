'use client';

function formatMeetingCode(code: string) {
    if (code.includes('-')) {
        return code;
    }
    if (code.length === 10) {
        return `${code.slice(0, 3)}-${code.slice(3, 7)}-${code.slice(7)}`;
    }
    return code;
}

type MeetingInfoCardProps = {
    meetingCode: string;
    errorMessage?: string | null;
    showManualInput?: boolean;
    meetUrl?: string;
    onMeetUrlChange?: (url: string) => void;
};

export function MeetingInfoCard({
    meetingCode,
    errorMessage,
    showManualInput = false,
    meetUrl = '',
    onMeetUrlChange,
}: MeetingInfoCardProps) {
    const hasMeeting = Boolean(meetingCode.trim());

    return (
        <section className="rounded-xl border border-border/70 bg-muted/20 p-4">
            <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                Google Meet
            </p>
            
            {showManualInput ? (
                <div className="mt-2 space-y-2">
                    <input
                        className="h-10 w-full rounded-lg border border-border/70 bg-background px-3 text-[13px] outline-none transition-colors focus-visible:border-primary/50 focus-visible:ring-3 focus-visible:ring-primary/15"
                        onChange={(e) => onMeetUrlChange?.(e.target.value)}
                        placeholder="https://meet.google.com/abc-defg-hij"
                        type="url"
                        value={meetUrl}
                    />
                    {hasMeeting && (
                        <p className="text-[13px] text-muted-foreground">
                            Meeting code: <span className="font-medium text-foreground">{formatMeetingCode(meetingCode)}</span>
                        </p>
                    )}
                </div>
            ) : hasMeeting ? (
                <p className="mt-1 text-base font-medium tracking-tight">
                    {formatMeetingCode(meetingCode)}
                </p>
            ) : (
                <p className="mt-1 text-[13px] text-muted-foreground">
                    Join a meeting and open VartaIQ from the Meet side panel.
                </p>
            )}
            
            {errorMessage ? (
                <p className="mt-2 text-[12px] text-destructive" role="alert">
                    {errorMessage}
                </p>
            ) : null}
        </section>
    );
}
