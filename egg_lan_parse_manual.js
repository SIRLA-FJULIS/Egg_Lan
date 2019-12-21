parse("+(a, 10)")

    parseExpression("+(a, 10)")

        parseApply({type: "word", name: "+"}, "(a, 10)")
        expr = {
            type: "apply",
            operator: {type: "word", name: "+"},
            args: []
        }

        //while
        parseExpression("a, 10)")
        parseApply(...) // 不影響
        expr = {
            type: "apply",
            operator: {type: "word", name: "+"},
            args: [{type: "word", name: "a"}]
        }

        parseExpression("10)")
        parseApply(...) // 不影響
        expr = {
            type: "apply",
            operator: {type: "word", name: "+"},
            args: [{type: "word", name: "a"},
                {type: "value", value: 10}]
        }
        // end while

        parseApply(expr, "")
            return {expr, ""}



parse("+(10, 11)")

    parseExpression("+(10, 11)")
    expr = {type: "word", name: "+"}

    parseApply(expr, "(10, 11)")
    expr = {type: "apply", operator: {type: "word", name: "+"}, args: []};

    //while1
    arg = parseExpression("10, 11)");
    parseApply({type: "value", name: 10}, ", 11)")
    {expr: {type: "value", name: 10}, rest: ", 11)"}
    arg = {expr: {type: "value", name: 10}, rest: ", 11)"}
    
    expr.args.push(arg.expr)
    
    "11)"
    //while2
    parseExpression("11)")
    {expr: {type: "value", name: 11}, rest: ")"}
    expr.args.push(arg.expr);
    ")"

    parseApply()
    expr = {type: "apply", operator: {type: "word", name: "+"}, args: [{type: "value", name: 10}, {type: "value", name: 11}]};
    ""

    {type: "apply", operator: {type: "word", name: "+"}, args: [{type: "value", name: 10}, {type: "value", name: 11}]};



    




















