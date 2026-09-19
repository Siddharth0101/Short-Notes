---
id: interview-react
title: React interview playbook
track: interview
order: 3
level: Intermediate
minutes: 31
summary: React interview mein visible behavior aur state ownership samjhao; hook names yaad hona akela kaafi nahi.
tags: react, interview, effects, state, performance
visual: react-render
---

## Mental model — simple soch

React interview ka core hai state se UI derive karna aur external systems ke saath synchronization correct rakhna. Hook names list karne ke bajaye render, identity aur ownership ka model explain karo. Har proposed optimization ke saath measurement aur failure case hona chahiye.

> **Core takeaway:** React interview mein visible behavior aur state ownership samjhao; hook names yaad hona akela kaafi nahi.

## Representative questions and answers

**Why does calling setCount(count + 1) three times often add only one?** Same handler render snapshot ka same count read karta hai, so teen updates same replacement request karte hain. Previous queued value par sequential transformation chahiye to `setCount(c => c + 1)` three times use karo. Updater pure hona chahiye.

**When should an effect be removed?** Agar value props/state se render ke waqt calculate ho sakti hai, extra state plus synchronization effect unnecessary ho sakta hai. User action ka direct consequence event handler mein handle karo. Effect ko subscription, browser API ya another external system synchronization ke liye rakho.

**Why do keys affect input bugs?** List item state identity key aur tree position se associated hoti hai. Index keys reorder ke baad existing state ko different logical record se attach kar sakti hain. Stable database IDs usually suitable hain; random key every render remount karwa sakti hai.

**Why does memo not prevent every rerender?** Component apni state ya consumed context update se render kar sakta hai. Parent se new object/function reference bhi shallow prop equality fail kara sakti hai. memo optimization hai; correctness uske caching behavior par depend nahi honi chahiye.

**Why does wrapping a context value in useMemo matter?** Provider ke `value={{ state, dispatch }}` jaisa inline object literal har render par naya reference banata hai, chahe `state` aur `dispatch` khud unchanged hon. Us context ko read karne wala har consumer isi naye reference ki wajah se re-render hoga. `useMemo(() => ({ state, dispatch }), [state])` se identity tabhi change hoti hai jab actual dependency change ho. Bade apps mein isse aage state aur dispatch ko alag contexts mein split karna common hai, taaki dispatch-only consumers state update par bilkul re-render na hon.

**Why does React warn about a controlled input changing from uncontrolled?** Agar `value` prop initially `undefined` ho aur baad mein defined value mile (ya vice versa), React input ko uncontrolled-se-controlled transition karta hua detect karta hai aur console warning deta hai. Root cause usually state ko `undefined`/`null` se initialize karna hota hai jab actual intent controlled input hi tha. Fix simple hai: initial state ko hamesha empty string (`useState("")`) se start karo, kabhi `undefined` se nahi, taaki `value` ka type consistently string rahe pehle render se lekar aakhri tak.

**When would you reach for useLayoutEffect instead of useEffect?** `useEffect` browser paint ke baad asynchronously chalta hai — zyadatar synchronization (data fetch, subscriptions, listeners) ke liye yehi sahi choice hai. `useLayoutEffect` paint se pehle synchronously chalta hai, isliye sirf tab use karo jab DOM measurement lekar turant usi commit mein visual adjustment karna ho — jaise tooltip ki position calculate karke reposition karna, taaki user ko ek frame ke liye galat position flash na ho. Overuse paint ko block karta hai aur perceived performance kharab kar sakta hai, isliye default `useEffect` hi rakho.

**How do you handle a failed optimistic update?** Optimistic update mein mutation start hote hi UI turant naya (assumed) result dikha deta hai, request background mein chalti rehti hai. Failure case ke liye teen cheezein zaroori hain: mutation shuru hone se pehle current cache ka snapshot lena, request fail hone par us snapshot se explicitly rollback karna (`onError` handler mein), aur settle hone ke baad server se actual truth ke saath reconcile karna (`onSettled` mein invalidate/refetch). Rollback step skip karna sabse common bug hai — usse UI ek aisi state mein stuck reh jaata hai jo server par kabhi exist hi nahi hua.

