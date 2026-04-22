import { AddonHeader } from '@/components/addon-header';
import { MeetAddonProvider } from './meet-addon-provider';

export default function MeetAddonLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <MeetAddonProvider>
            <div className="flex min-h-screen flex-col bg-background font-mono">
                <AddonHeader />
                <main className="flex flex-1 flex-col">{children}</main>
            </div>
        </MeetAddonProvider>
    );
}
