---
id: js-oop-mini-project
title: OOP pillars and a banking mini-project
track: javascript
order: 14
level: Advanced
minutes: 24
summary: Encapsulation, inheritance, polymorphism aur abstraction ko object/class dono style mein dekho, phir sabko ek chhote banking state machine mein combine karo.
tags: oop, encapsulation, inheritance, polymorphism, abstraction, classes, closures, capstone
---

## Mental model

JavaScript "classes only" language nahi hai — OOP yahan object model, prototypes aur classes teeno se express ho sakta hai. Char pillars — encapsulation, inheritance, polymorphism, abstraction — Java jaisi strict class hierarchy ki demand nahi karte; plain object, closure aur `class` syntax teeno inhe achieve kar sakte hain. Design decision hamesha yeh hona chahiye: "kaunsa mechanism is specific problem ke liye simplest hai," na ki "sab kuch class banao." Yeh chapter pehle char pillars ko chhote independent examples se dikhata hai, phir unhe ek single synthesis project mein jodta hai jahan closures, `this` binding, classes aur array methods ek saath kaam karte hain.

> **Core takeaway:** Encapsulation protects valid transitions, rather than merely hiding fields.

## Encapsulation: hiding internal state

Encapsulation ka matlab hai internal state ko directly bahar se mutate hone se rokna, aur sirf controlled methods ke through interaction allow karna. Closures aur private class fields dono yeh achieve karte hain:

```js
// Closure-based encapsulation — no class needed
function createWallet(initialBalance = 0) {
  let balance = initialBalance; // truly private, no external reference exists
  return {
    deposit(amount) {
      if (amount <= 0) throw new Error("Deposit must be positive");
      balance += amount;
      return balance;
    },
    read() { return balance; }
  };
}

const wallet = createWallet(100);
wallet.deposit(50);
console.log(wallet.read()); // 150
console.log(wallet.balance); // undefined — no such property exists

// Class-based encapsulation — same guarantee via a private field
class Wallet {
  #balance;
  constructor(initialBalance = 0) { this.#balance = initialBalance; }
  deposit(amount) {
    if (amount <= 0) throw new Error("Deposit must be positive");
    this.#balance += amount;
    return this.#balance;
  }
  get balance() { return this.#balance; }
}
```

Closure version mein `balance` kahin bhi accessible nahi hai except returned methods ke through — yeh compile-time enforcement nahi, lekin lexical scoping se guaranteed hai. Class version mein `#balance` bhi outside se access/mutate nahi ho sakti; dono approaches same guarantee dete hain, sirf syntax aur multiple-instance ergonomics alag hain (class ka method prototype par shared hota hai, closure ka method har instance ke liye naya function object banata hai).

## Inheritance: sharing behavior across related types

Inheritance ek "is-a" relationship establish karta hai jahan child type parent ka behavior reuse karta hai:

```js
class Account {
  #balance = 0;
  constructor(owner) { this.owner = owner; }
  deposit(amount) { this.#balance += amount; return this.#balance; }
  get balance() { return this.#balance; }
}

class SavingsAccount extends Account {
  #interestRate;
  constructor(owner, interestRate) {
    super(owner); // must run before using `this`
    this.#interestRate = interestRate;
  }
  applyInterest() { return this.deposit(this.balance * this.#interestRate); }
}

const savings = new SavingsAccount("Asha", 0.05);
savings.deposit(1000);
console.log(savings.applyInterest()); // 1050
```

`extends` prototype chain ko link karta hai: `SavingsAccount.prototype`'s `[[Prototype]]` `Account.prototype` hai. Derived constructor `this` use karne se pehle `super()` call karna required hai — `Account`'s constructor hi hai jo `#balance` field aur `owner` property setup karta hai. Inheritance ko tab choose karo jab relationship genuinely "is-a" ho; jab sirf feature reuse karna ho aur relationship "has-a" ho, composition zyada flexible rehta hai (agla section).

## Composition as an alternative to deep hierarchies

```js
function withLogging(account) {
  const log = [];
  return {
    ...account,
    deposit(amount) {
      const result = account.deposit(amount);
      log.push({ type: "deposit", amount, at: Date.now() });
      return result;
    },
    history() { return [...log]; }
  };
}
```

Yahan `withLogging` kisi bhi account-shaped object ko logging capability se wrap kar deta hai, bina uska subclass banaye. Deep inheritance chains (`Account` → `LoggedAccount` → `LoggedSavingsAccount` → ...) fragile ho jaati hain jab multiple unrelated features combine karni ho; composition ek flat, mix-and-match structure deta hai.

## Polymorphism: same interface, different behavior

