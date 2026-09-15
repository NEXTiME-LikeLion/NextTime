import actionWalk from "../../assets/pattern/action-walk.png";
import actionWater from "../../assets/pattern/action-water.png";
import actionBreathe from "../../assets/pattern/action-breathe.png";
import actionStretch from "../../assets/pattern/action-stretch.png";
import actionMusic from "../../assets/pattern/action-music.png";
import actionLeave from "../../assets/pattern/action-leave.png";
import actionBrush from "../../assets/pattern/action-brush.png";
import actionGum from "../../assets/pattern/action-gum.png";
import actionColdWater from "../../assets/pattern/action-cold-water.png";
import actionTalk from "../../assets/pattern/action-talk.png";
import actionHide from "../../assets/pattern/action-hide.png";

export const ACTION_IMAGE_MAP = {
    SHORT_WALK: actionWalk,
    DRINK_WATER: actionWater,
    STEADY_BREATHING: actionBreathe,
    SHORT_STRETCHING: actionStretch,
    LISTEN_TO_MUSIC: actionMusic,
    LEAVE_THE_SPOT: actionLeave,
    BRUSH_OR_RINSE: actionBrush,
    GUM_OR_CANDY: actionGum,
    COLD_WATER: actionColdWater,
    TALK_TO_SOMEONE: actionTalk,
    HIDE_TOBACCO: actionHide,
};

export const getActionImage = (code) => ACTION_IMAGE_MAP[code] ?? null;