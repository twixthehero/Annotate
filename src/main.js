const EXAMPLE_CODE = "function example()\n{\n\treturn 100;\n}\n\nfunction example1()\n{\n\treturn 200;\n}\n\nexample();";
const EPlayState = { STOPPED: 0, PAUSED: 1, PLAYING: 2 };

//beats per minute
let bpm = 80;

//top: beats per measure
//bottom: note that gets one beat
let timeSignature = { top: 4, bottom: 4 };

//
let baseTickrate = 1 / timeSignature.bottom;

//amount of time between a measure's beats
let bpmTime = 60 / bpm;

//
let tickrate = bpmTime * baseTickrate;

//timer between measure's beats
let bpmTimer = 0;

//current beat
let beat = 0;

//current tick within the current beat
let currentTick = 0;

let ticksPerBeat = bpmTime / tickrate;

//current play state
let playState = EPlayState.PLAYING;

//previous time update was called
let lastTime = Date.now();

//current change in time since last update call
let dt = 0;

//CodeMirror instance
let cm = undefined;

//Annotate instance
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

    console.log("bpm: " + bpm);
    console.log("bpmTime: " + bpmTime);
    console.log("tickrate: " + tickrate);
    console.log("ticksPerBeat: " + ticksPerBeat);

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
        },
        "Shift-Enter": function(cm)
        {
            ant.parse(cm);
        },
        "Ctrl-.": function(cm)
        {
            ant.clear();
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

    if (playState == EPlayState.PLAYING)
    {
        bpmTimer += dt;

        if (bpmTimer >= tickrate)
        {
            tick();

            bpmTimer = 0;
        }
    }

    requestAnimationFrame(update);
}

function tick()
{
    ant.tick(beat, currentTick);

    currentTick += + 1;

    if (currentTick >= ticksPerBeat)
    {
        let info = cm.lineInfo(beat);
        cm.setGutterMarker(beat, "breakpoint", info.gutterMarkers ? null : _makeMarker());

        beat = (beat + 1) % timeSignature.bottom;
        currentTick = 0;

        info = cm.lineInfo(beat);
        cm.setGutterMarker(beat, "breakpoint", info.gutterMarkers ? null : _makeMarker());
    }
}

/*
 * Helper functions
 */
function setTimeSignature(newTime)
{
    if (newTime === undefined ||
        !newTime.hasOwnProperty("top") ||
        !newTime.hasOwnProperty("bottom"))
        return;

    timeSignature = newTime;

    _calcTimings();
    _resetMeasure();
}

function setTickrate(note)
{
    baseTickrate = 1 / (timeSignature.bottom / note);
    tickrate = bpmTime * baseTickrate;
    ticksPerBeat = bpmTime / baseTickrate;
}

function startPlayback()
{
    playState = EPlayState.PLAYING;
    _resetMeasure();
}

function pausePlayback()
{
    playState = EPlayState.PAUSED;
}

function stopPlayback()
{
    playState = EPlayState.STOPPED;
    _resetMeasure();
}

function _resetMeasure()
{
    bpmTimer = 0;
    beat = 0;
    currentTick = 0;
}

function _calcTimings()
{
    tickrate = 1 / timeSignature.bottom;
    bpmTime = 60 / bpm;

    _resetMeasure();
}

window.onload = init;
