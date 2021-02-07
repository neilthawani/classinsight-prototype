// https://docs.google.com/document/d/149GjGurrfLc7j-SpZuNnah3Rrs8z3f9qUSNeMN1Hzsc/edit?ts=5f9c5c00
// New codes:
// G-Guide direction of dialogue or activity
// C-Connect
// E-Express or Invite Ideas
// I-
// EV-Evaluation
// B-Build on Ideas
// OT-Other Talk
// R-Make Reasoning Explicit
// P
// RD
// Invite Elaboration or Reasoning
// OST, OTT (below)

var legendLabels = [{
    type: "Teacher",
    value: "Metacognitive Modeling Questions",
    text: "Metacognitive",
    barColor: "#10273d",
    speakerType: "Teacher",
    textColor: "white",
    description: "Teacher models for students how they should think through a problem using questioning that is not responded to by students.",
    code: ""
}, {
    type: "Teacher",
    value: "Teacher Explanation + Evidence",
    text: "Explanation + Evidence",
    barColor: "#204e79",
    speakerType: "Teacher",
    textColor: "white",
    description: "Teacher models making connections to evidence. Like a student explanation + evidence code, teacher offers a modeled statement/example that includes reasoning grounded in a form of evidence. This might be anecdotal (an observation), scientific (pointing to the results of an experiment), a link to a resource previously reviewed in the class, etc.",
    code: ""
}, {
    type: "Teacher",
    value: "Teacher Open-Ended S/Q",
    text: "Open-Ended Questions",
    barColor: "#3075b5",
    speakerType: "Teacher",
    textColor: "white",
    description: "Teacher asks students to respond in a way that offers a range of possibilities for responding. These questions or statements work to solicit extended responses that make connections.",
    code: ""
}, {
    type: "Teacher",
    value: "Teacher Close-Ended S/Q",
    text: "Close-Ended Questions",
    barColor: "#5e9bd4",
    speakerType: "Teacher",
    textColor: "black",
    description: "Teacher asks students to respond in a way that provides limited possibilities for response (yes/no, known answer, fill in the blank). These questions are calls for recitation (correct answer) or calls for connection to previously taught content.",
    code: ""
}, {
    type: "Teacher",
    value: "Assorted Teacher Talk",
    text: "Other Talk",
    barColor: "#d7e6f4",
    speakerType: "Teacher",
    textColor: "black",
    code: "OTT"
}, {
    type: "Student",
    value: "Student Explanation + Evidence",
    text: "Explanation + Evidence",
    barColor: "#562810",
    speakerType: "Student",
    textColor: "white",
    description: "Students offer an open-ended response that includes reasoning grounded in a form of evidence. This might be anecdotal (an observation), scientific (pointing to the results of an experiment), a link to a resource previously reviewed in the class, etc.",
    code: ""
}, {
    type: "Student",
    value: "Student Open-Ended S/Q",
    text: "Open-Ended Questions",
    barColor: "#97471c",
    speakerType: "Student",
    textColor: "white",
    code: ""
}, {
    type: "Student",
    value: "Student Open-Ended Response",
    text: "Open-Ended Response",
    barColor: "#d76528",
    speakerType: "Student",
    textColor: "white",
    description: "Students provide elaborated responses that move beyond what has been covered previously in the class/\"correct answer\" recitation.",
    code: ""
}, {
    type: "Student",
    value: "Student Close-Ended S/Q",
    text: "Close-Ended Questions",
    barColor: "#e39368",
    speakerType: "Student",
    textColor: "black",
    code: ""
}, {
    type: "Student",
    value: "Student Close-Ended Response",
    text: "Close-Ended Response",
    barColor: "#efc1a9",
    speakerType: "Student",
    textColor: "black",
    description: "Students respond with yes/no or known answer response.",
    code: ""
}, {
    type: "Student",
    value: "Assorted Student Talk",
    text: "Other Talk",
    barColor: "#fbf0e9",
    speakerType: "Student",
    textColor: "black",
    code: "OST"
}, {
    type: "Technique",
    value: "Turn-Taking Facilitation",
    text: "Turn-Taking Facilitation",
    barColor: "#daacec",
    speakerType: "Teacher",
    textColor: "black",
    description: "Teacher directs a question to a specific student.",
    code: ""
}, {
    type: "Technique",
    value: "Re-Voicing",
    text: "Re-Voicing",
    barColor: "#a22fd0",
    speakerType: "Teacher",
    textColor: "white",
    description: "Teacher restates/summarizes/rephrases/elaborates on a student response.",
    code: ""
}, {
    type: "Technique",
    value: "Behavior Management Questions",
    text: "Behavior Management",
    barColor: "#411353",
    speakerType: "Teacher",
    textColor: "white",
    description: "This code is applied when a teacher asks a question that is managing behavior and/or task completion.",
    code: ""
}, {
    type: "Teacher",
    value: "Video",
    text: "Video",
    barColor: "#29CB97",
    speakerType: "Teacher",
    textColor: "black",
    description: "",
    code: ""
}];

export default legendLabels;
