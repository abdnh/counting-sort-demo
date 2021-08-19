class CountingSortData {
    constructor(offset, range, array, sorted = new Array(), count = new Array()) {
        this.offset = offset;
        this.range = range;
        this.array = Array.from(array);
        this.sorted = Array.from(sorted);
        this.count = Array.from(count);
    }
}

class CountingSortStep {
    constructor(data, callback) {
        this.data = data;
        this.callback = callback;
    }

    execute() {
        this.callback(this.data);
    }
}

class CountingSortDemo {

    constructor(array, ctx) {
        this.paused = false;
        this.setCanvasCtx(ctx);
        this.reset(array);
        this.sort();
    }

    setCanvasCtx(ctx) {
        this.ctx = ctx;
        ctx.font = 'bold 16px sans-serif';
    }

    registerStep(data, callback) {
        let step = new CountingSortStep(data, callback);
        this.steps.push(step);
    }

    next() {
        if (this.paused || this.currentStep >= this.steps.length) return false;

        let step = this.steps[this.currentStep];
        this.data = step.data;
        step.execute();
        this.currentStep++;

        return true;
    }

    undo() {
        if (this.currentStep <= 0) return;
        this.currentStep -= 2;
        if (this.currentStep >= 0) {
            this.next();
        } else {
            this.currentStep = 0;
        }
    }

    reset(array) {
        this.data = new CountingSortData(0, 0, array);
        this.steps = new Array();
        this.currentStep = 0;
    }

    pause() {
        this.paused = true;
    }

    resume() {
        this.paused = false;
    }

    finished() {
        return this.currentStep >= this.steps.length;
    }

    draw(
        markedElements = {
            array: undefined,
            sorted: undefined,
            count: undefined
        },
        statusText = []
    ) {
        const offsetX = 150;
        let offsetY = 50;
        const rectWidth = 30;
        const rectHeight = 30;
        const gapX = 20;
        const gapY = 100;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        function drawArray(label, array) {
            ctx.textAlign = 'left';
            ctx.fillText(getString(label), 10, offsetY + rectHeight / 2 + 5, offsetX - 10);
            ctx.textAlign = 'center';
            let j = 0;
            for (let i = 0; i < array.length; i++) {
                ctx.strokeStyle = 'black';
                if (offsetX + j * (rectWidth + gapX) + rectWidth > ctx.canvas.width) {
                    offsetY += rectHeight + gapY;
                    j = 0;
                }
                ctx.strokeRect(offsetX + j * (rectWidth + gapX), offsetY, rectWidth, rectHeight);
                if (array[i] != undefined && array[i] != null) {
                    ctx.fillText(array[i], offsetX + j * (rectWidth + gapX) + rectWidth / 2, offsetY + rectHeight / 2 + 5, rectWidth);
                    if (i == markedElements[label]) {
                        ctx.strokeStyle = 'red';
                        ctx.strokeRect(offsetX + j * (rectWidth + gapX), offsetY, rectWidth, rectHeight);
                    }
                }
                ctx.fillText(i, offsetX + j * (rectWidth + gapX) + rectWidth / 2, offsetY + rectHeight + 20, rectWidth);
                j++;
            }
        }

        drawArray("array", this.data.array);
        offsetY += gapY;
        drawArray("count", this.data.count);
        offsetY += gapY;
        drawArray("sorted", this.data.sorted);

        offsetY += gapY;
        ctx.save();
        ctx.textAlign = 'left';
        ctx.fillStyle = 'green';
        for (let text of statusText) {
            let y = offsetY + rectHeight / 2 + 5;
            if (y >= ctx.canvas.height) {
                this.warning = getString("canvasHeightWarning");
            }
            ctx.fillText(text, 10, y);
            offsetY += gapY / 2;
        }
        ctx.restore();
    }

    sort() {
        function getKey(item) {
            let key;
            if (typeof item === "number") {
                key = item;
            } else if (typeof item === "string") {
                key = item.codePointAt(0);
            } else {
                key = item.key;
            }
            return key;
        }
        let array = this.data.array;
        if (array.length <= 0) return;
        let offset = Number.MAX_SAFE_INTEGER;
        let max = Number.MIN_SAFE_INTEGER;
        for (let item of array) {
            let key = getKey(item);
            if (key < offset) {
                offset = key;
            }
            if (key > max) {
                max = key;
            }
        }
        let range = max - offset + 1;

        let offsetText = getString("countingSortOffset", offset);
        let rangeText = getString("countingSortRange", range);
        this.registerStep(new CountingSortData(offset, range, array), data => {
            this.draw({}, [
                offsetText, rangeText
            ]);
        });

        let count = new Array(range);
        count.fill(0);
        let sorted = new Array(array.length);

        for (let [i, item] of array.entries()) {
            let key = getKey(item) - offset;
            count[key]++;
            let statusText = getString("incrementCount", key);
            this.registerStep(new CountingSortData(offset, range, array, sorted, count), data => {
                this.draw({
                    array: i,
                    count: key,
                },
                    [
                        statusText
                    ]);
            });
        }

        for (let r = 0; r < range - 1; r++) {
            count[r + 1] += count[r];
            const statusText = getString("countingSortCalcPositions", r + 1);
            this.registerStep(new CountingSortData(offset, range, array, sorted, count), data => {
                this.draw({
                    count: r + 1,
                },
                    [
                        statusText
                    ]);
            });
        }

        for (let [i, item] of array.entries()) {
            let key = getKey(item) - offset;
            count[key]--;
            sorted[count[key]] = item;
            let statusText = getString("countingSortStoringSorted", i, item, key, count[key]);
            this.registerStep(new CountingSortData(offset, range, array, sorted, count), data => {
                this.draw({
                    array: i,
                    count: key,
                    sorted: count[key],
                },
                    [
                        statusText
                    ]);
            });
        }

        this.registerStep(new CountingSortData(offset, range, array, sorted, count), data => {
            this.draw(
                {},
                [getString("countingSortDone")]
            );
        });

        return sorted;
    }
}
