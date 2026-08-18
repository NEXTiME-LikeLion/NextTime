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

export const getNextTimeRecommendation = async (sessionId) => {
    const response = await axiosInstance.post(
        `/next-time/sessions/${sessionId}/recommendation`,
    );
    return response.data.data;
};

export const startNextTimeMission = async (sessionId) => {
    const response = await axiosInstance.post(
        `/next-time/sessions/${sessionId}/mission/start`,
    );
    return response.data.data;
};

export const completeNextTimeMission = async (sessionId) => {
    const response = await axiosInstance.post(
        `/next-time/sessions/${sessionId}/mission/complete`,
    );
    return response.data.data;
};

export const NEXT_TIME_STATUS_ORDER = [
    "CREATED",
    "CONTEXT_SAVED",
    "MISSION_RECOMMENDED",
    "MISSION_STARTED",
    "MISSION_COMPLETED",
];

export const NEXT_TIME_STATUS_PATHS = {
    CREATED: "/next-time/context",
    CONTEXT_SAVED: "/next-time/next-me",
    MISSION_RECOMMENDED: "/next-time/recommend",
    MISSION_STARTED: "/next-time/mission",
    MISSION_COMPLETED: "/next-time/record",
    RESULT_RECORDED: "/next-time/complete",
};

export const getNextTimePathByStatus = (status) =>
    NEXT_TIME_STATUS_PATHS[status] ?? NEXT_TIME_STATUS_PATHS.CREATED;

export const isNextTimeStatusAfter = (status, baselineStatus) => {
    const statusIndex = NEXT_TIME_STATUS_ORDER.indexOf(status);
    const baselineIndex = NEXT_TIME_STATUS_ORDER.indexOf(baselineStatus);
    return statusIndex !== -1 && baselineIndex !== -1 && statusIndex > baselineIndex;
};

const findContextOptionBy = (stepId, predicate) =>
    CONTEXT_STEPS.find((step) => step.id === stepId)?.options.find(predicate);

export const mapContextAnswersFromSession = (session) => ({
    situationIntensity:
        findContextOptionBy(
            "intensity",
            (option) => option.cravingBefore === session?.cravingBefore,
        )?.value ?? null,
    location:
        findContextOptionBy(
            "location",
            (option) =>
                option.contextId === session?.location?.id ||
                option.value === session?.location?.name,
        )?.value ?? null,
    moment:
        findContextOptionBy(
            "moment",
            (option) =>
                option.contextId === session?.trigger?.id ||
                option.value === session?.trigger?.name,
        )?.value ?? null,
});

export const mapMissionFromSession = (data) => {
    if (!data?.mission) return null;

    return {
        id: data.mission.id,
        code: data.mission.code,
        title: data.mission.name,
        description: data.reason ?? data.mission.description,
        missionDescription: data.mission.description,
        durationSeconds: data.mission.estimatedSeconds,
        whyThisText: data.reason,
        completionCriteria: data.mission.completionCriteria,
        source: data.source,
        recommendedAt: data.recommendedAt,
        startedAt: data.startedAt ?? data.missionStartedAt,
        status: data.status,
    };
};

export const mapRecommendedMission = (data) => mapMissionFromSession(data);

export const mapStartedMission = (data) => mapMissionFromSession(data);