## Coding drill

Ek searchable list banao jisme loading, error, empty aur successful states visible hon. Data fetching contract supplied hai; below pattern stale-result protection illustrate karta hai.

```jsx
useEffect(() => {
  let active = true;
  const controller = new AbortController();
  setStatus('loading');
  loadResults(query, { signal: controller.signal })
    .then(data => {
      if (!active) return;
      setResults(data);
      setStatus('success');
    })
    .catch(error => {
      if (!active || error.name === 'AbortError') return;
      setStatus('error');
    });
  return () => {
    active = false;
    controller.abort();
  };
}, [query]); // assume loadResults is a stable imported function
```

Real application mein framework loader ya server-state library caching, deduplication aur retries centralize kar sakti hai. Example ka goal lifecycle reasoning hai. Previous results loading ke dauran retain karne hain ya clear, ye UX decision explicitly lo; request failure par meaningful retry control do.

## A 40-minute mock

5 minutes requirements clear karo, 15 mein working component, 8 mein race/error handling, 7 mein accessibility aur 5 mein performance discuss karo. Keyboard se complete flow try karo. Labels, focus visibility, loading announcements aur stable keys verify karo. Snapshot testing alone interaction correctness prove nahi karta.

## Self-review rubric

State ownership, effect correctness, identity, accessibility aur testable behavior ko separately 0–2 score do. Strong implementation derived values duplicate state mein nahi rakhti, cleanup coherent rakhti hai, aur errors ko UI state banati hai. Performance answer bottleneck measure karke virtualization, pagination ya memoization select kare; sab hooks add karna strategy nahi.

## Practice and answer

**Prompt:** Parent ke every keystroke par 5,000 rows render hoti hain. First response?

**Answer:** React Profiler aur browser performance data se render/commit/DOM cost locate karo. Search input state ko appropriate owner par rakho; large visible DOM ho to virtualization, expensive filtering ho to memoization/worker, network volume ho to server querying evaluate karo.

## Assessed mock: React machine-coding round

**Prompt:** Sortable editable table banao jisme shareable filters aur loading/error states hon.

**Round structure:** 5 minute requirements/assumptions clear karo, 20 minute core flow implement/draw karo, 10 minute failures inspect karo, aur 5 minute tradeoffs defend karo. Yeh practice timings hain; kisi company ke exact interview format ka claim nahi.

**Failure injection:** Sorting ke dauran edit karo; Back navigate karo; newer search ke baad stale response complete karwao.

**Strong-answer evidence:** Stable identity, state ownership, accessible controls aur deterministic race handling dikhao.

Correctness, concrete example, failure handling aur tradeoff reasoning ko 0–2 score do. 0=missing/incorrect; 1=plausible par untested; 2=trace, test ya invariant se demonstrated. Total achha ho lekin correctness gap ho toh revision abhi bhi chahiye.

Round ke baad first approach todne wala smallest counterexample likho, fix karo aur notes dekhe bina change bolkar samjhao. Mock repeat karne se pehle chapter ke answer-reveal questions se focused revision karo.

## Research notes: Demonstrate component behavior

Linked Amazon guidance fundamentals ko problems par apply karne par focus karti hai; sirf details ratna learning goal nahi hai.

**Original practice round:** Dialog editor mein Save tak draft rakho, Cancel par discard karo. Draft ownership aur focus restoration explain karo.

**Failure injection:** Open draft ke dauran selected record badlo; Escape se dialog close karo.

**Evidence to bring:** Record identity, save/cancel, keyboard aur focus destination test karo. Record change draft preserve karega ya discard, clear bolo.

Employer source assessment approach ka reference hai. Yeh exercise original practice hai; reported company question nahi.

**Interview check:** Attempt ke baad is round ko review kaise karoge?

**Answer:** First failing example save karo, wrong assumption batao aur fix se behavior kaise badla dikhao. Jo demonstrate kiya aur jo extra time mein investigate karoge, unhe clearly identify karo.

