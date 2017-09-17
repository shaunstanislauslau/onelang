import { OneAst as one } from "./Ast";

export abstract class AstVisitor<TContext> {
    protected log(data: string) {
        const thisClassName = (<any>this).constructor.name;
        console.log(`[${thisClassName}] ${data}`);
    }
    
    protected visitIdentifier(id: one.Identifier, context: TContext) { }

    protected visitReturnStatement(stmt: one.ReturnStatement, context: TContext) {
        this.visitExpression(stmt.expression, context);
    }

    protected visitExpressionStatement(stmt: one.ExpressionStatement, context: TContext) {
        this.visitExpression(stmt.expression, context);
    }

    protected visitIfStatement(stmt: one.IfStatement, context: TContext) {
        this.visitExpression(stmt.condition, context);
        this.visitBlock(stmt.then, context);
        this.visitBlock(stmt.else, context);
    }

    protected visitThrowStatement(stmt: one.ThrowStatement, context: TContext) {
        this.visitExpression(stmt.expression, context);
    }

    protected visitVariableDeclaration(stmt: one.VariableDeclaration, context: TContext) {
        if (stmt.initializer)
            this.visitExpression(stmt.initializer, context);
    }

    protected visitWhileStatement(stmt: one.WhileStatement, context: TContext) {
        this.visitExpression(stmt.condition, context);
        this.visitBlock(stmt.body, context);
    }

    protected visitForStatement(stmt: one.ForStatement, context: TContext) {
        this.visitVariableDeclaration(stmt.itemVariable, context);
        this.visitExpression(stmt.itemVariable.initializer, context);
        this.visitExpression(stmt.condition, context);
        this.visitExpression(stmt.incrementor, context);
        this.visitBlock(stmt.body, context);
    }

    protected visitForeachStatement(stmt: one.ForeachStatement, context: TContext) {
        this.visitVariableDeclaration(stmt.itemVariable, context);
        this.visitExpression(stmt.items, context);
        this.visitBlock(stmt.body, context);
    }

    protected visitUnknownStatement(stmt: one.Statement, context: TContext) {
        this.log(`Unknown statement type: ${stmt.stmtType}`);
    }

    protected visitStatement(statement: one.Statement, context: TContext) {
        if (statement.stmtType === one.StatementType.Return) {
            this.visitReturnStatement(<one.ReturnStatement> statement, context);
        } else if (statement.stmtType === one.StatementType.Expression) {
            this.visitExpressionStatement(<one.ExpressionStatement> statement, context);
        } else if (statement.stmtType === one.StatementType.If) {
            this.visitIfStatement(<one.IfStatement> statement, context);
        } else if (statement.stmtType === one.StatementType.Throw) {
            this.visitThrowStatement(<one.ThrowStatement> statement, context);
        } else if (statement.stmtType === one.StatementType.Variable) {
            this.visitVariableDeclaration(<one.VariableDeclaration> statement, context);
        } else if (statement.stmtType === one.StatementType.While) {
            this.visitWhileStatement(<one.WhileStatement> statement, context);
        } else if (statement.stmtType === one.StatementType.For) {
            this.visitForStatement(<one.ForStatement> statement, context);
        } else if (statement.stmtType === one.StatementType.Foreach) {
            this.visitForeachStatement(<one.ForeachStatement> statement, context);
        } else {
            this.visitUnknownStatement(statement, context);
        }
    }

    protected visitBlock(block: one.Block, context: TContext) {
        for (const statement of block.statements) {
            this.visitStatement(statement, context);
        }
    }

    protected visitBinaryExpression(expr: one.BinaryExpression, context: TContext) {
        this.visitExpression(expr.left, context);
        this.visitExpression(expr.right, context);
    }

    protected visitCallExpression(expr: one.CallExpression, context: TContext) {
        this.visitExpression(expr.method, context);
        for (const arg of expr.arguments)
            this.visitExpression(arg, context);
    }

    protected visitConditionalExpression(expr: one.ConditionalExpression, context: TContext) {
        this.visitExpression(expr.condition, context);
        this.visitExpression(expr.whenTrue, context);
        this.visitExpression(expr.whenFalse, context);
    }

