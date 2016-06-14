class Annotate
{
    constructor(codeMirror)
    {
        this.codeMirror = codeMirror;
        this.tokens = {};

        this.initDefault();
    }

    initDefault()
    {
        for (let i = 0; i < Annotate.ASTTokens.length; i++)
            this.tokens[Annotate.ASTTokens[i]] = false;

        this.tokens["ReturnStatement"] = true;
    }

    parse()
    {

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

    savePreset(path)
    {

    }

    loadPreset(path)
    {

    }
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
