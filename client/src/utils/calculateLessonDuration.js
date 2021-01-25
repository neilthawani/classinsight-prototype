var calculateLessonDuration = function(timeInSecs) {
    return new Date(timeInSecs * 1000).toISOString().substr(11, 8);
}

export default calculateLessonDuration;
