# Code practice

Snippets — related chapter ke optional examples; framework setup/runtime pehle check karo.

## Encapsulation: hiding internal state

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

## Inheritance: sharing behavior across related types

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

## Polymorphism: same interface, different behavior

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

## Abstraction: exposing only what matters

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

## Synthesis: a small banking state machine

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
