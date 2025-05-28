// Variable environment for PermEq
type Value = number; // Expand as needed

interface Binding {
  value: Value;
  persistent?: {
    expr: import('./ast').Expression;
  };
}

export class Environment {
  private vars = new Map<string, Binding>();

  set(name: string, value: Value, persistentExpr?: import('./ast').Expression) {
    this.vars.set(name, {
      value,
      persistent: persistentExpr ? { expr: persistentExpr } : undefined,
    });
  }

  get(name: string): Value | undefined {
    const binding = this.vars.get(name);
    return binding?.value;
  }

  // For persistent variables: re-evaluate as needed
  reevaluate(name: string, evalExpr: (expr: import('./ast').Expression) => Value) {
    const binding = this.vars.get(name);
    if (binding?.persistent) {
      binding.value = evalExpr(binding.persistent.expr);
    }
  }
}
