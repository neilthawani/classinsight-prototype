// for this file, the data we're after is in data.segments[0].speaking_turns.
// Each object in this array is a record of someone speaking. It has this
// structure:
/*
{
    duration: 0
    end_time: "[00:00:00;23]",
​​​​    initial_time: "[00:00:00;23]",
    speaker_pseudonym: "Teacher",
    tokens_per_second: 0,
​​​​​    total_tokens: 108,
​​​​​    utterances: [],
},
​​​​​*/
// Utterances is an array of objects that contain information about what
// was said. Each object in the array has this structure:
/*
    line_number: "8",
​​​​​​​    n_tokens: 14,
​​​​​​​​    timestamp: "",
​​​​​​​​    utterance: "Ok, so what is it that you though- ...",
    utterance_type: [ " Teachers  Open-Ended  Statements/Question (S/Q)" ]
*/
//let data;
let allData = {};
let canvas;
let totalStudent = 0;
let totalTeacher = 0;

const black = 10;
const multiplier = 500;

const colors = {
    "Metacognitive Modeling Questions": "#10273d",
    "Teacher Explanation + Evidence": "#204e79",
    "Teacher Open-Ended S/Q": "#3075b5",
    "Teacher Close-Ended S/Q": "#5e9bd4",
    "Assorted Teacher Talk": "#d7e6f4",

    "Turn-Taking Facilitation": "#daacec",
    "Re-Voicing": "#a22fd0",
    "Behavior Management Questions": "#411353",

    "Student Explanation + Evidence": "#562810",
    "Student Open-Ended S/Q": "#97471c",
    "Student Open-Ended Response": "#d76528",
    "Student Close-Ended S/Q": "#e39368",
    "Student Close-Ended Response": "#efc1a9",
    "Assorted Student Talk": "#fbf0e9",
};

const drawOrder = [
    "Assorted Teacher Talk",
    "Teacher Close-Ended S/Q",
    "Teacher Open-Ended S/Q",
    "Teacher Explanation + Evidence",
    "Metacognitive Modeling Questions",
    "Student Explanation + Evidence",
    "Student Open-Ended S/Q",
    "Student Open-Ended Response",
    "Student Close-Ended S/Q",
    "Student Close-Ended Response",
    "Assorted Student Talk",
    "Turn-Taking Facilitation",
    "Re-Voicing",
    "Behavior Management Questions",
];

function drawLegend(height) {
    const h = 22;
    const numTeacher = 8;
    const numModifiers = 3;
    let y = height;
    textSize(12);
    noStroke();
    let iter = 0;
    for (const key in colors) {
        let fillColor = colors[key];
        fill(fillColor);

        let dispText = key;
        dispText = dispText.replace("Teacher", "");
        dispText = dispText.replace("Student", "");
        dispText = dispText.replace("Questions", "");
        dispText = dispText.replace("Assorted  Talk", "Other talk");
        dispText = dispText.replace("Modeling", "");
        dispText = dispText.replace("S/Q", "Questions");

        let dispPercent;
        // show percentage for each type
        if (allData[key] !== undefined) {
            const percent =
                (allData[key] / (totalTeacher + totalStudent)) * 100;
            dispPercent = percent < 1 ? "<1" : Math.round(percent);
        } else {
            dispPercent = "0";
        }

        let rightLegendWidth = 270;

        // draw legends
        if (iter < numTeacher) {
            if (iter >= numTeacher - numModifiers) {
                // if the flavor is a modifier, draw the color on the bottom
                fillColor = 220;
                fill(fillColor);
                rect(30, y, h, h);
                fill(colors[key]);
                rect(30, y + h - 5, h, 5);
            } else {
                rect(30, y, h, h);
            }

            // switch the text color if the background color is too dark
            if (lightness(fillColor) < 60) fill(255);
            else fill(0);
            textAlign(CENTER, CENTER);
            text(dispPercent, 30, y, h + 3, h);
            fill(10);
            textAlign(LEFT);
            text(dispText, 60, y + 10);
        } else {
            if (iter === numTeacher) y = height;

            // colored box
            rect(canvas.width - 60, y, h, h);
            // percentage inside box
            // switch the text color if the background color is too dark
            if (lightness(fillColor) < 60) fill(255);
            else fill(0);
            textAlign(CENTER, CENTER);
            text(dispPercent, canvas.width - 60, y, h + 3, h);
            // legend text
            fill(10);
            textAlign(RIGHT);
            text(dispText, canvas.width - 70, y + 10);
        }
        iter++;
        y += h + 3;
    }
}

function classifyUtteranceType(talk) {
    if (
        talk.speaker_pseudonym.includes("Class") ||
        talk.speaker_pseudonym.includes("Student")
    ) {
        return "Assorted Student Talk";
    } else if (talk.speaker_pseudonym.includes("Teacher")) {
        return "Assorted Teacher Talk";
    }
    return "Unknown";
}

