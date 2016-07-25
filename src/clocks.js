class Clock
{
    constructor(cm, ast)
    {
        this.prevBeat = -1;
        this.textMarker = undefined;
    }

    calcPosition(cm, acornPos)
    {
        if (acornPos < 0 || acornPos >= cm.getValue().length)
            throw new AnnotateException("Index out of bounds: " + acornPos);

        let pos = 0;
        let cmPos = undefined;

        //console.log("acornPos: " + acornPos);

        cm.eachLine(function(lineHandle)
        {
            if (cmPos != undefined) return;

            //console.log("line: " + cm.getLineNumber(lineHandle) + " | len: " + lineHandle.text.length + " | pos: " + pos);

            if (pos + lineHandle.text.length >= acornPos)
            {
                let lineNumber = cm.getLineNumber(lineHandle);
                cmPos = { line: lineNumber, ch: acornPos - pos};
            }
            else
            {
                pos += lineHandle.text.length + 1;
            }
        });

        if (pos >= cm.getValue().length)
            throw new AnnotateException("Unable to calculate acorn position");

        return cmPos;
    }

    clear()
    {
        if (this.textMarker)
        {
            this.textMarker.clear();
            this.textMarker = undefined;
        }
    }

    /*
     * beat - current beat within the measure
     * tick - current tick within the current beat
     * options - extra param to pass in extra info
     */
    tick(beat, tick, options)
    {
        this.prevBeat = beat;
    }
}

class ArrayClock extends Clock
{
    constructor(cm, ast, node)
    {
        super(cm, ast);

        //current array index
        this.index = -1;

        //will hold current selected
        this.currentMarker = undefined;

        this.nodeStart = this.calcPosition(cm, node.start);
        this.nodeEnd = this.calcPosition(cm, node.end);
        //console.log("start: ", nodeStart);
        //console.log("end: ", nodeEnd);

        let nd = document.createElement("span");
        nd.innerHTML = cm.getRange(this.nodeStart, this.nodeEnd);
        nd.className = "borderleft borderup borderright borderdown";

        this.text = cm.getRange(this.nodeStart, this.nodeEnd);
        this.startIndex = 0;
        this.endIndex = 0;

        //contains the entire array expression
        /*this.textMarker = cm.markText(this.nodeStart, this.nodeEnd,
        {
            clearOnEnter: true,
            replacedWith: nd
        });*/
    }

    tick(beat, tick)
    {
        if (this.prevBeat != beat)
        {
            if (this.currentMarker != undefined)
            {
                this.currentMarker.clear();
                this.currentMarker = undefined;
            }

            this.calcIndex();

            let start =
            {
                line: this.nodeStart.line,
                ch: this.nodeStart.ch + this.startIndex
            };
            let end =
            {
                line: this.nodeStart.line,
                ch: this.nodeStart.ch + this.endIndex
            };

            let nd = document.createElement("span");
            nd.innerHTML = cm.getRange(start, end);
            nd.className = "borderleftbright borderupbright borderrightbright borderdownbright";

            this.currentMarker = cm.markText(start, end,
                {
                    clearOnEnter: true,
                    replacedWith: nd
                }
            );
        }

        //call super tick at the end to update prev beat
        super.tick(beat, tick);
    }

    calcIndex()
    {
        this.startIndex = this.endIndex + 1;

        while (this.text.charAt(this.startIndex) == ' ')
            this.startIndex += 1;

        if (this.startIndex >= this.text.length)
            this.startIndex = 1;

        this.endIndex = this.text.indexOf(",", this.startIndex + 1);

        if (this.endIndex == -1)
            this.endIndex = this.text.length - 1;
    }
}


class FunctionExpressionClock extends Clock
{
    constructor(cm, ast, node)
    {
        super(cm, ast);


    }

    tick(beat, tick, options)
    {

    }
}
