import { AddonHeader } from '@/components/addon-header';

export default function MeetAddonLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen flex-col bg-background font-mono">
            <AddonHeader />
            <main className="flex flex-1 flex-col">{children}</main>
        </div>
    );
}
