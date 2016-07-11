class Clock
{
    constructor(cm, ast)
    {
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
        
        let nd = document.createElement("span");
        nd.innerHTML = cm.getRange(nodeStart, nodeEnd);
        nd.className = "borderLeft borderTop borderRight borderBottom";
        
        this.textMarker = cm.markText(nodeStart, nodeEnd,
        {
            clearOnEnter: true,
            replacedWith: nd
        });
    }
}
