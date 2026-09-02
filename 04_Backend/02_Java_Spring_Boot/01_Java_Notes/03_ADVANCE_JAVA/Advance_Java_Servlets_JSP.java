/**
 * ========================================================================
 * 03b. ADVANCE JAVA - SERVLETS & JSP [⚡ VISUAL]
 * ========================================================================
 * NOTES:
 * - Spring Boot se pehle, Java me web applications Servlets aur JSP se banti thi.
 * - Ye samajhna zaroori hai kyunki Spring MVC internally Servlets ke upar hi kaam karta hai!
 * 
 * ========================================================================
 * 1. HOW THE WEB WORKS (HTTP BASICS)
 * ========================================================================
 * - Client (Browser) ek HTTP Request bhejta hai server ko.
 * - Server process karke HTTP Response bhejta hai (HTML, JSON, etc.).
 * - HTTP Methods:
 *   - GET: Data fetch karna (read). URL me data dikhta hai (query params).
 *   - POST: Data submit karna (create). Body me data hota hai (hidden from URL).
 *   - PUT: Pura resource update karna.
 *   - DELETE: Resource delete karna.
 *   - PATCH: Partial update.
 * - Status Codes: 200 (OK), 201 (Created), 400 (Bad Request), 401 (Unauthorized), 404 (Not Found), 500 (Server Error).
 * 
 * ========================================================================
 * 2. SERVLETS
 * ========================================================================
 * - Servlet = ek Java class jo HTTP requests handle karti hai.
 * - Servlet Container (e.g., Tomcat) request aata hai toh correct Servlet ko deta hai.
 * - Servlet ye karke kisi external server pe deploy hota tha (WAR file deploy karna padta tha). Spring Boot ne ye problem solve kiya (embedded Tomcat).
 * 
 * SERVLET LIFECYCLE:
 * 1. Loading: Container Servlet class ko load karta hai.
 * 2. Instantiation: Constructor call hota hai (ek baar).
 * 3. init(): Initialization (ek baar) — DB connection setup etc.
 * 4. service() -> doGet()/doPost(): Har request pe call hota hai.
 * 5. destroy(): Container band hone pe cleanup (ek baar).
 * 
 * KEY CLASSES:
 * - HttpServlet: Extend karo apni servlet banane ke liye.
 * - HttpServletRequest: Client ki request ki info (parameters, headers, URL).
 * - HttpServletResponse: Server ka response bhejne ke liye (HTML, JSON, status code).
 * 
 * URL MAPPING:
 * - @WebServlet("/hello") annotation se URL map karo (modern way).
 * - web.xml (deployment descriptor): Purana way — XML me servlet mapping define karna.
 * 
 * REQUEST PARAMETERS:
 * - request.getParameter("name") -> form field ya query param value nikalna.
 * 
 * REQUEST DISPATCHER:
 * - Forward: request.getRequestDispatcher("/page.jsp").forward(req, res);
 *   Ek servlet se doosre servlet/JSP pe request FORWARD karna. URL change nahi hota.
 * - Redirect: response.sendRedirect("/other-url");
 *   Browser ko naye URL pe redirect karna. URL change hota hai (new HTTP request).
 * 
 * SESSION MANAGEMENT:
 * - HTTP is STATELESS (har request independent hai, server yaad nahi rakhta kaun hai).
 * - HttpSession: Server-side me user data store karna.
 *   - HttpSession session = request.getSession();
 *   - session.setAttribute("user", "Navin");
 *   - session.getAttribute("user"); // "Navin"
 *   - session.invalidate(); // Logout (session destroy)
 * - Cookies: Client-side me data store karna (browser me).
 *   - Cookie c = new Cookie("username", "Navin");
 *   - response.addCookie(c);
 *   - request.getCookies(); // Array of cookies
 * 
 * ========================================================================
 * 3. JSP (JAVA SERVER PAGES)
 * ========================================================================
 * - Problem: Servlet me HTML likhna bohot tedious hai (out.println("<html>...") har line me).
 * - JSP = HTML file jisme Java code embed kar sakte ho. Internally JSP bhi Servlet me convert hota hai!
 * - Extension: .jsp files `webapp/` folder me rakhte hain.
 * 
 * JSP ELEMENTS:
 * - Scriptlet: <% Java code %> (Business logic, but NOT recommended — use MVC instead)
 * - Expression: <%= expression %> (Output directly into HTML. Like out.println())
 * - Declaration: <%! variable/method declaration %> (Class level)
 * - Directive: <%@ page import="java.util.*" %> (Page settings)
 * - Comment: <%-- JSP comment (not sent to browser) --%>
 * 
 * JSTL (JSP Standard Tag Library):
 * - JSP me Java code likhne ki jagah tags use karo (cleaner):
 * - <c:forEach items="${users}" var="user"> ${user.name} </c:forEach>
 * - <c:if test="${age >= 18}"> Eligible </c:if>
 * - Need: <%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
 * 
 * EL (Expression Language):
 * - ${variableName} syntax se request/session attributes access karna.
 * - ${user.name} -> user object ka getName() call karta hai.
 * 
 * ========================================================================
 * 4. MVC PATTERN (Model-View-Controller)
 * ========================================================================
 * - Problem: Servlet me business logic + HTML mixing = messy code.
 * - Solution: MVC pattern se separate karo:
 * 
 * ┌───────────┐    Request    ┌────────────┐    Data     ┌───────────┐
 * │  Browser  │ ────────────> │ Controller │ ──────────> │   Model   │
 * │ (Client)  │               │ (Servlet)  │ <────────── │ (Java/DB) │
 * └───────────┘               └─────┬──────┘   Result    └───────────┘
 *       ▲                           │
 *       │        Response           │ Forward
 *       │                     ┌─────▼──────┐
 *       └──────────────────── │    View     │
 *                             │   (JSP)     │
 *                             └─────────────┘
 * 
 * - Controller (Servlet): Request handle karna, Model se data lena, View ko forward karna.
 * - Model (POJO/Service): Business logic aur data.
 * - View (JSP): Sirf data display karna (presentation).
 * 
 * WHY LEARN THIS?
 * - Spring MVC EXACTLY yahi architecture follow karta hai, bas Servlets ki jagah @Controller/@RestController aur JSP ki jagah Thymeleaf/JSON use hota hai.
 */

