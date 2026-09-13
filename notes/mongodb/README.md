# Node & MongoDB — ordered course

[All courses](../README.md)

Before starting: [Objects arrays and modern data transformations](../javascript/07-modern-data-collections.md) · [Event loop promises and resilient fetching](../javascript/15-async-event-loop.md) · [Modules web delivery and debugging](../javascript/17-modules-tooling-debugging.md).

Each chapter includes a core takeaway and a revision lab with a challenge, hint, answer guide and exit check. Use the [study guide](../STUDY_GUIDE.md) for session plans and self-review.

## Stage 1: Understand the server request

Start with Node and HTTP, then learn Express routing and errors.

1. [Node runtime HTTP modules and streams](01-node-runtime-http.md)
2. [Express REST APIs middleware and errors](02-express-rest-errors.md)

**Stage checkpoint:** Trace a request through middleware to a controlled response.

## Stage 2: Store and model data

Learn documents and CRUD before introducing Mongoose schemas.

3. [Documents CRUD and access-driven modeling](03-documents-crud-modeling.md)
4. [Mongoose schemas validation and relationships](04-mongoose-validation-relations.md)

**Stage checkpoint:** Choose embedding or references for a concrete access pattern and validate writes.

## Stage 3: Query efficiently

Learn indexes and aggregation, then inspect query plans and bounded streaming.

5. [Indexes aggregation geospatial queries and transactions](05-indexes-aggregation-transactions.md)
6. [MongoDB query plans and Node streaming lab](06-query-production-lab.md)

**Stage checkpoint:** Explain the winning plan for a tenant-scoped query and stream a large export.

## Stage 4: Secure and ship

Add authentication and authorization before payment/upload/deployment integration.

7. [Authentication authorization and secure boundaries](07-auth-security.md)
8. [SSR uploads payments email and deployment](08-production-integrations.md)

**Stage checkpoint:** Reject unauthorized resource access and recover safely from a duplicate webhook.
