'use client';

import type { MeetingTranscript, TranscriptSegment } from '@/lib/bot-api';
import { formatSegmentRange } from '@/lib/bot-api';
import { Card, CardContent } from '@/components/ui/card';

function SegmentCard({ segment }: { segment: TranscriptSegment }) {
  return (
    <Card className="border-border/60">
      <CardContent className="space-y-2 p-3">
        <div className="flex items-start justify-between gap-2">
          <span className="text-[12px] font-semibold text-foreground">
            {segment.speaker || 'Unknown'}
          </span>
          <span className="shrink-0 text-[10px] tabular-nums text-muted-foreground">
            {formatSegmentRange(segment.start, segment.end)}
          </span>
        </div>
        <p className="text-[13px] leading-[1.55] text-foreground/90">{segment.text}</p>
      </CardContent>
    </Card>
  );
}

export function TranscriptSegments({
  transcript,
}: {
  transcript: MeetingTranscript;
}) {
  if (transcript.segments.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border/70 p-6 text-center text-[13px] text-muted-foreground">
        No transcript segments for this meeting.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {transcript.segments.map((segment) => (
        <SegmentCard key={segment.id || `${segment.start}-${segment.speaker}`} segment={segment} />
      ))}
    </div>
  );
}