/*
// ========== SERVLET EXAMPLE ==========
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.annotation.WebServlet;
import java.io.IOException;
import java.io.PrintWriter;

@WebServlet("/hello")
public class HelloServlet extends HttpServlet {
    
    // Called on every GET request to /hello
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setContentType("text/html");
        PrintWriter out = response.getWriter();
        
        String name = request.getParameter("name"); // /hello?name=Navin
        if (name == null) name = "World";
        
        out.println("<html><body>");
        out.println("<h1>Hello, " + name + "!</h1>");
        out.println("</body></html>");
    }
    
    // Called on every POST request to /hello
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String username = request.getParameter("username");
        String password = request.getParameter("password");
        
        if ("admin".equals(username) && "1234".equals(password)) {
            // Store in session
            request.getSession().setAttribute("user", username);
            response.sendRedirect("/dashboard"); // Redirect to dashboard
        } else {
            response.sendRedirect("/login?error=true"); // Redirect back with error
        }
    }
}
*/

/*
=============================
Sample JSP (index.jsp)
=============================
<%@ page language="java" contentType="text/html" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<html>
<body>
    <h1>Welcome, ${sessionScope.user}!</h1>
    
    <!-- JSTL forEach -->
    <h2>All Students:</h2>
    <c:forEach items="${students}" var="student">
        <p>${student.name} - ${student.marks} marks</p>
    </c:forEach>
    
    <!-- JSTL conditional -->
    <c:if test="${sessionScope.user == null}">
        <p>Please <a href="/login">login</a> first.</p>
    </c:if>
</body>
</html>
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