Polymorphism ka matlab hai ki different types same method name ko call karne par apna khud ka behavior de sakte hain, caller ko unke internal type ka pata hone ki zaroorat nahi:

```js
class CheckingAccount extends Account {
  withdraw(amount) {
    if (amount > this.balance) throw new Error("Insufficient funds");
    return this.deposit(-amount);
  }
}

class CreditAccount extends Account {
  #limit;
  constructor(owner, limit) { super(owner); this.#limit = limit; }
  withdraw(amount) {
    if (this.balance - amount < -this.#limit) throw new Error("Credit limit exceeded");
    return this.deposit(-amount);
  }
}

function processWithdrawal(account, amount) {
  return account.withdraw(amount); // caller doesn't care which subclass this is
}

const accounts = [new CheckingAccount("Kabir"), new CreditAccount("Meera", 500)];
accounts.forEach(account => account.deposit(100));
console.log(accounts.map(account => account.balance)); // [100, 100]
```

`processWithdrawal` sirf itna janta hai ki argument ke paas `withdraw` method hai — duck typing yahan JavaScript mein natural hai kyunki type checking structural hai, nominal nahi. Yeh JavaScript ka "objects with a `.withdraw()` method are interchangeable" style polymorphism hai, Java ke explicit interface implementation se looser lekin equally useful.

## Abstraction: exposing only what matters

Abstraction ka matlab hai complex implementation detail ko simple public interface ke peeche chhupana. Upar ke saare examples mein `#balance` field abstraction ka hi example hai — caller ko `deposit`/`withdraw` methods dikhte hain, underlying arithmetic aur validation nahi. Function-level abstraction bhi isi principle par chalti hai:

```js
class TransactionLedger {
  #entries = [];
  record(entry) { this.#entries.push({ ...entry, at: Date.now() }); }
  totalFor(type) {
    return this.#entries
      .filter(entry => entry.type === type)
      .reduce((sum, entry) => sum + entry.amount, 0);
  }
  // Internal filtering/reduction logic is hidden; callers only see the summary API.
}
```

Caller `totalFor("deposit")` call karta hai bina yeh jaane ki andar `filter` aur `reduce` chal rahe hain. Kal agar implementation ek indexed Map ya database query se replace ho jaaye, public contract same rehta hai — yehi abstraction ka real value hai.

## Common mistakes

- **Wrong assumption:** Private class fields (`#balance`) automatically deep-freeze bhi kar dete hain related object graph ko. **Why it breaks:** Private field sirf uske apne direct access ko restrict karta hai; agar `#balance` khud ek mutable object/array store karta hai, uska returned reference (jaise `get transactions() { return this.#log; }`) still directly mutable ho sakta hai bahar se. **Fix:** Getter se hamesha copy return karo (`return [...this.#log]`), original reference kabhi expose mat karo.
- **Wrong assumption:** Inheritance hamesha code reuse ka best tarika hai. **Why it breaks:** Multiple unrelated features (logging, retries, notifications) ko ek hi class hierarchy mein inherit karne ki koshish karne se fragile, deeply nested classes ban jaati hain jahan ek chhota change upar-niche sab kuch todh sakta hai. **Fix:** "is-a" relationship genuinely true ho tabhi extend karo; feature-mixing ke liye composition (wrapper functions/objects) prefer karo.
- **Wrong assumption:** Duck-typed polymorphism runtime type-safety guarantee deta hai. **Why it breaks:** `processWithdrawal` kisi bhi object ko accept kar lega jiske paas `withdraw` method ho, chahe woh semantically account hi na ho — koi compiler yeh check nahi karta. **Fix:** Production code mein runtime validation (jaise `typeof account.withdraw === "function"`) ya TypeScript jaisा static type layer add karo jab contract violations costly ho.

## Synthesis: a small banking state machine

Yeh capstone closures (private transaction log), `this` binding (method detachment risk), classes (account types) aur array methods (`reduce`, `filter`, `map`) ek saath exercise karta hai — exactly waisi combination jaisi ek real feature build karte waqt lagti hai.

