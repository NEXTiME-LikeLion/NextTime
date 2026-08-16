package com.nextime.nexttime.domain;

public enum MissionHelpfulness {
    HELPFUL(2),
    NEUTRAL(0),
    NOT_FIT(-2);

    private final int score;

    MissionHelpfulness(int score) {
        this.score = score;
    }

    public int score() {
        return score;
    }
}
