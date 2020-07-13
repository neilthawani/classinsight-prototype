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
let allData = [];
let rects = [];
let canvas;
let lookup;
let tooltip;
let eraseAndDraw = true;

const h = 10;
const multiplier = 6;
const strokeW = 2;

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
        // dispText = dispText.replace(
        //     "Turn-Taking Facilitation",
        //     "Motivate student"
        // );

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
            fill(10);
            textAlign(LEFT);
            text(dispText, 60, y + 10);
        } else {
            if (iter === numTeacher) y = height;
            // colored box
            rect(canvas.width - 60, y, h, h);
            // legend text
            fill(10);
            textAlign(RIGHT);
            text(dispText, canvas.width - 70, y + 10);
        }
        iter++;
        y += h + 3;
    }
}

function setup() {
    // get the first relevant segment
    //data = data.segments[0].speaking_turns;

    // calculate the amount of time each speaker takes
    for (const seg of data[0].data.segments) {
        if (seg.participation_type !== "Other") {
            const turn = seg.speaking_turns;

            for (const talk of turn) {
                //  console.log(talk);

                for (const utterance of talk.utterances) {
                    // categorize student and teacher talk for talk that has no utterance types
                    if (
                        utterance.utterance_type.length > 0 &&
                        (utterance.utterance_type[0].includes("Teacher") ||
                            utterance.utterance_type[0].includes("Turn") ||
                            utterance.utterance_type[0].includes(
                                "Re-Voicing"
                            ) ||
                            utterance.utterance_type[0].includes("Questions"))
                    ) {
                        allData.push({
                            content: utterance.utterance,
                            speaker: talk.speaker_pseudonym,
                            length: utterance.n_tokens,
                            types: utterance.utterance_type,
                            time: utterance.timestamp,
                            right: false,
                        });
                    } else if (utterance.utterance_type.length === 0) {
                        if (
                            talk.speaker_pseudonym.includes("Class") ||
                            talk.speaker_pseudonym.includes("Student")
                        ) {
                            allData.push({
                                content: utterance.utterance,
                                speaker: talk.speaker_pseudonym,
                                length: utterance.n_tokens,
                                types: ["Assorted Student Talk"],
                                time: utterance.timestamp,
                                right: true,
                            });
                        } else if (talk.speaker_pseudonym.includes("Teacher")) {
                            allData.push({
                                content: utterance.utterance,
                                speaker: talk.speaker_pseudonym,
                                length: utterance.n_tokens,
                                types: ["Assorted Teacher Talk"],
                                time: utterance.timestamp,
                                right: false,
                            });
                        }
                    } else {
                        allData.push({
                            content: utterance.utterance,
                            speaker: talk.speaker_pseudonym,
                            length: utterance.n_tokens,
                            types: utterance.utterance_type,
                            time: utterance.timestamp,
                            right: true,
                        });
                    }
                }
            }
        }
    }

    canvas = createCanvas(1200, 15000);
    noLoop();
    noStroke();
}

function draw() {
    if (eraseAndDraw) {
        clear();
        background(255);
        strokeWeight(strokeW);

        const center = canvas.width / 2;
        let y = 60;

        const getUpperCorner = (yPos, right, length) => {
            if (right) return { x: center + strokeW, y: yPos };
            else return { x: center - length - strokeW, y: yPos };
        };

        // draw the graphs
        for (const data of allData) {
            let length = multiplier * data.length;
            const pos = getUpperCorner(y, data.right, length);
            fill(colors[data.types[0]]);
            if (data.types.length > 1) {
                fill(colors[data.types[1]]);
                stroke(colors[data.types[0]]);
            } else {
                stroke(colors[data.types[0]]);
            }
            rect(pos.x, pos.y, length, h);

            // draw timestamp
            noStroke();
            fill(10);
            textSize(12);
            text(data.time, center + 200, pos.y + 12);

            y += h + strokeW * 2;
        }

        drawLegend(150);

        // label side
        let rightX = center + 100;
        let leftX = center - 200;
        textSize(18);
        textAlign(CENTER, CENTER);
        text("Teacher Talk", leftX, 30);
        text("Student Talk", rightX, 30);

        eraseAndDraw = false;
    }
}