function setup() {
    for (const seg of data[0].data.segments) {
        if (seg.participation_type !== "Other") {
            const turn = seg.speaking_turns;

            for (const talk of turn) {

                for (let i = 0; i < talk.utterances.length; i++) {
                    const utterance = talk.utterances[i];
                    // calculate amount of time utterance took, might want to use the timestamp to more accurately calc
                    const utteranceDur = talk.tokens_per_second * utterance.n_tokens;
                    let firstFlavor = true;

                    // if the utterance is unclassified with a flavor, determine if it's assorted student or teacher talk
                    if (utterance.utterance_type.length === 0) {
                        if (talk.speaker_pseudonym.includes("Class") || talk.speaker_pseudonym.includes("Student")) {
                            if (allData["Assorted Student Talk"]) {
                                allData["Assorted Student Talk"] += utteranceDur;
                            } else {
                                allData["Assorted Student Talk"] = utteranceDur;
                            }

                            totalStudent += utteranceDur;
                        } else if (talk.speaker_pseudonym.includes("Teacher")) {
                            if (allData["Assorted Teacher Talk"]) {
                                allData[
                                    "Assorted Teacher Talk"
                                ] += utteranceDur;
                            } else {
                                allData["Assorted Teacher Talk"] = utteranceDur;
                            }
                            totalTeacher += utteranceDur;
                        }
                    }

                    // if there are many utterance types, loop through and add the total to each
                    for (const flavor of utterance.utterance_type) {
                        let newFlavor = flavor;

                        // when the flavor is a modifer, check the prev utterance type for the main flavor to add to
                        if ((flavor === "Turn-Taking Facilitation" || flavor === "Re-Voicing" || flavor === "Behavior Management Questions") && talk.speaker_type !== "student") {
                            let prevUtterance = talk.utterances[i - 1];
                            let classifier;

                            if (prevUtterance === undefined || prevUtterance.utterance_type.length === 0) {
                                // classify
                                classifier = classifyUtteranceType(talk);
                            } else {
                                classifier = prevUtterance.utterance_type[0];
                            }

                            newFlavor = classifier + "&&" + flavor;

                            // add the time to the modifier's time as well
                            if (allData[flavor]) {
                                allData[flavor] += utteranceDur;
                            } else {
                                allData[flavor] = utteranceDur;
                            }
                        }

                        if (allData[newFlavor]) {
                            allData[newFlavor] += utteranceDur;
                        } else {
                            allData[newFlavor] = utteranceDur;
                        }

                        // don't double count the overall student/teacher duration
                        if (firstFlavor && flavor !== "Turn-Taking Facilitation" && flavor !== "Re-Voicing" && flavor !== "Behavior Management Questions") {
                            if (flavor.includes("Student")) {
                                totalStudent += utteranceDur;
                            } else {
                                totalTeacher += utteranceDur;
                            }
                            //   firstFlavor = false;
                        }
                    }
                }
            }
        }
    }

    canvas = createCanvas(1200, 400);
    background(255);
    noLoop();
    noStroke();
}

function draw() {
    const center = canvas.width / 2;
    const graphHeight = 50;

    let y = 60;
    textSize(12);

    // draw the bar behind the graphs
    fill(black);
    rect(center - 1, 10, 2, 100);

    const percentTeacher = totalTeacher / (totalTeacher + totalStudent);
    const percentStudent = totalStudent / (totalTeacher + totalStudent);
    let xPos = center - percentTeacher * multiplier;

    // obj to store where the rects for each flavor are drawn.
    let drawPos = {};

    // draw the graphs and legend
    for (const flavor of drawOrder) {
        // if there's data for this utterance type, draw it on the graph
        if (allData[flavor] !== undefined) {
            if (flavor !== "Turn-Taking Facilitation" && flavor !== "Re-Voicing" && flavor !== "Behavior Management Questions") {
                // draw the flavor's bar on the graph
                fill(colors[flavor]);
                const avg = allData[flavor] / (totalTeacher + totalStudent);
                rect(xPos, 30, multiplier * avg, graphHeight);

                xPos += multiplier * avg;
                // record the drawing position for later if we want to come back and draw a modifier line under it
                drawPos[flavor] = xPos;
            } else {
                // the flavor is a modifier, find the combination(s) in allData and draw lines under the relevant sections of the graph
                for (const flavorCombo in allData) {
                    //      console.log(flavorCombo);
                    if (flavorCombo.includes("&&") && flavorCombo.split("&&")[1] === flavor) {
                        const firstFlavor = flavorCombo.split("&&")[0];
                        const modifier = flavorCombo.split("&&")[1];

                        let firstFlavorPos = drawPos[firstFlavor];
                        fill(colors[modifier]);
                        const firstFlavorAvg = allData[firstFlavor] / (totalTeacher + totalStudent);
                        const modifierAvg = allData[flavor] / (totalTeacher + totalStudent);
                        const modifierAvgOfFirst = firstFlavorAvg * modifierAvg;

                        rect(
                            drawPos[firstFlavor] - multiplier * modifierAvgOfFirst,
                            30 + graphHeight - 5,
                            multiplier * modifierAvgOfFirst,
                            5
                        );

                        // remove the bar size from the position so the next modifier isn't drawn over
                        drawPos[firstFlavor] -= multiplier * modifierAvgOfFirst;
                    }
                }
            }
        }
    }

    fill(black);
    textSize(18);
    // // each section percent label
    // text(`${Math.round(percentStudent * 100)}%`, xPos + 15, 80);
    // text(
    //     `${Math.round(percentTeacher * 100)}%`,
    //     center - percentTeacher * multiplier - 50,
    //     80
    // );

    // label top
    let rightX = center + 100;
    let leftX = center - 200;

    textAlign(LEFT);
    text(
        `${Math.round(percentTeacher * 100)}% Teacher`,
        leftX,
        graphHeight * 2 + 10,
        200,
        200
    );
    textAlign(LEFT);
    text(
        `Student ${Math.round(percentStudent * 100)}%`,
        rightX,
        graphHeight * 2 + 10,
        200,
        200
    );

    drawLegend(150);
}
