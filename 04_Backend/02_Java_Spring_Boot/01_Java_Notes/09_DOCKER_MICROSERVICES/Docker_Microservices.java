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
 * - Artifact — same tested build ko environments mein promote karo.
 * - Container — application + runtime package; secrets image mein mat bake karo.
 * - Configuration — environment se inject; startup par validate.
 * - Readiness — ready hone par hi traffic do.
 * - Graceful shutdown — traffic drain, in-flight wait aur resources close.
 * - Deployment — small rollout, health checks aur rollback plan.
 * - Capstone — validation, auth, transaction, duplicate retry aur recovery verify karo.
 * - Image/container — packaged filesystem/runtime template aur uska running instance.
 * - Dockerfile — build recipe; smaller trusted base aur layered cache useful.
 * - Network — containers service names se communicate; localhost current container hai.
 * - Volume — container lifecycle se alag persistent data.
 * - Compose — related services/config/network local stack mein define.
 * - Gateway/discovery — routing aur service location; failure behavior design karo.
 * - Feign/client — remote call phir bhi timeout/retry/error boundary maangti hai.
 * - Trace — cross-service correlation IDs/spans se request follow karo.
 * - 401/403 — missing/invalid authentication / insufficient permission ka contract.
 * - Method security — service entry par authorization; object ownership check phir bhi explicit.
 * - Credential rotation — old/new key overlap, expiry aur revocation ka rollout plan rakho.
 */

public class Docker_Microservices {
    public static void main(String[] args) {
        System.out.println("===== Docker & Microservices =====");
        System.out.println("Docker: 'It works on my machine' works EVERYWHERE!");
        System.out.println("FeignClient: Declarative inter-service REST calls.");
        System.out.println("Zipkin: See the full request journey across all microservices.");
        System.out.println("Volumes: Container data survives restarts and deletions.");
    }
}
