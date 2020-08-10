// UI button class
export default class Button {
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
