'use client';

import {
    createContext,
    use,
    useEffect,
    useState,
    useTransition,
    type ReactNode,
} from 'react';
import {
    meet,
    type MeetSidePanelClient,
} from '@googleworkspace/meet-addons/meet.addons';

const MEET_CLOUD_PROJECT_NUMBER = '882230198706';
const MAIN_STAGE_URL = 'https://sabha-mind.vercel.app/meet-addon';

type MeetAddonContextValue = {
    errorMessage: string | null;
    isPending: boolean;
    isReady: boolean;
    sidePanelClient: MeetSidePanelClient | null;
    startRecording: () => void;
    statusMessage: string;
};

const MeetAddonContext = createContext<MeetAddonContextValue | null>(null);

export function MeetAddonProvider({ children }: { children: ReactNode }) {
    const [sidePanelClient, setSidePanelClient] =
        useState<MeetSidePanelClient | null>(null);
    const [isReady, setIsReady] = useState(false);
    const [statusMessage, setStatusMessage] = useState(
        'Connecting to the Meet side panel...'
    );
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        let isMounted = true;

        async function initializeSidePanel() {
            try {
                const session = await meet.addon.createAddonSession({
                    cloudProjectNumber: MEET_CLOUD_PROJECT_NUMBER,
                });
                const client = await session.createSidePanelClient();

                if (!isMounted) {
                    return;
                }

                setSidePanelClient(client);
                setIsReady(true);
                setStatusMessage(
                    'Ready to launch the VartaIQ recording workspace.'
                );
            } catch (error) {
                if (!isMounted) {
                    return;
                }

                setErrorMessage(
                    error instanceof Error
                        ? error.message
                        : 'Failed to initialize the Meet add-on side panel.'
                );
                setStatusMessage('Initialization failed.');
            }
        }

        initializeSidePanel();

        return () => {
            isMounted = false;
        };
    }, []);

    function startRecording() {
        if (!sidePanelClient) {
            setErrorMessage('The Meet side panel is still initializing.');
            return;
        }

        async function startActivity() {
            try {
                await sidePanelClient?.startActivity({
                    mainStageUrl: MAIN_STAGE_URL,
                });
                setStatusMessage('Recording workspace opened in the main stage.');
            } catch (error) {
                setErrorMessage(
                    error instanceof Error
                        ? error.message
                        : 'Unable to start the recording activity.'
                );
            }
        }

        setErrorMessage(null);
        startTransition(() => {
            void startActivity();
        });
    }

    return (
        <MeetAddonContext
            value={{
                errorMessage,
                isPending,
                isReady,
                sidePanelClient,
                startRecording,
                statusMessage,
            }}
        >
            {children}
        </MeetAddonContext>
    );
}

export function useMeetAddon() {
    const context = use(MeetAddonContext);

    if (!context) {
        throw new Error('useMeetAddon must be used inside MeetAddonProvider.');
    }

    return context;
}
