export const courseQuestions = [
  {
    id: 'iq-java-jdbc-atomicity',
    track: 'java',
    noteId: 'java-jdbc-sql',
    level: 'Intermediate',
    question: 'Two JDBC updates ek atomic transfer kaise banenge?',
    answer:
      'Same connection par auto-commit disable karo; debit/credit dono updates, affected rows validation, phir commit. Failure par rollback. Pooled connection return se pehle state restore aur owned resources close karo. Two independently auto-committed updates partial transfer chhod sakti hain: debit save ho gaya lekin credit fail. Isliye connection aur transaction ownership explicitly define karo.',
    followUp: 'Two connections automatically same local transaction kyun nahi share karti?',
    tags: ['jdbc', 'sql', 'transactions'],
  },
  {
    id: 'iq-spring-actuator-pool-wait',
    track: 'spring-boot',
    topic: 'spring',
    noteId: 'java-observability-actuator',
    level: 'Advanced',
    question: 'SQL fast hai lekin API slow: kya inspect karoge?',
    answer:
      'Query execution ke saath connection acquisition wait, active connections, pending requests aur timeouts measure karo. Pool saturated ho toh query start se pehle delay hota hai. Traces/metrics correlate karo; blindly pool badhane se DB overload ho sakti hai. Operational access policy ke required management endpoints hi expose karo; unbounded user IDs metric labels mat banao.',
    followUp: 'Per-user IDs metric labels kyun na hon?',
    tags: ['spring', 'actuator', 'observability'],
  },
  {
    id: 'iq-java-packages-interfaces',
    track: 'java',
    noteId: 'java-packages-interfaces',
    level: 'Intermediate',
    question: 'Constructor dependency ke liye interface kyun?',
    answer:
      'Interface caller ka contract stable rakhta hai jab implementation badle. Recording fake se actual network bina behavior verify kar sakte ho. Constructor dependency explicitly maangta hai, service khud delivery decide nahi karti. Interface tab useful hai jab boundary meaningful ho; har class ka interface automatically banana zaroori nahi. Import visibility rules change nahi karta.',
    followUp: 'Import package-private class ko public banata hai?',
    tags: ['packages', 'interfaces', 'encapsulation'],
  },
  {
    id: 'iq-spring-boot-first-application',
    track: 'spring-boot',
    noteId: 'spring-boot-first-application',
    level: 'Intermediate',
    question: 'Controller compile hokar bhi 404 kyun de sakta hai?',
    answer:
      'Compilation Java types check karti hai, Spring registration nahi. Component-scan root ke bahar controller compile ho sakta hai lekin bean/handler mapping register nahi hogi. Package, scan aur route inspect karo. 404 ko startup failure se alag samjho: port busy ho toh process successfully serve hi nahi hua. Random annotations se pehle logs ka meaningful cause padho.',
    followUp: 'Missing mapping versus never-started server kaise distinguish karoge?',
    tags: ['spring', 'boot', 'startup'],
  },
  {
    id: 'iq-spring-beans-di',
    track: 'spring-boot',
    noteId: 'spring-beans-di',
    level: 'Intermediate',
    question: 'Spring singleton thread safety guarantee karta hai?',
    answer:
      'Nahi. Singleton instance scope control karta hai, synchronization nahi. Concurrent requests same mutable fields share kar sakti hain. Request-specific data parameters/locals mein rakho ya explicit concurrency design karo. Constructor se once injected prototype har method call par fresh nahi banega; repeated lookup chahiye toh provider/scope mechanism deliberately choose karo.',
    followUp: 'Singleton ko constructor se once prototype mile toh kya hota hai?',
    tags: ['spring', 'beans', 'dependency-injection'],
  },
  {
    id: 'iq-spring-configuration',
    track: 'spring-boot',
    noteId: 'spring-configuration',
    level: 'Intermediate',
    question: 'Related settings ke liye ConfigurationProperties kyun?',
    answer:
      'ConfigurationProperties related settings ko typed dependency banata hai, structured binding aur startup validation ki jagah deta hai. Setting bind ho gayi toh component behavior automatically nahi badlega: timeout value HTTP client setup mein apply karni padegi. Ordinary launch mein command-line packaged config ko override karti hai; full precedence context-specific property sources se padho.',
    followUp: 'Packaged config aur command-line mein kaunsi value jeetegi?',
    tags: ['spring', 'configuration', 'profiles'],
  },
  {
    id: 'iq-spring-validation-errors',
    track: 'spring-boot',
    noteId: 'spring-validation-errors',
    level: 'Intermediate',
    question: 'Bean Validation DB uniqueness guarantee karti hai?',
    answer:
      'Nahi. Concurrent requests field validation aur existence query dono pass kar sakti hain. DB unique constraint final invariant enforce karta hai. Specifically recognized violation ko documented conflict response do. Every exception ko 400 karne se server defect bhi client error ban jaata hai; expected failures aur unexpected diagnostics alag handle karo.',
    followUp: 'Har arbitrary exception HTTP 400 kyun na bane?',
    tags: ['spring', 'validation', 'errors'],
  },
  {
    id: 'iq-spring-testing',
    track: 'spring-boot',
    noteId: 'spring-testing',
    level: 'Intermediate',
    question: 'Transactional HTTP test DB rows chhod kyun sakta hai?',
    answer:
      'Real HTTP request separate server thread/transaction mein chalti hai. Test thread rollback server commit undo nahi karta. Isolated fixtures, test DB ya explicit cleanup use karo; suite order par depend mat karo. PostgreSQL locks/constraints prove karne ke liye PostgreSQL-backed test lo, in-memory substitute identical semantics guarantee nahi karti.',
    followUp: 'In-memory DB PostgreSQL locking prove kar sakti hai?',
    tags: ['spring', 'testing', 'integration'],
  },
  {
    id: 'iq-spring-deployment-capstone',
    track: 'spring-boot',
    noteId: 'spring-deployment-capstone',
    level: 'Intermediate',
    question: 'Jar rollback se service restore kyun nahi ho sakti?',
    answer:
      'Schema/data incompatible change ho chuki ho toh old jar expected columns nahi paayegi. Rollout mein old/new versions compatible rakho; application rollback se separately migration recovery test karo. Destructive drop simply jar rollback se reverse nahi hota. Dependency outage ko liveness failure banaoge toh unnecessary restarts recovery aur worse kar sakte hain.',
    followUp: 'Dependency outage liveness restart storm kaise bana sakti hai?',
    tags: ['spring', 'deployment', 'capstone'],
  },
];
