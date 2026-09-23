export const courseQuestions = [
  {
    id: 'iq-java-jdbc-atomicity',
    track: 'java',
    noteId: 'java-jdbc-sql',
    level: 'Intermediate',
    question: 'Two JDBC updates ek atomic transfer kaise banenge?',
    answer:
      "- Same connection par auto-commit disable karo\n- debit/credit dono updates, affected rows validation, phir commit.\n- Failure par rollback.\n- Pooled connection return se pehle state restore aur owned resources close karo.\n- Two independently auto-committed updates partial transfer chhod sakti hain: debit save ho gaya lekin credit fail.\n- Isliye connection aur transaction ownership explicitly define karo.",
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
      "- Query execution ke saath connection acquisition wait, active connections, pending requests aur timeouts measure karo.\n- Pool saturated ho toh query start se pehle delay hota hai.\n- Traces/metrics correlate karo\n- blindly pool badhane se DB overload ho sakti hai.\n- Operational access policy ke required management endpoints hi expose karo\n- unbounded user IDs metric labels mat banao.",
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
      "- Interface caller ka contract stable rakhta hai jab implementation badle.\n- Recording fake se actual network bina behavior verify kar sakte ho.\n- Constructor dependency explicitly maangta hai, service khud delivery decide nahi karti.\n- Interface tab useful hai jab boundary meaningful ho\n- har class ka interface automatically banana zaroori nahi.\n- Import visibility rules change nahi karta.",
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
      "- Compilation Java types check karti hai, Spring registration nahi.\n- Component-scan root ke bahar controller compile ho sakta hai lekin bean/handler mapping register nahi hogi.\n- Package, scan aur route inspect karo.\n- 404 ko startup failure se alag samjho: port busy ho toh process successfully serve hi nahi hua.\n- Random annotations se pehle logs ka meaningful cause padho.",
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
      "- Nahi.\n- Singleton instance scope control karta hai, synchronization nahi.\n- Concurrent requests same mutable fields share kar sakti hain.\n- Request-specific data parameters/locals mein rakho ya explicit concurrency design karo.\n- Constructor se once injected prototype har method call par fresh nahi banega\n- repeated lookup chahiye toh provider/scope mechanism deliberately choose karo.",
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
      "- ConfigurationProperties related settings ko typed dependency banata hai, structured binding aur startup validation ki jagah deta hai.\n- Setting bind ho gayi toh component behavior automatically nahi badlega: timeout value HTTP client setup mein apply karni padegi.\n- Ordinary launch mein command-line packaged config ko override karti hai\n- full precedence context-specific property sources se padho.",
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
      "- Nahi.\n- Concurrent requests field validation aur existence query dono pass kar sakti hain.\n- DB unique constraint final invariant enforce karta hai.\n- Specifically recognized violation ko documented conflict response do.\n- Every exception ko 400 karne se server defect bhi client error ban jaata hai\n- expected failures aur unexpected diagnostics alag handle karo.",
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
      "- Real HTTP request separate server thread/transaction mein chalti hai.\n- Test thread rollback server commit undo nahi karta.\n- Isolated fixtures, test DB ya explicit cleanup use karo\n- suite order par depend mat karo.\n- PostgreSQL locks/constraints prove karne ke liye PostgreSQL-backed test lo, in-memory substitute identical semantics guarantee nahi karti.",
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
      "- Schema/data incompatible change ho chuki ho toh old jar expected columns nahi paayegi.\n- Rollout mein old/new versions compatible rakho\n- application rollback se separately migration recovery test karo.\n- Destructive drop simply jar rollback se reverse nahi hota.\n- Dependency outage ko liveness failure banaoge toh unnecessary restarts recovery aur worse kar sakte hain.",
    followUp: 'Dependency outage liveness restart storm kaise bana sakti hai?',
    tags: ['spring', 'deployment', 'capstone'],
  },
];