    protected visitNewExpression(expr: one.NewExpression, context: TContext) {
        this.visitExpression(expr.class, context);
        for (const arg of expr.arguments)
            this.visitExpression(arg, context);
    }

    protected visitLiteral(expr: one.Literal, context: TContext) { }

    protected visitParenthesizedExpression(expr: one.ParenthesizedExpression, context: TContext) {
        this.visitExpression(expr.expression, context);
    }

    protected visitUnaryExpression(expr: one.UnaryExpression, context: TContext) {
        this.visitExpression(expr.operand, context);
    }

    protected visitPropertyAccessExpression(expr: one.PropertyAccessExpression, context: TContext) {
        this.visitExpression(expr.object, context);
    }

    protected visitElementAccessExpression(expr: one.ElementAccessExpression, context: TContext) {
        this.visitExpression(expr.object, context);
        this.visitExpression(expr.elementExpr, context);
    }

    protected visitArrayLiteral(expr: one.ArrayLiteral, context: TContext) {
        for (const item of expr.items)
            this.visitExpression(item, context);
    }

    protected visitUnknownExpression(expr: one.Expression, context: TContext) {
        this.log(`Unknown expression type: ${expr.exprKind}`);
    }

    protected visitLocalMethodVariable(expr: one.LocalMethodVariable, context: TContext) { }

    protected visitLocalMethodReference(expr: one.LocalMethodReference, context: TContext) { }

    protected visitLocalClassVariable(expr: one.LocalClassVariable, context: TContext) { }

    protected visitExpression(expression: one.Expression, context: TContext) {
        if (expression.exprKind === one.ExpressionKind.Binary) {
            this.visitBinaryExpression(<one.BinaryExpression> expression, context);
        } else if (expression.exprKind === one.ExpressionKind.Call) {
            this.visitCallExpression(<one.CallExpression> expression, context);
        } else if (expression.exprKind === one.ExpressionKind.Conditional) {
            this.visitConditionalExpression(<one.ConditionalExpression> expression, context);
        } else if (expression.exprKind === one.ExpressionKind.Identifier) {
            this.visitIdentifier(<one.Identifier> expression, context);
        } else if (expression.exprKind === one.ExpressionKind.New) {
            this.visitNewExpression(<one.NewExpression> expression, context);
        } else if (expression.exprKind === one.ExpressionKind.Literal) {
            this.visitLiteral(<one.Literal> expression, context);
        } else if (expression.exprKind === one.ExpressionKind.Parenthesized) {
            this.visitParenthesizedExpression(<one.ParenthesizedExpression> expression, context);
        } else if (expression.exprKind === one.ExpressionKind.Unary) {
            this.visitUnaryExpression(<one.UnaryExpression> expression, context);
        } else if (expression.exprKind === one.ExpressionKind.PropertyAccess) {
            this.visitPropertyAccessExpression(<one.PropertyAccessExpression> expression, context);
        } else if (expression.exprKind === one.ExpressionKind.ElementAccess) {
            this.visitElementAccessExpression(<one.ElementAccessExpression> expression, context);
        } else if (expression.exprKind === one.ExpressionKind.ArrayLiteral) {
            this.visitArrayLiteral(<one.ArrayLiteral> expression, context);
        } else if (expression.exprKind === one.ExpressionKind.LocalMethodVariable) {
            this.visitLocalMethodVariable(<one.LocalMethodVariable> expression, context);
        } else if (expression.exprKind === one.ExpressionKind.LocalMethodReference) {
            this.visitLocalMethodReference(<one.LocalMethodReference> expression, context);
        } else if (expression.exprKind === one.ExpressionKind.LocalClassVariable) {
            this.visitLocalClassVariable(<one.LocalClassVariable> expression, context);
        } else {
            this.visitUnknownExpression(expression, context);
        }
    }

    protected visitMethod(method: one.Method, context: TContext) { 
        method.body = this.visitBlock(method.body, context) || method.body; 
    } 
 
    protected visitClass(cls: one.Class, context: TContext) { 
        for (const method of Object.values(cls.methods)) { 
            this.visitMethod(method, context); 
        } 
    } 
 
    protected visitSchema(schema: one.Schema, context: TContext) { 
        for (const cls of Object.values(schema.classes)) { 
            this.visitClass(cls, context); 
        } 
    } 
}