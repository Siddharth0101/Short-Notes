/**
 * ## Quick revision
 *
 * - Servlet — HTTP request/response handling ka runtime contract.
 * - Concurrency — same servlet instance multiple requests handle kar sakta hai.
 * - Request state — local variables/request scope; shared instance field mein mat rakho.
 * - Filter — request chain ke around cross-cutting behavior.
 * - DispatcherServlet — Spring MVC request ko handler tak route karta hai.
 * - Forward — server-side dispatch; redirect — client ki nayi request.
 * - JSP — server-side view rendering; output escape karo.
 * - MVC — controller input, model data, view presentation.
 * - Request attribute — same request dispatch mein data; redirect ki nayi request mein automatically nahi.
 * - Session state — multiple tabs/requests share kar sakti hain; mutable data concurrency-safe rakho.
 * - Filter/interceptor — servlet chain boundary / MVC handler boundary; responsibilities alag.
 */

public class Advance_Java_Servlets_JSP {
    public static void main(String[] args) {
        System.out.println("===== Servlets & JSP =====");
        System.out.println("Servlet = Java class that handles HTTP requests.");
        System.out.println("JSP = HTML + embedded Java (internally becomes Servlet).");
        System.out.println("MVC Pattern: Controller(Servlet) + Model(Data) + View(JSP).");
        System.out.println("Spring MVC is built ON TOP of Servlet technology!");
    }
}
