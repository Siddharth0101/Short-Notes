# Code practice

Snippets — related chapter ke optional examples; framework setup/runtime pehle check karo.

## Frame the problem

```text
User journey -> API and screen states -> data model
                      |
                 workload estimates
                      |
             baseline architecture
                      |
              bottlenecks and failures
```

## Worked capacity estimate

```text
reads/day       = 100,000 × 20 = 2,000,000
average read/s  = 2,000,000 / 86,400 ≈ 23
peak read/s     = 23 × assumed 10 peak factor ≈ 230
writes/day      = 200,000
average write/s ≈ 2.3
```

## Storage growth, not just storage

```text
progress events/day    = 200,000
bytes per event        = 2 KB (raw payload)
raw payload/day        = 400 MB
+ indexes and row overhead (assume 1.5x) = 600 MB/day
one year               ≈ 219 GB logical
× 3 copies (primary + 2 replicas)        ≈ 657 GB provisioned
+ 30-day point-in-time recovery WAL/backup ≈ additional 20-30%
```
