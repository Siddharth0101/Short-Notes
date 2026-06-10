/**
 * ========================================================================
 * CSS UNITS — COMPLETE GUIDE (px, rem, em, vw, vh, %, and more)
 * ========================================================================
 * NOTES:
 * - CSS me jab hum size set karte hain (width, height, font-size, padding, margin),
 *   to alag-alag UNITS use karte hain.
 * - Ye units 2 main types ki hoti hain:
 *   1. ABSOLUTE (Fixed — screen size se koi farak nahi padta)
 *   2. RELATIVE (Kisi cheez ke base pe change hoti hain — responsive!)
 * 
 * GOLDEN RULE:
 * - Responsive design me RELATIVE units use karo (rem, vw, vh, %).
 * - Sirf borders, shadows, ya jahan EXACT size chahiye wahan px use karo.
 */


/**
 * ========================================================================
 * 1. px (Pixels) — ABSOLUTE UNIT
 * ========================================================================
 * NOTES:
 * - Ye ABSOLUTE unit hai — FIXED rehti hai, kabhi change nahi hoti.
 * - 1px = screen ke display ka ek dot (pixel).
 * - Screen size kitna bhi bada ya chota ho, px ka size SAME rahega.
 * 
 * PROS:
 * - Bahut EXACT aur PRECISE control milta hai.
 * - Borders, shadows, small icons ke liye perfect.
 * 
 * CONS:
 * - RESPONSIVE design me problem! Mobile/Desktop pe same size dikhega.
 * - ACCESSIBILITY issue: Agar user ne browser me font size "Large" kiya hai,
 *   to px wala text wahi FIX rahega — user ko padhne me dikkat hogi.
 * 
 * KAB USE KARO:
 * - border: 1px solid black (border fix chahiye)
 * - box-shadow: 0 2px 4px rgba(0,0,0,0.1)
 * - Chhote icons jinka size change nahi hona chahiye
 */
// EXAMPLE:
const pxExample = {
    width: "200px",         // Hamesha 200px chauda (phone ho ya TV)
    fontSize: "16px",       // Hamesha 16px font (user ki setting se farak nahi)
    border: "1px solid #ccc" // 1px border — fix chahiye
};


/**
 * ========================================================================
 * 2. rem (Root EM) — RELATIVE UNIT (Sabse Important!)
 * ========================================================================
 * NOTES:
 * - Ye RELATIVE unit hai — ye ROOT element (<html> tag) ke font-size pe depend hai.
 * - Browser ka default root font-size = 16px.
 * - So: 1rem = Root ka font-size (default 16px).
 * - 2rem = 2 x 16px = 32px.
 * - 0.5rem = 0.5 x 16px = 8px.
 * 
 * AGAR ROOT FONT-SIZE BADAL DO:
 * - html { font-size: 20px; }  →  ab 1rem = 20px, 2rem = 40px!
 * - Saari rem values AUTOMATICALLY adjust ho jayengi!
 * 
 * 62.5% TRICK (Popular in industry!):
 * - html { font-size: 62.5%; }  →  16px x 62.5% = 10px
 * - Ab 1rem = 10px (calculation AASAN ho gayi!)
 * - 1.6rem = 16px, 2.4rem = 24px, 3.2rem = 32px
 * 
 * WHY USE REM?:
 * 1. ACCESSIBILITY: Agar user ne browser settings me font "Large" kiya hai,
 *    to rem AUTOMATICALLY bada ho jayega. px nahi badlega — user ko dikkat hogi.
 * 2. SCALABILITY: Ek jagah (root) font-size change karo, PURI website adjust!
 * 3. CONSISTENCY: Puri website me ek BASE se saare sizes nikalte hain.
 * 
 * MODERN BEST PRACTICE:
 * - font-size, padding, margin, gap → rem use karo.
 * - Borders, shadows → px use karo.
 */
// EXAMPLE (Default: 1rem = 16px):
const remExample = {
    padding: "2rem",       // 2 x 16px = 32px
    fontSize: "1.5rem",    // 1.5 x 16px = 24px
    marginBottom: "1rem",  // 1 x 16px = 16px
    gap: "0.5rem"          // 0.5 x 16px = 8px
};

