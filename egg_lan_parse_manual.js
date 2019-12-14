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