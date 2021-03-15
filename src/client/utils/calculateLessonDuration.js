var calculateLessonDuration = function(timeInSecs) {
    return new Date(timeInSecs * 1000).toISOString().substr(11, 8);
}

// example: var hms = '02:04:33';
var convertTimestampToSeconds = function(hms) {
    var a = hms.split(':'); // split it at the colons

    if (a.length < 3) {
        var timesToUnshift = 3 - a.length;

        while (timesToUnshift) {
            a.unshift("00");
            timesToUnshift--;
        }
    }

    // minutes are worth 60 seconds. Hours are worth 60 minutes.
    var seconds = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]);

    return seconds;
}

export { calculateLessonDuration, convertTimestampToSeconds };
