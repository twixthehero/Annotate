class Annotate
{
    constructor()
    {
        this.ast = undefined;
        this.tokens = {};
        this.clocks = [];

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

        this.tokens["ArrayExpression"] = true;
    }

    clear()
    {
        for (let i = 0; i < this.clocks.length; i++)
            this.clocks[i].clear();

        this.clocks = [];
    }

    parse(cm, from, to)
    {
        let section = from == undefined || to == undefined;
        let text = section ? cm.getValue() : cm.getRange(from, to);
        console.log(text);
        this.ast = acorn.parse_dammit(text);
        let callbacks = _createCallbacks(this);
        console.log("ast", this.ast);

        acorn.walk.simple(this.ast, callbacks);
    }

    createClock(tokenType, node)
    {
        let newClock = undefined;

        switch (tokenType)
        {
            case "Identifier": break;
            case "Literal": break;
            case "RegExpLiteral": break;
            case "Program": break;
            case "Function": break;
            case "Statement": break;
            case "ExpressionStatement": break;
            case "BlockStatement": break;
            case "EmptyStatement": break;
            case "DebuggerStatement": break;
            case "WithStatement": break;
            case "ReturnStatement": break;
            case "LabeledStatement": break;
            case "BreakStatement": break;
            case "ContinueStatement": break;
            case "IfStatement": break;
            case "SwitchStatement": break;
            case "SwitchCase": break;
            case "ThrowStatement": break;
            case "TryStatement": break;
            case "CatchClause": break;
            case "WhileStatement": break;
            case "DoWhileStatement": break;
            case "ForStatement": break;
            case "ForInStatement": break;
            case "FunctionDeclaration": break;
            case "VariableDeclaration": break;
            case "VariableDeclaractor": break;
            case "Expression": break;
            case "ThisExpression": break;
            case "ArrayExpression":
                newClock = new ArrayClock(cm, this.ast, node);
                break;
            case "ObjectExpression": break;
            case "Property": break;
            case "FunctionExpression":
                newClock = new FunctionExpressionClock(cm, this.ast, node);
                break;
            case "UnaryExpression": break;
            case "UnaryOperator": break;
            case "UpdateExpression": break;
            case "UpdateOperator": break;
            case "BinaryExpression": break;
            case "BinaryOperator": break;
            case "AssignmentExpression": break;
            case "AssignmentOperator": break;
            case "LogicalExpression": break;
            case "LogicalOperator": break;
            case "MemberExpression": break;
            case "ConditionalExpression": break;
            case "CallExpression": break;
            case "NewExpression": break;
            case "SequenceExpression": break;
            case "Pattern": break;
        }

        if (newClock != undefined)
            this.clocks.push(newClock);
    }

    tick(beat, tick)
    {
        for (let i = 0; i < this.clocks.length; i++)
            this.clocks[i].tick(beat, tick);
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
        //cm.setGutterMarker(line, "breakpoint", info.gutterMarkers ? null : _makeMarker());
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

function _createCallbacks(ant)
{
    let callbacks = {};
    let keys = Object.keys(ant.tokens);

    for (let i = 0; i < keys.length; i++)
    {
        if (ant.tokens[keys[i]])
        {
            callbacks[Annotate.ASTTokens[i]] = function(obj, state)
            {
                console.log("obj", obj);

                if (state != undefined)
                    console.log("state", state);

                ant.createClock(Annotate.ASTTokens[i], obj);
            };
        }
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
