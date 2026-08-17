package com.nextime.ai.nextme.domain;

public enum ChangeReason {
    HEALTH_FITNESS("체력·건강"),
    FAMILY_PEOPLE("가족·사람"),
    COST("비용"),
    FREEDOM("자유"),
    SMELL_APPEARANCE("냄새·외모"),
    PREGNANCY_CHILD("임신·아이"),
    HOBBY_DAILY("취미·일상"),
    OTHER("직접 입력");

    private final String label;

    ChangeReason(String label) {
        this.label = label;
    }

    public String label() {
        return label;
    }
}
