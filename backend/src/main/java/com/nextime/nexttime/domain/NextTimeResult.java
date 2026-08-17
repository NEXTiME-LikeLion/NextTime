package com.nextime.nexttime.domain;

public enum NextTimeResult {
    NOT_SMOKED(1),
    DELAYED(1),
    SMOKED(0);

    private final int score;

    NextTimeResult(int score) {
        this.score = score;
    }

    public int score() {
        return score;
    }
}
