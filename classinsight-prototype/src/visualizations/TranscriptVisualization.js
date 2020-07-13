// UI button class
class Button {
    constructor(x, y, w, h, content, display, color, strokeColor) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.c = content;
        this.display = display;
        this.col = color;
        this.stroke = strokeColor;
        this.strokeWeight = 3;
        this.clicked = false;
        this.clickable = true;
        this.enabled = false;
        this.onClickedFunc = () => {};
    }

    setP5Instance(instance) {
        this.p5 = instance;
    }

    draw() {
        this.p5.stroke(this.stroke);
        this.p5.strokeWeight(this.strokeWeight);
        this.p5.fill(this.col);
        this.p5.rect(
            this.x,
            this.y,
            this.w - this.strokeWeight,
            this.h - this.strokeWeight
        );
        this.p5.noStroke();

        if (this.enabled && this.p5.lightness(this.col) < 60) this.p5.fill(255);
        else this.p5.fill(0);
        this.p5.textAlign(this.p5.LEFT, this.p5.CENTER);
        this.p5.text(
            this.display,
            this.x + 20,
            this.y,
            this.w - this.strokeWeight,
            this.h - this.strokeWeight
        );

        if (
            this.p5.mouseX >= this.x &&
            this.p5.mouseY >= this.y &&
            this.p5.mouseX < this.x + this.w &&
            this.p5.mouseY < this.y + this.h
        ) {
            if (this.clickable) this.p5.cursor("pointer");
            else this.p5.cursor("arrow");

            if (this.p5.mouseIsPressed && !this.clicked) {
                this.clicked = true;
                this.onClickedFunc();
            } else if (!this.p5.mouseIsPressed && this.clicked) {
                this.clicked = false;
            }
        }
    }

    onPress(f) {
        this.onClickedFunc = f;
    }
}

class Utterance {
    constructor(x, y, content, primaryType, secondaryType, id) {
        this.c = content;
        this.t1 = primaryType;
        this.t2 = secondaryType;
        this.x = x;
        this.y = y;
        this.selected = false;
        this.outlined = false;
        this.color = colors[primaryType];
        this.strokeColor = "#FFF";
        this.addedToDOM = false;
        this.id = id;

        const elt = document.createElement("div");
        const text = document.createTextNode(content);
        elt.appendChild(text);
        elt.id = id;
        elt.style.position = "absolute";
        elt.style.top = `${y}px`;
        elt.style.left = `${x}px`;
        elt.style.width = "900px";
        elt.style.paddingLeft = "4px";
        elt.style.border = "2px solid transparent";
        this.elt = elt;

        // might need to check this if the secondary type is not a modified type
        // checked this and it works for when the second type is the main type and first is the modifier
        if (labels.Technique.includes(primaryType)) {
            this.strokeColor = colors[primaryType];
            secondaryType !== undefined
                ? (this.color = colors[secondaryType])
                : (this.color = "#FFF");
        } else if (
            secondaryType !== undefined &&
            labels.Technique.includes(secondaryType)
        ) {
            this.strokeColor = colors[secondaryType];
        }
    }

    setP5Instance(instance) {
        this.p5 = instance;
    }

    draw() {
        if (!this.addedToDOM) {
            document.getElementById("transcript").appendChild(this.elt);
            this.addedToDOM = true;
        }
        if (this.selected) {
            this.elt.style.backgroundColor = this.color;
        } else {
            this.elt.style.backgroundColor = "transparent";
        }
        if (this.outlined) {
            this.elt.style.border = `2px solid ${this.strokeColor}`;
        } else {
            this.elt.style.border = "2px solid transparent";
        }

        if (this.t1 !== undefined) {
            //console.log(this);
            if (this.selected && this.p5.lightness(this.color) < 60)
                this.elt.style.color = "#FFF";
            else this.elt.style.color = "#000";
        } else {
            this.elt.style.color = "#999";
        }
    }
}

let prevLoc = 0;
let allData = [];
let formattedData = [];
let redraw = true;
let totalTeacher = 0;
let totalStudent = 0;

let percentScrolled = 0;

// set the background color or outline of an utterance
function setUtterances(type, rev) {
    for (const turn of allData) {
        for (const utter of turn.utterances) {
            if (utter.t1 === type || utter.t2 === type) {
                const outline = labels.Technique.includes(type);
                //  console.log(outline);
                if (rev !== undefined && rev === true) {
                    outline
                        ? (utter.outlined = false)
                        : (utter.selected = false);
                } else {
                    outline ? (utter.outlined = true) : (utter.selected = true);
                }
            }
        }
    }
}

function unsetUtterances(type) {
    setUtterances(type, true);
}

let buttons = [];
const buttonColor = 240;

