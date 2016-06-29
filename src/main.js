const EXAMPLE_CODE = "function example()\n{\n\treturn 100;\n}\n\nfunction example1()\n{\n\treturn 200;\n}\n\nexample();";

let bpm = 80;
let bpmTime = 60 / 80;
let bpmTimer = 0;
let beat = 0;
let lastTime = Date.now();
let dt = 0;

let cm = undefined;
let ant = undefined;

function init()
{
    cm = CodeMirror(document.body,
    {
        value: EXAMPLE_CODE,
        mode: "javascript",
        lineNumbers: true,
        gutters: ["CodeMirror-linenumbers", "breakpoint"]
    });

    let info = cm.lineInfo(beat);
    cm.setGutterMarker(beat, "breakpoint", info.gutterMarkers ? null : _makeMarker());

    ant = new Annotate();
    ant.init(cm);

    cm.setOption("extraKeys",
    {
        "Ctrl-Enter": function(cm)
        {
            let curLine = cm.getCursor().line;
            console.log("line: " + curLine);

            ant.parse(cm, { line: curLine, ch: 0 }, { line: curLine, ch: cm.getLine(curLine).length });
        },
        "Alt-Enter": function(cm)
        {
            let line = cm.getCursor().line;
            let start = 0;
            let end = cm.lineCount() - 1;

            for (let i = line; i <= end; i++)
                if (cm.getLine(i) === "")
                {
                    end = i - 1;
                    break;
                }

            for (let i = line - 1; i >= 0; i--)
                if (cm.getLine(i) === "")
                {
                    start = i + 1;
                    break;
                }

            if (end - start == 0)
                console.log("line: " + end);
            else
                console.log("lines: " + start + "-" + end);
        }
    });

    update();
}

/*
Called to update dt and call tick() when necessary
*/
function update()
{
    dt = (Date.now() - lastTime) / 1000;
    lastTime = Date.now();

    bpmTimer += dt;

    if (bpmTimer >= bpmTime)
    {
        tick();

        bpmTimer = 0;
    }

    requestAnimationFrame(update);
}

function tick()
{
    ant.tick();

    let info = cm.lineInfo(beat);
    cm.setGutterMarker(beat, "breakpoint", info.gutterMarkers ? null : _makeMarker());
    beat = (beat + 1) % 4;
    info = cm.lineInfo(beat);
    cm.setGutterMarker(beat, "breakpoint", info.gutterMarkers ? null : _makeMarker());
}

window.onload = init;
