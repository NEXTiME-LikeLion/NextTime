import axiosInstance from "./axiosInstance";
import { getHome } from "./home";
import { CONTEXT_STEPS } from "../data/nextTimeSteps";

const findContextOption = (stepId, value) =>
    CONTEXT_STEPS.find((step) => step.id === stepId)?.options.find(
        (option) => option.value === value,
    );

export const createNextTimeSession = async () => {
    const response = await axiosInstance.post("/next-time/sessions");
    return response.data.data;
};

export const resolveNextTimeSession = async (activeSession) => {
    if (activeSession?.sessionId) {
        return activeSession;
    }

    try {
        return await createNextTimeSession();
    } catch (error) {
        if (error?.response?.status === 409) {
            try {
                const home = await getHome();
                if (home?.activeNextTimeSession?.sessionId) {
                    return home.activeNextTimeSession;
                }
            } catch {
                // keep the original create error
            }
        }
        throw error;
    }
};

export const buildNextTimeContextBody = ({
    situationIntensity,
    location,
    moment,
}) => ({
    cravingBefore: findContextOption("intensity", situationIntensity)?.cravingBefore,
    locationContextId: findContextOption("location", location)?.contextId,
    triggerContextId: findContextOption("moment", moment)?.contextId,
});

export const saveNextTimeContext = async (sessionId, body) => {
    const response = await axiosInstance.patch(
        `/next-time/sessions/${sessionId}/context`,
        body,
    );
    return response.data.data;
};

export const generateFutureVoice = async (sessionId) => {
    const startedAt = performance.now();
    const response = await axiosInstance.post(
        `/next-time/sessions/${sessionId}/future-voice`,
    );
    const elapsedMs = Math.round(performance.now() - startedAt);

    return {
        ...response.data.data,
        elapsedMs,
    };
};