// set up two p5 instances, one for the key and one for the transcript
////////////////////////////////////////////////////////////////////////////////
// key instance
const s1 = (sketch) => {
    sketch.setup = () => {
        // this function processes the data in the same way as Viz 1 to get the
        // overall quantities for each category
        aggregateData(data[0].data);

        let y = 0;
        const size = { h: 45, w: 200 };

        // drawing labels for conversation type
        for (const label in labels) {
            const actions = labels[label];

            // labels (fake buttons)
            const button = new Button(
                0,
                y,
                size.w,
                size.h,
                label,
                label,
                "#B4B4B4",
                "#B4B4B4"
            );
            button.setP5Instance(sketch);
            button.clickable = false;
            buttons.push(button);
            y += size.h + 5;

            // clickable buttons for filtering conversation types
            for (const action of actions) {
                // change the labels (UCSD feedback 2/15)
                let dispText = action;
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

                let dispPercent;

                // console.log(formattedData[action]);

                // show percentage for each type
                if (formattedData[action] !== undefined) {
                    const percent =
                        (formattedData[action] /
                            (totalTeacher + totalStudent)) *
                        100;
                    dispPercent = percent < 1 ? "<1" : Math.round(percent);
                } else {
                    dispPercent = "0";
                }

                dispText += " (" + dispPercent + "%)";

                const button = new Button(
                    0,
                    y,
                    size.w,
                    size.h,
                    action,
                    dispText,
                    buttonColor,
                    buttonColor
                );
                button.setP5Instance(sketch);

                // when the button is pressed, highlight that utterance type
                button.onPress(() => {
                    if (button.enabled) {
                        button.enabled = false;
                        if (label === "Technique") {
                            button.stroke = buttonColor;
                        } else {
                            button.col = buttonColor;
                        }
                        unsetUtterances(button.c);
                    } else {
                        button.enabled = true;
                        if (label === "Technique") {
                            button.stroke = colors[action];
                        } else {
                            button.col = colors[action];
                        }
                        setUtterances(button.c);
                    }
                    redraw = true;
                });

                buttons.push(button);
                y += size.h + 5;
            }
        }

        // create a container for the key that's fixed
        const keyDiv = document.createElement("div");
        keyDiv.id = "key";
        keyDiv.style.position = "fixed";
        document.body.appendChild(keyDiv);

        const canvas = sketch.createCanvas(200, 900);
        canvas.parent("key");
        // createCanvas(1200, allData.length * (h + strokeW * 2) + 200);
        sketch.background(255);
        sketch.frameRate(60);
    };

    sketch.draw = () => {
        sketch.background(255);
        for (const button of buttons) {
            button.draw();
        }
    };
};

let h = 20;
////////////////////////////////////////////////////////////////////////////////
// transcript instance
const s2 = (sketch) => {
    let viz3Data = [];

    sketch.setup = () => {
        viz3Data = getDataForViz3(data[0].data);

        let strokeW = 0;
        let totalUtters = 0;
        y = 55;

        // creating the utterance lines
        for (const seg of data[0].data.segments) {
            if (seg.participation_type !== "Other") {
                const turn = seg.speaking_turns;

                for (const talk of turn) {
                    const speaker = talk.speaker_pseudonym;
                    let utters = [];

                    // each time there's a new speaker, add extra height to account for the speaker's name to be drawn
                    // create an utterance that's just for the speaker's name
                    y += h * 1.5;

                    const utterObj = new Utterance(
                        320,
                        y,
                        speaker,
                        undefined,
                        undefined,
                        "utter" + totalUtters
                    );

                    utters.push(utterObj);
                    totalUtters++;
                    y += h;

                    for (const utterance of talk.utterances) {
                        let types = utterance.utterance_type;
                        if (types.length === 0) {
                            if (talk.speaker_type === "student") {
                                types = ["Assorted Student Talk"];
                            } else types = ["Assorted Teacher Talk"];
                        }

                        //     console.log(utterance.utterance);

                        const utterObj = new Utterance(
                            320,
                            y,
                            utterance.utterance,
                            types[0],
                            types[1],
                            "utter" + totalUtters
                        );
                        utterObj.setP5Instance(sketch);
                        totalUtters++;

                        const multiplier =
                            Math.round(utterance.utterance.length / 100) === 0
                                ? 1
                                : Math.round(utterance.utterance.length / 100);

                        y += h * multiplier;

                        utters.push(utterObj);
                    }
                    allData.push({ speaker: speaker, utterances: utters });
                }
            }
        }

        // create a container for the transcript
        const transcriptDiv = document.createElement("div");
        transcriptDiv.id = "transcript";
        transcriptDiv.style.marginLeft = "300px";
        document.body.appendChild(transcriptDiv);
        document.body.style.fontFamily = "sans-serif";
        document.body.style.fontSize = "14px";

        // record the % scrolled
        window.addEventListener("scroll", function() {
            percentScrolled = window.scrollY / window.scrollMaxY;
        });

        const canvas = sketch.createCanvas(200, 900);
        canvas.parent("key");

        sketch.background(0);
    };

    sketch.draw = () => {
        sketch.background(255);
        if (redraw) {
            for (const turn of allData) {
                for (const utter of turn.utterances) {
                    utter.draw();
                }
            }
            redraw = false;
        }

        // constantly update the mini viz3 for elevator pos change
        drawViz3(viz3Data, sketch);
    };
};

