import type { ChildAge, Lesson, LessonConcept, Subject } from "@curio/types";
import type { VisionProvider } from "./vision-provider.interface.js";

// PROD: dev-only. Returns canned lessons and ignores the photo — never enable
// in production. Lets the whole Phase-1 flow run offline (no Gemini key).
const TITLES: Record<Subject, string> = {
  maths: "Two-digit addition",
  science: "Parts of a plant",
  history: "Life long ago",
  geography: "Rivers and mountains",
  language: "Nouns and verbs",
  other: "Today's lesson",
};

const CONCEPTS: Record<Subject, [string, string][]> = {
  maths: [
    ["Adding ones", "Add the ones column first."],
    ["Carrying tens", "If the ones make ten or more, carry one ten over."],
    ["Adding tens", "Then add the tens column."],
    ["Number bonds", "Pairs of numbers that make ten."],
    ["Estimating", "Guess roughly before you add."],
    ["Checking", "Add again to make sure you're right."],
  ],
  science: [
    ["Roots", "Roots hold the plant and drink water."],
    ["Stem", "The stem carries water up the plant."],
    ["Leaves", "Leaves make food using sunlight."],
    ["Flower", "Flowers help the plant make seeds."],
    ["Seeds", "Seeds grow into new plants."],
    ["Sunlight", "Plants need light to grow."],
  ],
  history: [
    ["Long ago", "People lived differently in the past."],
    ["Homes", "Old homes had no electricity."],
    ["Travel", "People walked or used horses."],
    ["Work", "Many people farmed the land."],
    ["Tools", "Tools were made by hand."],
    ["Change", "Life changes over time."],
  ],
  geography: [
    ["Rivers", "Rivers carry water to the sea."],
    ["Mountains", "Mountains are very tall land."],
    ["Maps", "Maps show where places are."],
    ["Oceans", "Oceans are huge areas of water."],
    ["Weather", "Weather changes day to day."],
    ["Land and sea", "Earth has both land and water."],
  ],
  language: [
    ["Nouns", "A noun names a person, place, or thing."],
    ["Verbs", "A verb is an action word."],
    ["Adjectives", "Adjectives describe things."],
    ["Sentences", "A sentence tells a whole idea."],
    ["Capital letters", "Sentences start with a capital letter."],
    ["Full stops", "A full stop ends a sentence."],
  ],
  other: [
    ["Big idea", "The main thing this lesson teaches."],
    ["Key word 1", "An important word to remember."],
    ["Key word 2", "Another important word."],
    ["Example", "A simple example of the idea."],
    ["Why it matters", "Where you might use this."],
    ["Recap", "A quick summary of the lesson."],
  ],
};

export class StubVisionProvider implements VisionProvider {
  extractLesson(
    _imageBase64: string,
    age: ChildAge,
    subject: Subject,
  ): Promise<Lesson> {
    const concepts: LessonConcept[] = CONCEPTS[subject].map(
      ([label, detail], i) => ({ id: `concept-${i + 1}`, label, detail }),
    );
    return Promise.resolve({
      topicTitle: TITLES[subject],
      summary: `A ${subject} lesson for a ${age}-year-old. (Sample data — no photo was read.)`,
      subject,
      childAge: age,
      concepts,
    });
  }
}
