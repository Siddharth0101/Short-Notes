# Code practice

Snippets — related chapter ke optional examples; framework setup/runtime pehle check karo.

## Normalization se duplication ki problem dekho

```sql
CREATE TABLE learner (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email text NOT NULL UNIQUE
);
CREATE TABLE course (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title text NOT NULL CHECK (length(trim(title)) > 0)
);
CREATE TABLE enrollment (
  learner_id bigint NOT NULL REFERENCES learner(id),
  course_id bigint NOT NULL REFERENCES course(id),
  progress integer NOT NULL DEFAULT 0 CHECK (progress BETWEEN 0 AND 100),
  PRIMARY KEY (learner_id, course_id)
);
```
