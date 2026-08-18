import axiosInstance from "./axiosInstance";
import { getHome } from "./home";
import { CONTEXT_STEPS } from "../data/nextTimeSteps";
import { FEEDBACK_MAX_LENGTH, RECORD_OPTIONS } from "../data/nextTimeRecord";

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

export const unwrapNextTimePayload = (payload) => {
    if (!payload || typeof payload !== "object") return payload;
    if (payload.mission || payload.sessionId || payload.status) return payload;
    if (payload.data && typeof payload.data === "object") return payload.data;
    return payload;
};

export const generateFutureVoice = async (sessionId) => {
    const startedAt = performance.now();
    const withElapsed = (payload) => ({
        ...payload,
        elapsedMs: Math.round(performance.now() - startedAt),
    });

    try {
        const response = await axiosInstance.post(
            `/next-time/sessions/${sessionId}/future-voice`,
        );
        return withElapsed(response.data.data);
    } catch (error) {
        const existing = unwrapNextTimePayload(error?.response?.data?.data);
        if (error?.response?.status === 409 && existing) {
            return withElapsed(existing);
        }
        throw error;
    }
};

export const getNextTimeRecommendation = async (sessionId) => {
    try {
        const response = await axiosInstance.post(
            `/next-time/sessions/${sessionId}/recommendation`,
        );
        return unwrapNextTimePayload(response.data.data);
    } catch (error) {
        const existing = unwrapNextTimePayload(error?.response?.data?.data);
        if (error?.response?.status === 409 && existing?.mission) {
            return existing;
        }
        throw error;
    }
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

export const skipNextTimeMission = async (sessionId) => {
    const response = await axiosInstance.post(
        `/next-time/sessions/${sessionId}/mission/skip`,
    );
    return response.data.data;
};

const findRecordOption = (fieldId, value) =>
    RECORD_OPTIONS[fieldId]?.options.find((option) => option.value === value);

export const buildNextTimeResultBody = ({
    howDidYouDo,
    currentIntensity,
    missionFeedback,
    additionalNote,
}) => {
    const body = {
        result: findRecordOption("howDidYouDo", howDidYouDo)?.result,
        cravingAfter: findRecordOption("currentIntensity", currentIntensity)
            ?.cravingAfter,
        missionHelpfulness: findRecordOption("missionFeedback", missionFeedback)
            ?.missionHelpfulness,
    };

    const feedback = additionalNote?.trim();
    if (feedback) {
        body.feedback = feedback.slice(0, FEEDBACK_MAX_LENGTH);
    }

    return body;
};

export const saveNextTimeResult = async (sessionId, body) => {
    const response = await axiosInstance.post(
        `/next-time/sessions/${sessionId}/result`,
        body,
    );
    return response.data.data;
};

export const NEXT_TIME_STATUS_ORDER = [
    "CREATED",
    "CONTEXT_SAVED",
    "MISSION_RECOMMENDED",
    "MISSION_STARTED",
    "MISSION_COMPLETED",
    "RESULT_RECORDED",
];

export const NEXT_TIME_STATUS_PATHS = {
    CREATED: "/next-time/context",
    CONTEXT_SAVED: "/next-time/next-me",
    MISSION_RECOMMENDED: "/next-time/recommend",
    MISSION_STARTED: "/next-time/mission",
    MISSION_COMPLETED: "/next-time/record",
    RESULT_RECORDED: "/next-time/complete",
    CANCELLED: "/main",
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
    const payload = unwrapNextTimePayload(data);
    if (!payload?.mission) return null;

    return {
        id: payload.mission.id,
        code: payload.mission.code,
        title: payload.mission.name,
        description: payload.reason ?? payload.mission.description,
        missionDescription: payload.mission.description,
        durationSeconds: payload.mission.estimatedSeconds,
        whyThisText: payload.reason,
        completionCriteria: payload.mission.completionCriteria,
        source: payload.source,
        recommendedAt: payload.recommendedAt,
        startedAt: payload.startedAt ?? payload.missionStartedAt,
        status: payload.status,
    };
};

export const mapRecommendedMission = (data) => mapMissionFromSession(data);

export const mapStartedMission = (data) => mapMissionFromSession(data);