// 62.5% TRICK EXAMPLE:
// CSS: html { font-size: 62.5%; }  → 1rem = 10px
const remTrickExample = {
    fontSize: "1.6rem",    // 1.6 x 10px = 16px (Easy math!)
    padding: "2.4rem",     // 2.4 x 10px = 24px
    width: "30rem"         // 30 x 10px = 300px
};


/**
 * ========================================================================
 * 3. em (EM) — RELATIVE TO PARENT
 * ========================================================================
 * NOTES:
 * - rem ROOT se relative hai, par em PARENT ELEMENT ke font-size se relative hai!
 * - Agar parent ka font-size 20px hai → 1em = 20px (us element ke liye).
 * - Agar koi parent me font nahi set hai → inherited font-size use hoga.
 * 
 * PROBLEM — COMPOUNDING (Nesting trap!):
 * - em NEST hone pe multiply hota rehta hai!
 * - Parent: font-size 1.5em = 24px (16 x 1.5)
 * - Child: font-size 1.5em = 36px! (24 x 1.5 = parent ka 1.5 guna)
 * - Grandchild: font-size 1.5em = 54px!! (36 x 1.5)
 * - Ye UNPREDICTABLE ho jaata hai!
 * 
 * rem vs em:
 * - rem = HAMESHA root (<html>) se calculate. Predictable. Safe.
 * - em  = PARENT se calculate. Nesting me unpredictable. Risky.
 * 
 * KAB USE KARO em?:
 * - Jab chahte ho ki element ka size uske PARENT ke hisaab se badhe.
 * - Buttons ke andar padding: 0.5em 1em → button ka font badha to padding bhi badhegi!
 * - Par FONT-SIZE ke liye em AVOID karo — rem use karo.
 */
// EXAMPLE:
const emExample = {
    // Agar parent ka font-size 20px hai:
    fontSize: "1.5em",     // 1.5 x 20px = 30px (parent se relative)
    padding: "0.5em 1em",  // padding bhi parent font-size se relative
    // Button me useful → font badhao to padding bhi automatically badhe!
};


/**
 * ========================================================================
 * 4. % (Percentage) — RELATIVE TO PARENT SIZE
 * ========================================================================
 * NOTES:
 * - Percentage PARENT ELEMENT ki size ke relative hoti hai.
 * - width: 50% → Parent ki width ka 50% (half).
 * - font-size: 120% → Parent ke font-size ka 120%.
 * - DIFFERENT PROPERTIES KE LIYE ALAG REFERENCE:
 *   width:   → parent ki WIDTH ka %
 *   height:  → parent ki HEIGHT ka % (parent ki height SET honi chahiye!)
 *   padding: → parent ki WIDTH ka % (haan, padding TOP/BOTTOM bhi WIDTH se calculate!)
 *   margin:  → parent ki WIDTH ka %
 * 
 * HEIGHT % KA TRAP:
 * - height: 50% kaam NAHI karega agar parent ki height DEFINED nahi hai!
 * - Parent ko explicit height do (px, vh, etc.) ya html/body ko height: 100% do.
 */
// EXAMPLE:
const percentExample = {
    width: "50%",          // Parent ki aadhi width
    maxWidth: "100%",      // Parent se zyada nahi jaayega (images ke liye best)
    marginLeft: "auto",    // Combined with marginRight:auto → center ho jaata hai
    marginRight: "auto"
};


/**
 * ========================================================================
 * 5. vw (Viewport Width) — RELATIVE TO SCREEN WIDTH
 * ========================================================================
 * NOTES:
 * - Viewport = Browser window ka VISIBLE AREA (jo screen pe dikh raha hai).
 * - 1vw = Screen ki total WIDTH ka 1%.
 * - Agar screen 1000px wide hai → 1vw = 10px.
 * - Agar screen 500px wide hai  → 1vw = 5px.
 * - Window resize ho ya mobile rotate ho → vw AUTOMATICALLY adjust!
 * 
 * KAB USE KARO:
 * - Full-width sections: width: 100vw
 * - Responsive font-size (par dhyan se!)
 *   font-size: 5vw → bahut bada ho sakta hai bade screens pe!
 *   BETTER: font-size: clamp(1rem, 2.5vw, 3rem) → min/max limit ke saath.
 * 
 * PROBLEM WITH 100vw:
 * - 100vw me SCROLLBAR ki width bhi include hoti hai!
 * - Isliye horizontal scrollbar aa sakta hai.
 * - FIX: width: 100% use karo (ye scrollbar exclude karta hai).
 */
