const exampleCode = "function example()\n{\n\treturn 100;\n}\n\nexample();";

let cm = undefined;
let ant = undefined;

function init()
{
    cm = CodeMirror(document.body,
    {
        value: exampleCode,
        mode: "javascript",
        lineNumbers: true,
        gutters: ["CodeMirror-linenumbers", "breakpoint"]
    });

    ant = new Annotate();

    cm.on("change", ant.parse);
    cm.on("cursorActivity", ant.cursorMoved);
    cm.on("gutterClick", ant.gutterClick);

    cm.setOption("extraKeys",
    {
        "Ctrl-Enter": function(cm)
        {
            let line = cm.getCursor().line;
            console.log("line: " + line);
        },
        "Alt-Enter": function(cm)
        {
            let line = cm.getCursor().line;
            let start = 0;
            let end = cm.lineCount();

            for (let i = line; i < end; i++)
                if (cm.getLine(i) === "")
                {
                    end = i - 1;
                    break;
                }

            for (let i = line - 1; i >= 0; i--)
                if (cm.getLine(i) === "")
                {
                    start = i;
                    break;
                }

            console.log("lines: " + start + "-" + end);
        }
    });
}

window.onload = init;
