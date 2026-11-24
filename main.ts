// The One-Line Cat Joke That Lands — make.fun entry (program/v1).
//
// This program writes one joke about cats to the file the sealed scorer
// reads: $MAKEFUN_OUTPUT_DIR/entry.txt, defaulting to /output/entry.txt.
// The gate wants UTF-8 text of 1-200 characters, not only whitespace, so
// the program validates the joke against that gate before writing it and
// re-reads the file afterwards to prove the bytes on disk are the joke.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

// The joke. Setup: a human gives their cat a performance review, the way
// a manager reviews an employee. Turn: the cat is the one doing the
// reviewing — one star, and he sleeps through the meeting. 82 characters.
const JOKE =
  "I gave my cat a performance review; he gave me one star and fell asleep during it.";

// Harness contract from the kit's RULES.txt: gate is 1-200 UTF-8 chars.
const GATE = { min: 1, max: 200 } as const;
const OUTPUT_NAME = "entry.txt";

function resolveOutputDir(): string {
  const fromEnv = process.env.MAKEFUN_OUTPUT_DIR;
  return fromEnv !== undefined && fromEnv !== "" ? fromEnv : "/output";
}

function assertGateOk(text: string): void {
  const failures: string[] = [];
  if (text.length < GATE.min || text.length > GATE.max) {
    failures.push(`length ${text.length} is outside ${GATE.min}-${GATE.max}`);
  }
  if (text.trim() === "") {
    failures.push("text is only whitespace");
  }
  if (/[\r\n]/.test(text)) {
    failures.push("text is not a single line");
  }
  if (failures.length > 0) {
    throw new Error(`Gate check failed: ${failures.join("; ")}`);
  }
}

function run(): void {
  assertGateOk(JOKE);
  const target = join(resolveOutputDir(), OUTPUT_NAME);
  mkdirSync(dirname(target), { recursive: true });
  // Exactly the joke: no trailing newline, no explanation, nothing else.
  writeFileSync(target, JOKE, "utf8");
  const onDisk = readFileSync(target, "utf8");
  if (onDisk !== JOKE) {
    throw new Error("entry.txt on disk does not match the joke");
  }
  console.log(`Wrote ${JOKE.length}-character joke to ${target}`);
}

run();