// EXAMPLE:
const vwExample = {
    width: "50vw",           // Screen ki aadhi width
    fontSize: "5vw",         // Screen width ke saath font badhe/ghate
    // Better approach:
    fontSize2: "clamp(1rem, 2.5vw, 3rem)"  // Min 1rem, max 3rem, beech me responsive
};


/**
 * ========================================================================
 * 6. vh (Viewport Height) — RELATIVE TO SCREEN HEIGHT
 * ========================================================================
 * NOTES:
 * - Same as vw, par HEIGHT ke liye.
 * - 1vh = Screen ki total HEIGHT ka 1%.
 * - Agar screen 800px high hai → 1vh = 8px.
 * 
 * KAB USE KARO:
 * - Full-screen hero sections: height: 100vh (puri screen cover!)
 * - Landing page ka first fold
 * - Full-screen modals/overlays
 * 
 * MOBILE PROBLEM WITH 100vh:
 * - Mobile browsers me address bar (URL bar) show/hide hoti hai.
 * - 100vh address bar KE SAATH calculate hota hai → content neeche cut ho jaata hai!
 * - FIX: Modern CSS me dvh (dynamic vh) use karo:
 *   height: 100dvh → ye address bar ko account karta hai!
 *   svh = smallest viewport height (address bar visible)
 *   lvh = largest viewport height (address bar hidden)
 *   dvh = dynamic (actively change hota hai)
 */
// EXAMPLE:
const vhExample = {
    height: "100vh",        // Screen ki puri height (desktop pe best)
    minHeight: "100dvh",    // Mobile friendly! (dynamic viewport height)
};


/**
 * ========================================================================
 * 7. NEW VIEWPORT UNITS — svh, lvh, dvh, svw, lvw, dvw (Modern CSS)
 * ========================================================================
 * NOTES:
 * - Ye MOBILE browsers ke liye solve karte hain purani 100vh ki problem!
 * 
 * | Unit | Full Name              | Kya hai?                                    |
 * |------|------------------------|---------------------------------------------|
 * | svh  | Small Viewport Height  | Address bar VISIBLE hai (smallest screen)   |
 * | lvh  | Large Viewport Height  | Address bar HIDDEN hai (largest screen)     |
 * | dvh  | Dynamic Viewport Height| Address bar show/hide ke saath CHANGE hota hai|
 * | svw  | Small Viewport Width   | Same concept, width ke liye                 |
 * | lvw  | Large Viewport Width   | Same concept, width ke liye                 |
 * | dvw  | Dynamic Viewport Width | Same concept, width ke liye                 |
 * 
 * RECOMMENDATION:
 * - Mobile full-screen sections ke liye: min-height: 100dvh (best practice!)
 * - Desktop pe svh, lvh, dvh sab SAME kaam karte hain (address bar issue nahi).
 */


/**
 * ========================================================================
 * 8. OTHER USEFUL UNITS
 * ========================================================================
 * 
 * A) ch (Character Width):
 *    - 1ch = "0" character ki width (current font me).
 *    - Reading ke liye ideal line width: max-width: 65ch
 *    - Ye typography me bahut useful hai!
 * 
 * B) vmin & vmax:
 *    - vmin = viewport ki CHHOTI side ka 1% (width ya height jo chhoti ho)
 *    - vmax = viewport ki BADI side ka 1% (width ya height jo badi ho)
 *    - Use: Elements jo portrait/landscape dono me sahi dikhe.
 * 
 * C) fr (Fraction — CSS Grid me):
 *    - Sirf CSS GRID me use hota hai.
 *    - Available space ko fractions me divide karta hai.
 *    - grid-template-columns: 1fr 2fr → 1/3 aur 2/3 space
 */
// EXAMPLES:
const otherUnits = {
    maxWidth: "65ch",    // Ideal reading width (60-80 characters per line)
    // Grid: grid-template-columns: 1fr 2fr;  → 2 columns (1/3 + 2/3)
};


