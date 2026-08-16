package com.nextime.ai.copingprofile.domain;

public enum CopingAction {
    LEAVE_THE_PLACE("그 자리에서 벗어나기"),
    TAKE_A_WALK("잠깐 걷기"),
    DRINK_WATER("물 마시기"),
    BRUSH_OR_RINSE("양치하거나 입 헹구기"),
    GUM_OR_CANDY("껌이나 사탕 먹기"),
    STRETCH("짧게 스트레칭 하기"),
    CONTROL_BREATHING("호흡 가다듬기"),
    WASH_WITH_COLD_WATER("차가운 물로 손이나 얼굴 씻기"),
    LISTEN_TO_MUSIC("음악 듣기"),
    TALK_TO_SOMEONE("누군가와 이야기하기"),
    HIDE_CIGARETTES("담배를 눈에 안 보이게 두기"),
    OTHER("직접 입력");

    private final String label;

    CopingAction(String label) {
        this.label = label;
    }

    public String label() {
        return label;
    }
}
