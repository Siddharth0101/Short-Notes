/**
 * ========================================================================
 * CSS UNITS IN SHORT: px, rem, vw, vh
 * ========================================================================
 * NOTES:
 * - CSS me jab hum size (width, height, font-size, etc.) set karte hain, to alag-alag 
 *   units use karte hain. Ye units mostly 2 types ki hoti hain:
 *   1. ABSOLUTE (Fixed, jaise 'px')
 *   2. RELATIVE (Screen ya parent par depend karti hain, jaise 'rem', 'vw', 'vh')
 */

/**
 * ========================================================================
 * 1. px (Pixels)
 * ========================================================================
 * NOTES:
 * - Ye 'Absolute' unit hai. Matlab fixed rehti hai.
 * - 1px screen ke ek dot (pixel) ke barabar hota hai.
 * - Screen size kitna bhi bada ya chota ho, px ka size nahi badalta.
 * 
 * PROS: Bahut exact aur precise control milta hai.
 * CONS: Responsive design (mobile friendly) banane me problem aati hai, kyunki 
 *       agar aapne font-size: 24px diya hai, to mobile/desktop har jagah utna hi 
 *       bada dikhega (fix rahega).
 */
// EXAMPLE USAGE:
const pxExample = {
    width: "200px",  // Hamesha 200px chauda hoga (Fix)
    fontSize: "16px" // Hamesha 16px font size rahega
};

/**
 * ========================================================================
 * 2. rem (Root EM)
 * ========================================================================
 * NOTES:
 * - Ye 'Relative' unit hai. Ye aapke HTML ke 'root' (mostly <html> tag) ke font-size 
 *   par depend karti hai.
 * - Browser ka default root font-size usually 16px hota hai.
 * - So, 1rem = Root ka font size (default: 16px).
 * - Agar aap root ka font-size badal do, to saari rem values automatically adjust 
 *   ho jayengi! (Maan lo root ko 20px kar diya, to 2rem = 40px ho jayega).
 * 
 * WHY USE REM?:
 * - Accessibility ke liye dhansu hai! Agar kisi user ne browser setting me jake 
 *   apna font 'Large' kar rakha hai, to 'rem' usko bada text dikhayega. Par 'px' 
 *   wahi fix rahega aur unhe padhne me dikkat hogi.
 * - Modern websites me 'px' ki jagah mostly 'rem' hi use hota hai (specially for typography/margins).
 */
// EXAMPLE USAGE:
// Assuming Default Browser <html> font-size = 16px:
const remExample = {
    padding: "2rem",   // 2 * 16px = 32px
    fontSize: "1.5rem" // 1.5 * 16px = 24px
};

/**
 * ========================================================================
 * 3. vw (Viewport Width)
 * ========================================================================
 * NOTES:
 * - Viewport ka matlab hai "User ki screen ka visible area" (Browser window).
 * - 1vw = Screen ki total width ka 1%.
 * - Agar screen ki width 1000px hai, to 1vw = 10px hoga. 
 * - Agar user window ko resize karta hai (ya mobile rotate karta hai), to vw ki value 
 *   automatically usi hisaab se change ho jati hai.
 */
// EXAMPLE USAGE:
const vwExample = {
    width: "50vw" // Screen ki aadhi width (50%) cover karega chahe phone ho ya TV.
};

/**
 * ========================================================================
 * 4. vh (Viewport Height)
 * ========================================================================
 * NOTES:
 * - Same as vw, but Height ke liye.
 * - 1vh = Screen ki total height ka 1%.
 * - Agar screen ki height 800px hai, to 1vh = 8px.
 * - Full-screen section ya hero-banner (jo puri screen ghere) banane ke liye 
 *   '100vh' best hota hai.
 */
// EXAMPLE USAGE:
const vhExample = {
    height: "100vh" // Screen ki puri height cover karega (Pura 100% visible area)
};

/*
========================================================================
FINAL REVISION TABLE
========================================================================
| CSS Unit | Type      | Kiske base par kaam karta hai? (Meaning)           | Use kab karein?                                     |
|----------|-----------|----------------------------------------------------|-----------------------------------------------------|
| px       | Absolute  | Screen ka ek pixel (Fixed size).                   | Borders, chote icons, ya jaisa layout fix chahiye ho.|
| rem      | Relative  | Root (<html>) ka font-size (Default: 16px).        | Fonts, Margins, Paddings (Accessibility friendly).  |
| vw       | Relative  | Window/Screen ki 1% Width.                         | Screen ki width ke hisaab se element resize karna.  |
| vh       | Relative  | Window/Screen ki 1% Height.                        | Full screen Hero sections (100vh) banane me.        |
========================================================================
*/
