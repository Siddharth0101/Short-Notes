# Code practice

Snippets — related chapter ke optional examples; framework setup/runtime pehle check karo.

## Maven lifecycle and dependencies

```sh
./mvnw test
./mvnw verify
./mvnw dependency:tree
```

## Dependency scopes

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-test</artifactId>
    <scope>test</scope>
</dependency>
<dependency>
    <groupId>jakarta.servlet</groupId>
    <artifactId>jakarta.servlet-api</artifactId>
    <scope>provided</scope>
</dependency>
```

## Test behavior at the right level

```java
@Test
void fixedDiscountNeverMakesTotalNegative() {
    Discount discount = new FixedDiscount(500);
    assertEquals(0, discount.apply(200));
}
```

## Test design decisions

```java
@ExtendWith(MockitoExtension.class)
class OrderServiceTest {
    @Mock PaymentGateway gateway;
    @InjectMocks OrderService service;

    @Test
    void chargesGatewayExactlyOnceOnSuccess() {
        when(gateway.charge(any())).thenReturn(PaymentResult.success("tx-1"));
        service.checkout(new Order("order-1", 500));
        verify(gateway, times(1)).charge(any()); // meaningful: side effect must happen once
    }
}
```
