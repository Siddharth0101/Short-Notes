export const courseQuestions = [
  {
    id: 'iq-java-jdbc-atomicity',
    track: 'java',
    noteId: 'java-jdbc-sql',
    level: 'Intermediate',
    question: 'How do two JDBC updates become one atomic transfer?',
    answer:
      'Use the same connection with auto-commit disabled, perform both updates, validate affected row counts, then commit. On failure roll back. Restore connection state before returning a pooled connection and close owned resources. Two independent auto-committed updates can leave a partial transfer.',
    followUp: 'Why does using two connections not automatically share one local transaction?',
    tags: ['jdbc', 'sql', 'transactions'],
  },
  {
    id: 'iq-spring-actuator-pool-wait',
    track: 'spring-boot',
    topic: 'spring',
    noteId: 'java-observability-actuator',
    level: 'Advanced',
    question: 'API latency rises while SQL execution stays fast. What would you inspect?',
    answer:
      'Measure connection acquisition wait, active connections, pending requests and timeouts alongside query execution. Pool saturation can delay a request before any query starts. Correlate traces and metrics; increasing pool size blindly can overload the database. Expose only the management endpoints required by the operational access policy.',
    followUp: 'Why should per-user identifiers not become metric labels?',
    tags: ['spring', 'actuator', 'observability'],
  },
  {
    id: 'iq-java-packages-interfaces',
    track: 'java',
    noteId: 'java-packages-interfaces',
    level: 'Intermediate',
    question: 'Why use an interface for a constructor dependency?',
    answer:
      'Caller contract stable rehta hai while implementations can change. A recording fake can verify behavior without network calls; an interface is useful only when that boundary is meaningful.',
    followUp: 'Does an import make a package-private class public?',
    tags: ['packages', 'interfaces', 'encapsulation'],
  },
  {
    id: 'iq-spring-boot-first-application',
    track: 'spring-boot',
    noteId: 'spring-boot-first-application',
    level: 'Intermediate',
    question: 'Why can a compiling controller still return 404?',
    answer:
      'Compilation checks Java types, not Spring registration. A controller outside the component scan root is not registered, so its handler mapping is missing.',
    followUp: 'How would you distinguish a missing mapping from a server that never started?',
    tags: ['spring', 'boot', 'startup'],
  },
  {
    id: 'iq-spring-beans-di',
    track: 'spring-boot',
    noteId: 'spring-beans-di',
    level: 'Intermediate',
    question: 'Does a Spring singleton guarantee thread safety?',
    answer:
      'No. Singleton controls instance scope, not synchronization. Concurrent requests share its mutable fields, so use request-local data or an explicit concurrency design.',
    followUp:
      'What happens when a singleton receives one prototype instance through its constructor?',
    tags: ['spring', 'beans', 'dependency-injection'],
  },
  {
    id: 'iq-spring-configuration',
    track: 'spring-boot',
    noteId: 'spring-configuration',
    level: 'Intermediate',
    question: 'Why prefer ConfigurationProperties for related settings?',
    answer:
      'It groups settings into a typed dependency, supports structured binding, and provides a place to validate invariants at startup. Values still need to be applied to the components they configure.',
    followUp: 'Which value wins between packaged configuration and a command-line option?',
    tags: ['spring', 'configuration', 'profiles'],
  },
  {
    id: 'iq-spring-validation-errors',
    track: 'spring-boot',
    noteId: 'spring-validation-errors',
    level: 'Intermediate',
    question: 'Can Bean Validation guarantee database uniqueness?',
    answer:
      'No. Concurrent requests can pass field checks and existence queries. A database unique constraint enforces the invariant; translate its recognized failure into the API conflict contract.',
    followUp: 'Why should arbitrary exceptions not all become HTTP 400?',
    tags: ['spring', 'validation', 'errors'],
  },
  {
    id: 'iq-spring-testing',
    track: 'spring-boot',
    noteId: 'spring-testing',
    level: 'Intermediate',
    question: 'Why can a transactional HTTP integration test leave database rows behind?',
    answer:
      'A real HTTP request runs on a server thread with a separate transaction. Rolling back the test thread transaction does not undo the server commit; use isolated fixtures or explicit cleanup.',
    followUp: 'Can an in-memory database prove PostgreSQL locking behavior?',
    tags: ['spring', 'testing', 'integration'],
  },
  {
    id: 'iq-spring-deployment-capstone',
    track: 'spring-boot',
    noteId: 'spring-deployment-capstone',
    level: 'Intermediate',
    question: 'Why can rolling back a jar fail to restore a service?',
    answer:
      'The database schema or data may have changed incompatibly. Keep old and new versions compatible during rollout and test migration recovery independently of application rollback.',
    followUp: 'How can a dependency outage cause a liveness restart storm?',
    tags: ['spring', 'deployment', 'capstone'],
  },
];
