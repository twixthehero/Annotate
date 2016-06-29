class Annotate
{
    constructor()
    {
        this.tokens = {};

        this.initDefault();
    }

    init(cm)
    {
        cm.on("change", this.onChange);
        cm.on("cursorActivity", this.onCursorMove);
        cm.on("gutterClick", this.onGutterClick);
    }

    initDefault()
    {
        for (let i = 0; i < Annotate.ASTTokens.length; i++)
            this.tokens[Annotate.ASTTokens[i]] = false;

        this.tokens["ReturnStatement"] = true;
    }

    parse(cm, from, to)
    {
        let text = cm.getRange(from, to);
        console.log(text);
        let ast = acorn.parse_dammit(text);
        let callbacks = _createCallbacks();

        acorn.walk.simple(ast, callbacks);
    }

    tick()
    {

    }

    onChange(cm, change)
    {
        //console.log("onChange");
        //console.log(change);
    }

    onCursorMove(cm)
    {
        //console.log("cursor moved");
    }

    onGutterClick(cm, line, gutter, clickEvent)
    {
        let info = cm.lineInfo(line);
        cm.setGutterMarker(line, "breakpoint", info.gutterMarkers ? null : _makeMarker());
    }

    on(token)
    {
        if (!(token in this.tokens))
            throw new AnnotateException(`Token '${token}' is not a value type
            of ESTree. See valid types at https://github.com/estree/estree.
            Also viewable by logging Annotate.ASTTokens.`);

        this.tokens[token] = true;
    }

    off(token)
    {
        if (!(token in this.tokens))
            throw new AnnotateException(`Token '${token}' is not a value type
            of ESTree. See valid types at https://github.com/estree/estree.
            Also viewable by logging Annotate.ASTTokens.`);

        this.tokens[token] = false;
    }

    toggle(token)
    {
        if (!(token in this.tokens))
            throw new AnnotateException(`Token '${token}' is not a value type
            of ESTree. See valid types at https://github.com/estree/estree.
            Also viewable by logging Annotate.ASTTokens.`);

        this.tokens[token] = !this.tokens[token];
    }

    savePreset()
    {
        let preset = "";
        let keys = Object.keys(this.tokens);

        for (let i = 0; i < keys.length; i++)
            if (this.tokens[keys[i]])
            {
                if (i < keys.length - 1)
                    preset += key + ",";
                else
                    preset += key;
            }

        return preset;
    }

    loadPreset(preset)
    {
        let enabled = preset.split(",");
        let keys = Object.keys(this.tokens);

        for (let i = 0; i < keys.length; i++)
            if (enabled.includes(i))
                this.tokens[keys[i]] = true;
    }
}

function _createCallbacks()
{
    let callbacks = {};

    for (let i = 0; i < Annotate.ASTTokens.length; i++)
    {
        callbacks[Annotate.ASTTokens[i]] = function(obj)
        {
            console.log(i);
            console.log(obj);
        };
    }

    return callbacks;
}

function _makeMarker()
{
    let marker = document.createElement("div");
    marker.style.color = "#0f0";
    marker.innerHTML = "●";
    return marker;
}

Annotate.ASTTokens =
[
    "Identifier",
    "Literal",
    "RegExpLiteral",
    "Program",
    "Function",
    "Statement",
    "ExpressionStatement",
    "BlockStatement",
    "EmptyStatement",
    "DebuggerStatement",
    "WithStatement",
    "ReturnStatement",
    "LabeledStatement",
    "BreakStatement",
    "ContinueStatement",
    "IfStatement",
    "SwitchStatement",
    "SwitchCase",
    "ThrowStatement",
    "TryStatement",
    "CatchClause",
    "WhileStatement",
    "DoWhileStatement",
    "ForStatement",
    "ForInStatement",
    "FunctionDeclaration",
    "VariableDeclaration",
    "VariableDeclaractor",
    "Expression",
    "ThisExpression",
    "ArrayExpression",
    "ObjectExpression",
    "Property",
    "FunctionExpression",
    "UnaryExpression",
    "UnaryOperator",
    "UpdateExpression",
    "UpdateOperator",
    "BinaryExpression",
    "BinaryOperator",
    "AssignmentExpression",
    "AssignmentOperator",
    "LogicalExpression",
    "LogicalOperator",
    "MemberExpression",
    "ConditionalExpression",
    "CallExpression",
    "NewExpression",
    "SequenceExpression",
    "Pattern"
];

class AnnotateException
{
    constructor(message)
    {
        this.message = message;
        this.name = "AnnotateException";
    }
}
