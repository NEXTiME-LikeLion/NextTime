package com.nextime.nexttime.domain;

public enum CravingChange {
    DECREASED,
    UNCHANGED,
    INCREASED;

    public static CravingChange between(CravingBefore before, CravingAfter after) {
        int beforeLevel = switch (before) {
            case LOW -> 1;
            case MEDIUM -> 2;
            case HIGH -> 3;
        };
        int afterLevel = switch (after) {
            case NONE -> 0;
            case LOW -> 1;
            case MEDIUM -> 2;
            case HIGH -> 3;
        };
        return afterLevel < beforeLevel
                ? DECREASED
                : afterLevel > beforeLevel ? INCREASED : UNCHANGED;
    }
}
