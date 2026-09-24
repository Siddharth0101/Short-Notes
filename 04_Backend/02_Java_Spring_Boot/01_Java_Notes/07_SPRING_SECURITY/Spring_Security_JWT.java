/**
 * ## Quick revision
 *
 * - Authentication — user kaun; authorization — kya access allowed.
 * - Security filter chain — request controller se pehle security filters se guzarti hai.
 * - JWT — signature, issuer, audience aur expiry validate; payload default encrypted nahi.
 * - Password — adaptive password hash; plaintext/reversible storage nahi.
 * - CSRF — browser auto-sent credentials wale requests par protection socho.
 * - CORS — browser cross-origin policy; authorization ka replacement nahi.
 * - Microservice call — timeout, bounded retry aur identity propagation.
 * - Object access — har resource par user/tenant permission check karo.
 * - 401/403 — missing/invalid authentication / insufficient permission ka contract.
 * - Method security — service entry par authorization; object ownership check phir bhi explicit.
 * - Credential rotation — old/new key overlap, expiry aur revocation ka rollout plan rakho.
 */

public class Spring_Security_JWT {
    public static void main(String[] args) {
        System.out.println("Security Rule #1: Never store plain text passwords! Use BCrypt.");
        System.out.println("Security Rule #2: Stateless Microservices use JWTs.");
        System.out.println("Security Rule #3: REST APIs disable CSRF because they don't use cookies.");
        System.out.println("Security Rule #4: Fix frontend blocking with correct CORS configuration.");
    }
}
