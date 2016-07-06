class Clock
{
    constructor(cm, ast)
    {

    }

    calcPosition(cm, acornPos)
    {
        if (acornPos < 0 || acornPos >= cm.getValue().length)
            throw new AnnotateException("Index out of bounds: " + acornPos);

        let pos = 0;
        let cmPos = undefined;

        console.log("acornPos: " + acornPos);

        cm.eachLine(function(lineHandle)
        {
            if (cmPos != undefined) return;

            console.log("pos: " + pos + " | len: " + lineHandle.text.length + " | line: " + cm.getLineNumber(lineHandle));

            if (pos + lineHandle.text.length >= acornPos)
            {
                console.log("set cmPos");
                let lineNumber = cm.getLineNumber(lineHandle);
                cmPos = { line: lineNumber, ch: acornPos - pos - lineNumber};
            }
            else
            {
                pos += lineHandle.text.length;
            }
        });

        if (pos >= cm.getValue().length)
            throw new AnnotateException("Unable to calculate acorn position");

        return cmPos;
    }

    tick(beat, tick)
    {

    }
}

class ArrayClock extends Clock
{
    constructor(cm, ast, node)
    {
        super(cm, ast);

        let nodeStart = this.calcPosition(cm, node.start);
        let nodeEnd = this.calcPosition(cm, node.end);
        console.log("start: ", nodeStart);
        console.log("end: ", nodeEnd);

        cm.markText(nodeStart, nodeEnd, { className: "" });
    }
}
