import { Type } from "class-transformer";
import { IsIn } from "class-validator";
import {
  CHILD_AGES,
  type ChildAge,
  SUBJECTS,
  type Subject,
} from "@curio/types";

export class CreateLessonDto {
  @IsIn([...SUBJECTS])
  subject!: Subject;

  // Multipart fields arrive as strings; coerce before validating.
  @Type(() => Number)
  @IsIn([...CHILD_AGES])
  childAge!: ChildAge;
}
