/**
 * ## Quick revision
 *
 * - `px` — CSS pixel; physical device pixel ke equal hona zaroori nahi.
 * - `rem` — root font-size ke relative; consistent scalable sizing.
 * - `em` — font-size mein parent, other lengths mein element font-size ke relative.
 * - `%` — property ke reference size par depend; har jagah parent width nahi.
 * - `vw`/`vh` — viewport width/height ka 1%.
 * - `svh`/`lvh`/`dvh` — small/large/dynamic viewport height ke 1%.
 * - `ch` — zero glyph ki advance width; text measure ka rough unit.
 * - `vmin`/`vmax` — viewport ki smaller/larger dimension ke relative.
 * - Line-height — unitless multiplier children ke font-size ke saath scale hota hai.
 * - `clamp(min, preferred, max)` — responsive size ko lower/upper limit mein rakho.
 * - Choice — fonts/spacing scalable rakho; viewport size aur zoom par verify karo.
 * - Percent height — containing block ki definite height na ho toh expected percentage sizing nahi mil sakti.
 * - Flex overflow — child ka automatic minimum size shrink rok sakta hai; needed case mein min-width:0.
 * - Zoom check — browser text zoom aur narrow viewport par clipping/overflow verify karo.
 */

// EXAMPLE:
const pxExample = {
    width: "200px",         // Hamesha 200px chauda (phone ho ya TV)
    fontSize: "16px",       // Hamesha 16px font (user ki setting se farak nahi)
    border: "1px solid #ccc" // 1px border — fix chahiye
};


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


// EXAMPLE:
const emExample = {
    // Agar parent ka font-size 20px hai:
    fontSize: "1.5em",     // 1.5 x 20px = 30px (parent se relative)
    padding: "0.5em 1em",  // padding bhi parent font-size se relative
    // Button me useful → font badhao to padding bhi automatically badhe!
};


// EXAMPLE:
const percentExample = {
    width: "50%",          // Parent ki aadhi width
    maxWidth: "100%",      // Parent se zyada nahi jaayega (images ke liye best)
    marginLeft: "auto",    // Combined with marginRight:auto → center ho jaata hai
    marginRight: "auto"
};


// EXAMPLE:
const vwExample = {
    width: "50vw",           // Screen ki aadhi width
    fontSize: "5vw",         // Screen width ke saath font badhe/ghate
    // Better approach:
    fontSize2: "clamp(1rem, 2.5vw, 3rem)"  // Min 1rem, max 3rem, beech me responsive
};


// EXAMPLE:
const vhExample = {
    height: "100vh",        // Screen ki puri height (desktop pe best)
    minHeight: "100dvh",    // Mobile friendly! (dynamic viewport height)
};


// EXAMPLES:
const otherUnits = {
    maxWidth: "65ch",    // Ideal reading width (60-80 characters per line)
    // Grid: grid-template-columns: 1fr 2fr;  → 2 columns (1/3 + 2/3)
};


const clampExample = {
    fontSize: "clamp(1rem, 2.5vw, 3rem)",       // Responsive font
    width: "clamp(300px, 50%, 800px)",            // Responsive width
    padding: "clamp(1rem, 3vw, 3rem)"             // Responsive padding
};
