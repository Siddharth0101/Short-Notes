# Code practice

Snippets — related chapter ke optional examples; framework setup/runtime pehle check karo.

## Layered read path

```text
browser cache -> CDN -> load balancer -> Java instances
                                             |
                                        shared cache
                                             |
                                      primary database
                                        /         \
                                   replica     replica
```

## Cache-aside and invalidation

```text
read: cache hit -> return
      cache miss -> read database -> populate cache -> return
write: commit database -> invalidate affected cache keys
```

```text
t=0 ms    key expires
t=0-200ms har arriving request miss dekhti hai aur rebuild start karti hai
          5,000 rps × 0.2 s = 1,000 concurrent rebuilds
t=200ms   1,000 identical queries database par, 999 ka result waste
```

```text
normal:  10,000 rps × 5% miss  =    500 rps database
outage:  10,000 rps × 100% miss = 10,000 rps database  (20x)
```

## Replication and sharding

```text
write   -> primary, aur response mein commit position/timestamp return karo
read    -> agar request "recent writer" hai (last write < 5 s ago, session
           cookie/token se pata chal raha hai) -> primary se padho
        -> warna replica se padho
        -> agar replica lag threshold (jaise 2 s) se zyada hai -> primary par failover
```

```text
10,000 tenants, 8 shards, hash(tenant_id) se distribute
largest tenant = total traffic ka 25%

=> uska shard ~25% + (baaki 75% ÷ 8) ≈ 34% traffic carry karta hai
   jabki uniform expectation 12.5% thi — ~2.7x overload
```
