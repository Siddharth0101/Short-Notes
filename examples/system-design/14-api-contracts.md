# Code practice

Snippets — related chapter ke optional examples; framework setup/runtime pehle check karo.

## Same screen, different contracts

```graphql
# Schema excerpt; server, resolvers and auth separately required
type Query { course(id: ID!): Course }
type Course { id: ID!, title: String!, teacher: Teacher }
type Teacher { id: ID!, name: String! }
```

```graphql
# Separate query document against that schema
query CourseCard($id: ID!) {
  course(id: $id) { id title teacher { name } }
}
```
