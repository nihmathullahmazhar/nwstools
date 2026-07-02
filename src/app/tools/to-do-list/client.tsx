"use client";

import { useState } from "react";
import { Input } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { useLocalStorage } from "@/lib/use-local-storage";
import { cn } from "@/lib/utils";
import { Plus, X, Check } from "lucide-react";

type Todo = { id: string; text: string; done: boolean };

export default function TodoList() {
  const [todos, setTodos] = useLocalStorage<Todo[]>("todos", []);
  const [text, setText] = useState("");

  function add(e: React.FormEvent) {
    e.preventDefault();
    const t = text.trim();
    if (!t) return;
    setTodos((p) => [{ id: crypto.randomUUID(), text: t, done: false }, ...p]);
    setText("");
  }
  const remaining = todos.filter((t) => !t.done).length;

  return (
    <div className="mx-auto max-w-xl space-y-4">
      <form onSubmit={add} className="flex gap-2">
        <Input value={text} onChange={(e) => setText(e.target.value)} placeholder="Add a task…" className="h-11" autoFocus />
        <Button type="submit" size="lg" disabled={!text.trim()}>
          <Plus className="h-4 w-4" /> Add
        </Button>
      </form>

      {todos.length > 0 && (
        <>
          <div className="flex items-center justify-between text-sm text-fg-muted">
            <span>{remaining} of {todos.length} remaining</span>
            {todos.some((t) => t.done) && (
              <button onClick={() => setTodos((p) => p.filter((t) => !t.done))} className="hover:text-fg">
                Clear completed
              </button>
            )}
          </div>

          <div className="panel divide-y divide-border">
            {todos.map((t) => (
              <div key={t.id} className="flex items-center gap-3 px-4 py-2.5">
                <button
                  onClick={() => setTodos((p) => p.map((x) => (x.id === t.id ? { ...x, done: !x.done } : x)))}
                  className={cn(
                    "grid h-5 w-5 shrink-0 place-items-center rounded-md border transition",
                    t.done ? "border-accent bg-accent text-accent-fg" : "border-border-strong hover:border-accent",
                  )}
                  aria-label="Toggle"
                >
                  {t.done && <Check className="h-3.5 w-3.5" />}
                </button>
                <span className={cn("flex-1 text-sm", t.done && "text-fg-faint line-through")}>{t.text}</span>
                <button onClick={() => setTodos((p) => p.filter((x) => x.id !== t.id))} className="text-fg-faint hover:text-danger">
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </>
      )}
      <p className="text-center text-xs text-fg-faint">Saved on this device — no account, no sync.</p>
    </div>
  );
}
