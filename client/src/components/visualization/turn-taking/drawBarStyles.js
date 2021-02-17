// TODO: Delete this file.

import defineInitialStyle from './defineInitialStyle';

export default function drawBarStyles(item, areBarsSmall = false) {
    var isStudentData = item.speakerPseudonym.includes("Student"),
        isTeacherData = !item.speakerPseudonym.includes("Student"),
        initialStyle = defineInitialStyle(item);

    var barWidth = item.nTokens,
        barHeight = "14px";

    if (areBarsSmall) {
        barHeight = "12px";
    }

    var baseStyle = { height: barHeight },
        extendedStyle = { ...initialStyle, width: barWidth },
        teacherStyle = {},
        studentStyle = {};

    if (isTeacherData) {
        studentStyle = baseStyle;
        teacherStyle = { ...baseStyle, ...extendedStyle };
    }

    if (isStudentData) {
        studentStyle = { ...baseStyle, ...extendedStyle };
        teacherStyle = baseStyle;
    }

    return {
        teacherStyle: teacherStyle,
        studentStyle: studentStyle
    }
}
