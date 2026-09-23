# Code practice

Snippets — related chapter ke optional examples; framework setup/runtime pehle check karo.

## Backend prompt

```text
React client -> API gateway -> Java order service -> database
                                     |
                           same transaction writes
                           order row + outbox event
                                     |
                                outbox relay
                                     |
                                   broker -> consumer
```
