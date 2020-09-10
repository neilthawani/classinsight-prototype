import LegendLabels from '../../../fixtures/legend_labels';

var legendLabels = LegendLabels;

export default function(item, isCollapsed = false) {
    var isStudentData = item.speaker.includes("Student"),
        isTeacherData = item.speaker === "Teacher";

    var legendLabelValue = item.types[item.types.length - 1];
    var barColor = legendLabels.find(item => item.value === legendLabelValue).color;
    var barBorder = "";
    var boxSizing = "";
    if (item.types.length > 1) { // if it has multiple types, draw a border around the bar
        var borderValue = item.types && item.types[0];
        barBorder = `3px solid ${legendLabels.find(item => item.value === borderValue)}.color`;
        boxSizing = "border-box";
    }

    var barWidth = item.length,
        barHeight = "14px";

    if (isCollapsed) {
        barHeight = "3px";
    }

    var baseStyle = { height: barHeight },
        extendedStyle = { backgroundColor: barColor, border: barBorder, boxSizing: boxSizing, width: barWidth },
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