/**
 * ========================================================================
 * 9. WHEN TO USE WHAT? (Practical Guide)
 * ========================================================================
 * 
 * | Property         | Best Unit    | Why?                                     |
 * |------------------|-------------|------------------------------------------|
 * | font-size        | rem         | Accessible, scalable, consistent         |
 * | padding/margin   | rem ya em   | Scales with text, responsive             |
 * | width            | % ya vw     | Responsive to parent/screen              |
 * | max-width        | rem ya ch   | Readable content width (65ch/1200px)     |
 * | height (hero)    | vh ya dvh   | Full screen sections                     |
 * | border           | px          | Thin lines fix chahiye                   |
 * | box-shadow       | px          | Precise shadow control                   |
 * | gap (flex/grid)  | rem         | Consistent spacing                       |
 * | media queries    | em          | Browser zoom ke saath work karta hai      |
 * | line-height      | unitless    | 1.5 (number, no unit — best practice!)   |
 * 
 * GENERAL RULES:
 * 1. Font sizes → HAMESHA rem (accessibility ke liye)
 * 2. Spacing (padding/margin) → rem ya em
 * 3. Widths → % ya max-width me rem/ch 
 * 4. Heights (full screen) → vh ya dvh
 * 5. Borders/shadows → px
 * 6. line-height → unitless number (1.5, 1.6)
 */


/**
 * ========================================================================
 * 10. CSS clamp() — RESPONSIVE SIZING KA SUPERHERO
 * ========================================================================
 * NOTES:
 * - clamp(MIN, PREFERRED, MAX) → ek value deta hai jo MIN aur MAX ke beech me ho.
 * - Screen size ke hisaab se AUTOMATICALLY adjust hota hai.
 * - Media queries ke bina RESPONSIVE font/size!
 * 
 * SYNTAX: clamp(minimum, preferred, maximum)
 * 
 * EXAMPLE:
 *   font-size: clamp(1rem, 2.5vw, 3rem);
 *   - Minimum: 1rem (chote screen pe isse chhota nahi hoga)
 *   - Preferred: 2.5vw (screen ke saath scale karega)
 *   - Maximum: 3rem (bade screen pe isse bada nahi hoga)
 * 
 * ISKA FAYDA:
 * - Bina media queries ke fluid responsive design!
 * - Font size, width, padding — sab me use kar sakte ho.
 */
const clampExample = {
    fontSize: "clamp(1rem, 2.5vw, 3rem)",       // Responsive font
    width: "clamp(300px, 50%, 800px)",            // Responsive width
    padding: "clamp(1rem, 3vw, 3rem)"             // Responsive padding
};


/*
========================================================================
FINAL REVISION TABLE — CSS UNITS CHEAT SHEET
========================================================================

| Unit  | Type     | Relative to what?                | Best for?                         |
|-------|----------|----------------------------------|-----------------------------------|
| px    | Absolute | Fixed (screen pixel)             | Borders, shadows, small icons     |
| rem   | Relative | Root <html> font-size (def: 16px)| Font-size, padding, margin, gap   |
| em    | Relative | Parent element ka font-size      | Button padding (scales with font) |
| %     | Relative | Parent element ki size           | Widths, layouts                   |
| vw    | Relative | Viewport (screen) ki width 1%    | Full-width sections, fluid sizing |
| vh    | Relative | Viewport (screen) ki height 1%   | Full-screen hero sections         |
| dvh   | Relative | Dynamic viewport height          | Mobile-friendly full screen       |
| ch    | Relative | "0" character ki width           | Max-width for reading (65ch)      |
| fr    | Relative | Available space (Grid only)      | CSS Grid column/row sizing        |
| vmin  | Relative | Viewport ki chhoti side 1%       | Responsive in both orientations   |
| vmax  | Relative | Viewport ki badi side 1%         | Responsive in both orientations   |

========================================================================
QUICK RULES:
- Fonts     → rem (accessibility!)
- Spacing   → rem ya em
- Widths    → % ya max-width
- Heights   → vh ya dvh (full screen)
- Borders   → px
- line-height → unitless (1.5)
- Responsive → clamp(min, preferred, max)
========================================================================
*/
