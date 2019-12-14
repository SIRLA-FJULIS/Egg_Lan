function parseExpression(program) {
    program = skipSpace(program);
    let match, expr;
    
    /* 1. 篩選字串: 被雙引號包起來而且中間沒有任何雙引號的
     * 2. 篩選數字: 開頭是至少一個數字，且數字之後沒有任何其他字
     * 3. 篩選變數: 不是\s、逗點、#或雙引號的視為變數
     */
    if (match = /^"([^"]*)"/.exec(program)) {
        expr = {type: "value", value: match[1]};
    } else if (match = /^\d+\b/.exec(program)) {
        expr = {type: "value", value: Number(match[0])};
    } else if (match = /^[^\s(),#"]+/.exec(program)) {
        expr = {type: "word", name: match[0]};
    } else {
        throw new SyntaxError("Unexpected syntax: " + program);
    }

    return parseApply(expr, program.slice(match[0].length));
}

function skipSpace(string) {
    let first = string.search(/\S/);
    if (first == -1) return "";
    return string.slice(first);
}

function parseApply(expr, program) {
    program = skipSpace(program);
    if (program[0] != "(") {
        return {expr: expr, rest: program};
    }

    program = skipSpace(program.slice(1));
    expr = {type: "apply", operator: expr, args: []};
    // 把括號裡面的東西都解析出來，直到括號結束為止
    while (program[0] != ")") {
        let arg = parseExpression(program);
        expr.args.push(arg.expr);
        program = skipSpace(arg.rest);
        if (program[0] == ",") {
            program = skipSpace(program.slice(1));
        } else if (program[0] != ")") {
            throw new SyntaxError("Expected ',' or ')'");
        }
    }

    // 再解析一遍，確認後面沒有別的括號
    return parseApply(expr, program.slice(1));
}

function parse(program) {
    let {expr, rest} = parseExpression(program);
    if (skipSpace(rest).length > 0) {
        throw new SyntaxError("Unexpected text after program");
    }
    return expr;
}

const specialForms = Object.create(null);

specialForms.if = (args, scope) => {
    if (args.length != 3) {
        throw new SyntaxError("Wrong number of args to if");
    } else if (evaluate(args[0], scope) !== false) {
        return evaluate(args[1], scope);
    } else {
        return evaluate(args[2], scope);
    }
};

specialForms.while = (args, scope) => {
    if (args.length != 2) {
        throw new SyntaxError("Wrong number of args to while");
    }
    while (evaluate(args[0], scope) !== false) {
        evaluate(args[1], scope);
    }

    return false;
};

specialForms.do = (args, scope) => {
    let value = false;
    for (let arg of args) {
        value = evaluate(arg, scope);
    }
    return value;
};

specialForms.define = (args, scope) => {
    if (args.length != 2 || args[0].type != "word") {
        throw new SyntaxError("Incorrect use of define");
    }
    let value = evaluate(args[1], scope);
    scope[args[0].name] = value;
    return value;
};

specialForms.fun = (args, scope) => {
    if (!args.length) {
        throw new SyntaxError("Functions need a body");
    }
    let body = args[args.length - 1];
    let params = args.slice(0, args.length - 1).map(expr => {
        if (expr.type != "word") {
            throw new SyntaxError("Parameter names must be words");
        }
        return expr.name;
    });

    return function() {
        if (arguments.length != params.length) {
            throw new TypeError("Wrong number of arguments");
        }
        let localScope = Object.create(scope);
        for (let i = 0; i < arguments.length; i++) {
            localScope[params[i]] = arguments[i];
        }
        return evaluate(body, localScope);
    };
};

const topScope = Object.create(null);

// define boolean
topScope.true = true;
topScope.false = false;

// define operators
for (let op of ["+", "-", "*", "/", "==", "<", ">"]) {
    topScope[op] = Function("a, b", `return a ${op} b;`)
}

topScope.print = value => {
    console.log(value);
    return value;
};

function evaluate(expr, scope) {
    if (expr.type == "value") {
        return expr.value;
    } else if (expr.type == "word") {
        if (expr.name in scope) {
            return scope[expr.name];
        } else {
            throw new ReferenceError(`Undefined binding: ${expr.name}`);
        }
    } else if (expr.type == "apply") {
        let {operator, args} = expr;
        if (operator.type == "word" &&
            operator.name in specialForms) {
            return specialForms[operator.name](expr.args, scope);
        } else {
            let op = evaluate(operator, scope);
            if (typeof op == "function") {
                return op(...args.map(arg => evaluate(arg, scope)));
            } else {
                throw new TypeError("Applying a non-function.");
            }
        }
    }
}

function run(program) {
    let parse_tree = parse(program);
    return evaluate(parse_tree, Object.create(topScope));
}

// // 如果arg[0]成立，就回傳false, 否則回傳true
// let prog = parse(`if(true, "it's true", "it's false")`);
// console.log(evaluate(prog, topScope));

// run(`
// do(define(total, 0),
//    define(count, 1),
//    while(<(count, 11),
// 		 do(define(total, +(total, count)),
// 			define(count, +(count, 1)))),
//    print(total))
// `);

run(`
do(define(plusOne, fun(a, +(a, 1))),
   print(plusOne(10)))
`);

// run(`
// do(define(pow, fun(base, exp,
//      if(==(exp, 0),
//         1,
//         *(base, pow(base, -(exp, 1)))))),
//    print(pow(2, 10)))
// `)

// run(`
// do(define(f, fun(a, fun(b, +(a, b)))),
//    print(f(4)(5)))
// `);