**Practice:** Different failure ke saath repeat karo aur reasoning bolte jao.

[Source yahan padho — Amazon Careers](https://amazon.jobs/content/en/how-we-hire/interview-prep/software-development-topics). 13 September 2026 ko review kiya gaya; yahan ke examples aur exercises is repo ke liye likhe gaye hain.

## Depth walkthrough — andar kya ho raha hai?

### React answer ko user action ke trace se ground karo

Question “useEffect kya hai” ho toh timer/listener/request ka setup-cleanup lifecycle example do. Question rerender ho toh props/state/context trigger aur identity retention distinguish karo. Question performance ho toh actual measured bottleneck aur optimization validation batao.

Machine coding mein pending/error/empty states aur accessible keyboard actions initial contract ka part hon. Stable item ID state ownership preserve kare; index key sort/delete case se challenge karo. URL, local draft aur remote cache ka owner clearly name karo.

**Mock drill:** Type A, type B, B completes, A completes. Latest visible result justify karo. Save fail hone par draft retained rahe. UI test asynchronous result await kare; DOM simulation real paint/contrast prove nahi karti. Answer mein library names ke saath mechanism aur boundary bhi hon.

## Revision and practice lab — khud karke samjho

**Recall — yaad karke bolo:** Notes band karke main concept apne words mein samjhao. Aage padhne se pehle apna ek example do.

**Apply — khud try karo:** Filtered editable list mein drafts galat rows par chale jaate hain. Paanch minute mein diagnosis, minimal fix aur regression check do.

> **Hint — chhota ishara:** Effects add karne se pehle pucho: har draft kis item identity ka hai?

**Answer guide — pehle khud karo, phir compare karo:** Index/unstable keys aur position-based draft storage check karo. Stable item IDs se keys aur drafts associate karo. Ek row mein type karke filter, reorder aur prepend karo; draft usi item ke saath rehna chahiye. Intentional reset aur accidental remount ka difference samjhao.

**Exit check — aage badhne se pehle:** Samjhao ki tumhara answer kyun kaam karta hai. Guide dekhe bina result ya decision dobara nikalo. Ek aisi condition batao jiske badalne par answer badlega. Hint lena pada ho toh agle study session mein yeh lab phir attempt karo.

## Source check
[React state snapshots](https://react.dev/learn/state-as-a-snapshot), [effect synchronization](https://react.dev/learn/synchronizing-with-effects), aur [memo reference](https://react.dev/reference/react/memo) core behavior explain karte hain.

## UI project ka evidence-based walkthrough

Original prompt: “Tumhare form/table project mein sabse difficult behavior kya tha?” Features ki list ke bajay one journey choose karo: keyboard user field fill karta hai, save fail hota hai, input bachta hai aur retry succeed hoti hai. Component ownership, accessible names, pending/error states aur stale-response decisions trace karo.

Apne contribution aur team decisions clearly separate bolo. Snapshot pass ko accessibility certification mat bolo. DOM test, real browser layout aur manual keyboard review alag evidence hain. Unknown screen-reader behavior par guess karne ke bajay next validation step batao.

**Practice:** Reviewer kehta hai ki test implementation details se coupled hai. **Answer guide:** Hook setter count/class selector assertion dikhao, phir user interaction plus visible status/accessible control ke assertion mein rewrite karo. Refactor ke baad behavior same ho toh test stable rehna chahiye. Actual UX wording intentional contract ho sakti hai; har string change ko meaningless mat bolo.

[React testing lab](../react/12-testing-accessibility.md) se positive, rejected aur retry paths practice karo.

## Machine coding — implementation round bhi karo

[Machine coding practice bank](../MACHINE_CODING_PRACTICE.md) mein apne subject ke do P1 rounds se shuru karo. Prompt ke acceptance checks answer reveal se pehle attempt karo; timebox ke baad demo, scorecard aur interviewer follow-up complete karo. Java backend ke liye Java aur Spring Boot, MongoDB ke liye Node aur MongoDB, frontend ke liye HTML/CSS aur React/Redux ke rounds bhi lo.