```js
class Bank {
  #accounts = new Map(); // id -> { owner, balance }
  #transactions = [];    // append-only log, closure-private via the # field

  openAccount(id, owner, openingBalance = 0) {
    if (this.#accounts.has(id)) throw new Error(`Account ${id} already exists`);
    this.#accounts.set(id, { owner, balance: openingBalance });
    this.#record({ type: "open", id, amount: openingBalance });
    return id;
  }

  deposit(id, amount) {
    const account = this.#requireAccount(id);
    if (amount <= 0) throw new Error("Deposit must be positive");
    account.balance += amount;
    this.#record({ type: "deposit", id, amount });
    return account.balance;
  }

  withdraw(id, amount) {
    const account = this.#requireAccount(id);
    if (amount <= 0) throw new Error("Withdrawal must be positive");
    if (amount > account.balance) throw new Error("Insufficient funds");
    account.balance -= amount;
    this.#record({ type: "withdraw", id, amount });
    return account.balance;
  }

  transfer(fromId, toId, amount) {
    // Reuses withdraw/deposit so validation rules stay in one place.
    this.withdraw(fromId, amount);
    this.deposit(toId, amount);
    this.#record({ type: "transfer", from: fromId, to: toId, amount });
    return this.#accounts.get(fromId).balance;
  }

  statement(id) {
    this.#requireAccount(id);
    return this.#transactions.filter(entry => entry.id === id || entry.from === id || entry.to === id);
  }

  totalAssets() {
    return [...this.#accounts.values()].reduce((sum, account) => sum + account.balance, 0);
  }

  #requireAccount(id) {
    const account = this.#accounts.get(id);
    if (!account) throw new Error(`Unknown account: ${id}`);
    return account;
  }

  #record(entry) {
    this.#transactions.push({ ...entry, at: Date.now() });
  }
}

const bank = new Bank();
bank.openAccount("A1", "Asha", 500);
bank.openAccount("A2", "Kabir", 200);
bank.deposit("A1", 100);
bank.transfer("A1", "A2", 300);
console.log(bank.totalAssets()); // 700 (unchanged by transfer, since money moved internally)
console.log(bank.statement("A2").map(entry => entry.type)); // ["open", "deposit" (via transfer), "transfer"]
```

Kuch cheezein jo yeh example jaanbujh kar exercise karta hai:

- **Closures/private fields:** `#accounts` aur `#transactions` bahar se directly reachable nahi hain; sirf public methods hi interact kar sakte hain — encapsulation ka wahi guarantee jo upar dikhaya gaya.
- **`this` binding risk:** `bank.deposit` ko kahin standalone pass karoge (jaise `setTimeout(bank.deposit, 1000)`), `this` `bank` nahi rahega aur `#requireAccount` andar `this.#accounts` access karte hi crash karega. Callback pass karte waqt `bank.deposit.bind(bank)` ya arrow wrapper zaroori hai — exact wahi gotcha jo chapter 4 mein cover hua tha.
- **Array methods:** `statement` mein `filter`, `totalAssets` mein `reduce`, aur log formatting mein `map` — real reporting features isi tarah collection pipelines compose karke banti hain.
- **Validation-first design:** har mutating method (`deposit`/`withdraw`/`transfer`) apna precondition khud check karta hai aur throw karta hai; `transfer` in dono ko reuse karta hai taaki validation logic duplicate na ho.

## Practice

`Bank` class mein `closeAccount(id)` add karo jo balance zero hone par hi allow kare, warna throw kare. Phir `monthlyInterest(rate)` method add karo jo har account par `deposit` call kare based on current balance, aur verify karo ki `totalAssets()` correctly badhta hai. Last mein `bank.deposit` ko without binding kisi array `.map()` callback mein pass karke crash reproduce karo, phir fix karo.

## Interview questions

**Q. JavaScript "true" OOP language hai jaise Java?** JavaScript prototype-based object model use karta hai; `class` syntax usi model par ergonomic layer hai. Char pillars achieve ho sakte hain, lekin mechanism (prototypes/closures) Java ki class-based nominal typing se fundamentally different hai.

**Q. Composition ko inheritance se kab prefer karoge?** Jab relationship "is-a" nahi, "has-a"/"can-do" ho, ya jab multiple independent features (logging, retry, caching) ek object mein combine karni ho. Deep inheritance chains fragile hoti hain; composition flat aur mix-and-match rehta hai.

## Revision and practice lab

**Recall:** Close the notes and explain the core takeaway in your own words. Give one example before reading further.

**Apply:** An account has balance 100. Specify outcomes for withdrawing 30, then 80, then -5. How will callers know a withdrawal was rejected?

> **Hint:** Validate the amount and available balance before mutating state.

**Answer guide — compare after attempting:** The first withdrawal leaves 70. Reject the next two and retain 70: one exceeds the balance and the other is not a positive amount. Return a documented result or throw a documented error. A rejected transition must leave the account unchanged.

**Exit check:** Explain why your answer works, reproduce the result or decision without the guide, and identify one assumption that would change it. If you needed the hint, retry this lab in your next study session.

## Sources

[MDN Object-oriented JavaScript](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/Object_building_practice) prototypes aur classes dono style explain karta hai. [MDN private class features](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Private_properties) encapsulation ka current syntax reference hai.
