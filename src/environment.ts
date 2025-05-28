// Variable environment for PermEq

import type { Expression } from "./ast";

type Value = number; // Expand as needed

interface Binding {
  value: Value;
  persistent?: {
    expr: Expression;
  };
}

export class Environment {
  private vars = new Map<string, Binding>();

  set(name: string, value: Value, persistentExpr?: Expression) {
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
  reevaluate(name: string, evalExpr: (expr: Expression) => Value) {
    const binding = this.vars.get(name);
    if (binding?.persistent) {
      binding.value = evalExpr(binding.persistent.expr);
    }
  }

  // Optional: reevaluate all persistent bindings
  reevaluateAll(evalExpr: (expr: Expression) => Value) {
    for (const [name, binding] of this.vars) {
      if (binding.persistent) {
        binding.value = evalExpr(binding.persistent.expr);
      }
    }
  }
}
