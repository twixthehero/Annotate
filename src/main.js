const exampleCode = "function example()\n{\n\treturn 100;\n}\n\nexample();";

let cm = undefined;

function init()
{
    cm = CodeMirror(document.body,
    {
        value: exampleCode,
        mode: "javascript",
        lineNumbers: true
    });
}

window.onload = init;