let keySk = new p5(s1);
let transcriptSk = new p5(s2);

const multiplier = 1;
const strokeW = 0;

// data gathering from viz3
function getDataForViz3(data) {
    let allData = [];
    for (const seg of data.segments) {
        if (seg.participation_type !== "Other") {
            const turn = seg.speaking_turns;

            for (const talk of turn) {
                for (const utterance of talk.utterances) {
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
    return allData;
}

function drawViz3(allData, sketch) {
    const center = 50;
    let y = 0;
    h = 1;
    sketch.noStroke();

    const getUpperCorner = (yPos, right, length) => {
        if (right) return { x: center + strokeW, y: yPos };
        else return { x: center - length - strokeW, y: yPos };
    };

    // draw the graphs
    for (const data of allData) {
        let length = multiplier * data.length;
        const pos = getUpperCorner(y, data.right, length);
        sketch.fill(colors[data.types[0]]);
        if (data.types.length > 1) {
            sketch.fill(colors[data.types[1]]);
            //  sketch.stroke(colors[data.types[0]]);
        } else {
            // sketch.stroke(colors[data.types[0]]);
        }
        sketch.rect(pos.x, pos.y, length, h);

        y += h;
    }

    const pos = percentScrolled * y;

    sketch.fill(0, 0, 0, 0);
    sketch.stroke(0);
    sketch.strokeWeight(2);
    sketch.rect(0, pos, 100, 30);
}

// these functions are from viz1

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

function aggregateData(data) {
    for (const seg of data.segments) {
        if (seg.participation_type !== "Other") {
            const turn = seg.speaking_turns;

            for (const talk of turn) {
                for (let i = 0; i < talk.utterances.length; i++) {
                    const utterance = talk.utterances[i];
                    // calculate amount of time utterance took, might want to use the timestamp to more accurately calc
                    const utteranceDur =
                        talk.tokens_per_second * utterance.n_tokens;
                    let firstFlavor = true;

                    // if the utterance is unclassified with a flavor, determine if it's assorted student or teacher talk
                    if (utterance.utterance_type.length === 0) {
                        if (
                            talk.speaker_pseudonym.includes("Class") ||
                            talk.speaker_pseudonym.includes("Student")
                        ) {
                            if (formattedData["Assorted Student Talk"])
                                formattedData[
                                    "Assorted Student Talk"
                                ] += utteranceDur;
                            else
                                formattedData[
                                    "Assorted Student Talk"
                                ] = utteranceDur;
                            totalStudent += utteranceDur;
                        } else if (talk.speaker_pseudonym.includes("Teacher")) {
                            if (formattedData["Assorted Teacher Talk"])
                                formattedData[
                                    "Assorted Teacher Talk"
                                ] += utteranceDur;
                            else
                                formattedData[
                                    "Assorted Teacher Talk"
                                ] = utteranceDur;
                            totalTeacher += utteranceDur;
                        }
                    }

                    // if there are many utterance types, loop through and add the total to each
                    for (const flavor of utterance.utterance_type) {
                        let newFlavor = flavor;

                        // when the flavor is a modifer, check the prev utterance type for the main flavor to add to
                        if (
                            (flavor === "Turn-Taking Facilitation" ||
                                flavor === "Re-Voicing" ||
                                flavor === "Behavior Management Questions") &&
                            talk.speaker_type !== "student"
                        ) {
                            let prevUtterance = talk.utterances[i - 1];
                            let classifier;

                            if (
                                prevUtterance === undefined ||
                                prevUtterance.utterance_type.length === 0
                            ) {
                                // classify
                                classifier = classifyUtteranceType(talk);
                            } else {
                                classifier = prevUtterance.utterance_type[0];
                            }

                            newFlavor = classifier + "&&" + flavor;

                            // add the time to the modifier's time as well
                            if (formattedData[flavor]) {
                                formattedData[flavor] += utteranceDur;
                            } else {
                                formattedData[flavor] = utteranceDur;
                            }
                        }

                        if (formattedData[newFlavor]) {
                            formattedData[newFlavor] += utteranceDur;
                        } else {
                            formattedData[newFlavor] = utteranceDur;
                        }

                        // don't double count the overall student/teacher duration
                        if (
                            firstFlavor &&
                            flavor !== "Turn-Taking Facilitation" &&
                            flavor !== "Re-Voicing" &&
                            flavor !== "Behavior Management Questions"
                        ) {
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
}
