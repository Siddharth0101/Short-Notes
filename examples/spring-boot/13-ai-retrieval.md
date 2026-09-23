# Code practice

Snippets — related chapter ke optional examples; framework setup/runtime pehle check karo.

## Generation se pehle authorization

```text
authenticated question
  -> trusted server-derived tenant/user scope
  -> retrieve within authorized scope
  -> verify current access and source version
  -> rank / deduplicate / bound context
  -> insufficient evidence? return explicit limitation
  -> generate using labeled evidence
  -> validate response shape and cited source IDs
  -> answer + references OR controlled failure
```
