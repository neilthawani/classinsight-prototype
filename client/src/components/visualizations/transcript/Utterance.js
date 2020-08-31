import Colors from '../../../fixtures/colors';
import Labels from '../../../fixtures/labels';

const colors = Colors;
const labels = Labels;

export default class Utterance {
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
        this.elt = elt;

        // might need to check this if the secondary type is not a modified type
        // checked this and it works for when the second type is the main type and first is the modifier
        if (labels.Technique.includes(primaryType)) {
            this.strokeColor = colors[primaryType];
            secondaryType !== undefined ? (this.color = colors[secondaryType]) : (this.color = "#FFF");
        } else if (secondaryType !== undefined && labels.Technique.includes(secondaryType)) {
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
            if (this.selected && this.p5.lightness(this.color) < 60)
                this.elt.style.color = "#FFF";
            else this.elt.style.color = "#000";
        } else {
            this.elt.style.color = "#999";
        }
    }
}
