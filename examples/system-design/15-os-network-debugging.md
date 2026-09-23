# Code practice

Snippets — related chapter ke optional examples; framework setup/runtime pehle check karo.

## URL se response tak timeline

```text
name resolution -> connection setup -> TLS (HTTPS)
  -> request bytes -> proxy/app queue
  -> handler CPU + downstream waits
  -> response headers/body -> client parse/render
```
