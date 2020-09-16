export default function() {
    var navbarHeight = document.getElementsByClassName("navbar")[0].getBoundingClientRect().height; // 75
    var scriptBoundingRect = document.getElementsByClassName("script-turn-container")[0].getBoundingClientRect();
    var scriptBoundingRectDistanceFromWindowTop = scriptBoundingRect.top;
    var topY = scriptBoundingRectDistanceFromWindowTop;

    if (scriptBoundingRectDistanceFromWindowTop < navbarHeight) {
        topY = navbarHeight;
    }

    var middleX = (scriptBoundingRect.right - scriptBoundingRect.left) / 2;
    var bottomY = window.innerHeight - 5;

    var topEl = document.elementFromPoint(middleX, topY);
    var bottomEl = document.elementFromPoint(middleX, bottomY);
    var topElId = topEl.parentElement.getAttribute('data-attr-utterance-id');// || this.state.topElId;
    var bottomElId = bottomEl.parentElement.getAttribute('data-attr-utterance-id');// || this.state.bottomElId;

    if (parseInt(topElId, 10) > parseInt(bottomElId, 10)) { // !topElId might evaluate to 0 too...
        topElId = 0;
    }

    return {
        topElId: topElId,
        bottomElId: bottomElId
    }
}
