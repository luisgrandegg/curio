"use client";

import {
  CHILD_AGES,
  type ChildAge,
  SUBJECTS,
  type Subject,
} from "@curio/types";

export interface SubjectAgeValue {
  subject: Subject | null;
  childAge: ChildAge | null;
}

export interface SubjectAgePickerProps {
  value: SubjectAgeValue;
  onChange: (value: SubjectAgeValue) => void;
}

const chip = (active: boolean): string =>
  [
    "rounded-2xl px-5 py-3 text-lg font-semibold capitalize transition",
    active
      ? "bg-sky-600 text-white"
      : "bg-white text-slate-700 ring-1 ring-slate-300",
  ].join(" ");

export function SubjectAgePicker({ value, onChange }: SubjectAgePickerProps) {
  return (
    <div className="flex flex-col gap-6">
      <fieldset className="flex flex-col gap-3">
        <legend className="text-xl font-bold">Pick a subject</legend>
        <div className="flex flex-wrap gap-3">
          {SUBJECTS.map((subject) => (
            <button
              key={subject}
              type="button"
              aria-pressed={value.subject === subject}
              className={chip(value.subject === subject)}
              onClick={() => onChange({ ...value, subject })}
            >
              {subject}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-3">
        <legend className="text-xl font-bold">How old are you?</legend>
        <div className="flex flex-wrap gap-3">
          {CHILD_AGES.map((age) => (
            <button
              key={age}
              type="button"
              aria-pressed={value.childAge === age}
              className={chip(value.childAge === age)}
              onClick={() => onChange({ ...value, childAge: age })}
            >
              {age}
            </button>
          ))}
        </div>
      </fieldset>
    </div>
  );
}
