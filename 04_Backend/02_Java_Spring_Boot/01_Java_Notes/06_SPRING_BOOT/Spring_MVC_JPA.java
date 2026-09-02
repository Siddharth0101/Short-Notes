/**
 * ========================================================================
 * 06b. SPRING MVC, THYMELEAF & SPRING DATA JPA [⚡ VISUAL]
 * ========================================================================
 * 
 * ========================================================================
 * 1. SPRING MVC ARCHITECTURE
 * ========================================================================
 * - Spring MVC = Spring's web framework for building web applications (server-rendered HTML pages).
 * - Internally built on top of Servlets (DispatcherServlet).
 * 
 * REQUEST FLOW (⭐ INTERVIEW FAVOURITE):
 * ┌──────────┐  HTTP Request  ┌───────────────────┐  Handler   ┌────────────────┐
 * │  Client  │ ─────────────> │ DispatcherServlet │ ─────────> │ HandlerMapping │
 * │ (Browser)│                │ (Front Controller)│ <───────── │ (Find @Controller)│
 * └──────────┘                └────────┬──────────┘  Found!    └────────────────┘
 *                                      │
 *                                      │ Forward to correct
 *                                      ▼ @Controller method
 *                              ┌───────────────┐     Model     ┌──────────────┐
 *                              │  @Controller  │ ────────────> │ ViewResolver │
 *                              │  (Your Code)  │  + View Name  │ (Find .html) │
 *                              └───────────────┘               └──────┬───────┘
 *                                                                     │
 *                                                                     ▼
 *                              ┌──────────┐  Rendered HTML    ┌──────────────┐
 *                              │  Client  │ <──────────────── │  Thymeleaf   │
 *                              │ (Browser)│                   │  Template    │
 *                              └──────────┘                   └──────────────┘
 * 
 * KEY COMPONENTS:
 * - DispatcherServlet: Front Controller. Sabse pehle ye request receive karta hai, phir correct controller ko delegate karta hai.
 * - HandlerMapping: URL ko correct @Controller method se map karta hai.
 * - ViewResolver: View name (e.g., "home") ko actual template file (templates/home.html) se map karta hai.
 * - Model: Controller se View (Thymeleaf) me data pass karne ka container.
 * 
 * @Controller vs @RestController:
 * - @Controller: VIEW (HTML page) return karta hai. View name as String return karo, ViewResolver us template ko dhundega.
 * - @RestController: DATA (JSON/XML) return karta hai. @Controller + @ResponseBody combined.
 * 
 * ========================================================================
 * 2. THYMELEAF (Template Engine)
 * ========================================================================
 * - Thymeleaf = Server-side template engine. HTML files me Java data inject karna.
 * - JSP ka modern replacement (Natural templates — valid HTML even without server).
 * - Files: src/main/resources/templates/ folder me .html files rakhte hain.
 * - Dependency: spring-boot-starter-thymeleaf
 * 
 * COMMON THYMELEAF ATTRIBUTES:
 * - th:text="${variable}"         -> Text content set karna
 * - th:each="item : ${list}"     -> Loop (forEach equivalent)
 * - th:if="${condition}"          -> Conditional rendering
 * - th:unless="${condition}"      -> Opposite of th:if
 * - th:href="@{/path}"           -> Link URL
 * - th:src="@{/images/logo.png}" -> Image source
 * - th:action="@{/submit}"       -> Form action URL
 * - th:object="${user}"           -> Form ke liye object bind karna
 * - th:field="*{name}"            -> Form field bind karna (object ke sath)
 * - th:value="${value}"           -> Input value set karna
 * - th:class="${active ? 'selected' : ''}" -> Dynamic CSS class
 * 
 * PASSING DATA (Controller -> View):
 * - Model: model.addAttribute("name", "Navin");
 * - ModelAndView: ModelAndView mv = new ModelAndView("viewName"); mv.addObject("name", "Navin");
 * 
 * FORM HANDLING:
 * - @ModelAttribute: Form data ko automatically Java object me bind karna.
 * - GET: Form dikhao (empty object bhejo).
 * - POST: Filled form receive karo (@ModelAttribute se bind hoga).
 * 
 * ========================================================================
 * 3. SPRING DATA JPA (Database Made Easy)
 * ========================================================================
 * - Spring Data JPA = JPA + Hibernate ke upar ek abstraction layer.
 * - CRUD operations ke liye EK LINE BHI SQL nahi likhni padti! Sirf interface define karo.
 * - Internally Hibernate use karta hai (JPA implementation).
 * 
 * JpaRepository<Entity, ID>:
 * - Extend karo: interface UserRepo extends JpaRepository<User, Long> {}
 * - FREE METHODS milte hain (implement karne ki zaroorat nahi):
 *   - findAll()        -> List<User> (SELECT * FROM users)
 *   - findById(id)     -> Optional<User> (SELECT * WHERE id = ?)
 *   - save(entity)     -> User (INSERT or UPDATE — id null toh INSERT, warna UPDATE)
 *   - deleteById(id)   -> void (DELETE WHERE id = ?)
 *   - count()          -> long (SELECT COUNT)
 *   - existsById(id)   -> boolean
 * 
 * DERIVED QUERY METHODS (Method Name se Query Generate):
 * - Spring Data JPA method ka naam padh ke AUTOMATICALLY SQL banata hai!
 * - findByName(String name)                -> WHERE name = ?
 * - findByAgeGreaterThan(int age)          -> WHERE age > ?
 * - findByNameAndAge(String name, int age) -> WHERE name = ? AND age = ?
 * - findByNameContaining(String part)      -> WHERE name LIKE '%part%'
 * - findByNameOrderByAgeDesc(String name)  -> WHERE name = ? ORDER BY age DESC
 * - findByActiveTrue()                     -> WHERE active = true
 * - countByAge(int age)                    -> SELECT COUNT WHERE age = ?
 * 
 * @Query ANNOTATION (Custom Queries):
 * - Jab method name se query na ban sake, toh manually likho:
 * - JPQL: @Query("SELECT s FROM Student s WHERE s.marks > :min")
 *         List<Student> findAboveMarks(@Param("min") int minMarks);
 * - Native SQL: @Query(value = "SELECT * FROM students WHERE marks > ?1", nativeQuery = true)
 * 
 * PAGINATION & SORTING:
 * - findAll(Pageable pageable) -> Page<User>
 * - Usage: PageRequest.of(page, size, Sort.by("name").ascending())
 * - Response: Page object me content, totalPages, totalElements, number milta hai.
 * 
 * ========================================================================
 * 4. ENTITY RELATIONSHIPS (⭐ IMPORTANT)
 * ========================================================================
 * - JPA annotations se tables ke beech relationships define karo.
 * 
 * @OneToOne: Ek entity ka ek dusre se ONE relationship.
 * - Example: User has one Profile.
 * - @OneToOne @JoinColumn(name="profile_id") private Profile profile;
 * 
 * @OneToMany / @ManyToOne: Ek entity ke paas bohot sari, dusri ke paas ek.
 * - Example: One Department has many Employees. Each Employee belongs to one Department.
 * - Department side: @OneToMany(mappedBy = "department") private List<Employee> employees;
 * - Employee side: @ManyToOne @JoinColumn(name = "dept_id") private Department department;
 * - mappedBy = "who owns the foreign key". Jis side JoinColumn hai, woh owning side.
 * 
 * @ManyToMany: Dono sides pe bohot sare.
 * - Example: Students <-> Courses (ek student bohot courses le sakta hai, ek course me bohot students).
 * - @ManyToMany @JoinTable(...) private List<Course> courses;
 * - Internally ek JOIN TABLE banti hai (student_courses).
 * 
 * CASCADE TYPES:
 * - CascadeType.ALL: Parent pe koi bhi operation ho (save, delete), child pe bhi automatically ho.
 * - CascadeType.PERSIST: Parent save hoga toh child bhi save ho.
 * - CascadeType.REMOVE: Parent delete hoga toh child bhi delete ho.
 * 
 * FETCH TYPES:
 * - FetchType.LAZY (Default for collections): Related data TAB load hota hai JAB access karo.
 * - FetchType.EAGER: Related data IMMEDIATELY load hota hai parent ke sath.
 * - RULE: By default LAZY use karo. Eager se N+1 query problem ho sakta hai.
 */

/*
// ========== ENTITY ==========
import jakarta.persistence.*;

@Entity
@Table(name = "products")
class Product {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    private double price;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;
    
    // Constructors, Getters, Setters
}

@Entity
class Category {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    
    @OneToMany(mappedBy = "category", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Product> products;
}

// ========== REPOSITORY ==========
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

interface ProductRepository extends JpaRepository<Product, Long> {
    
    // Derived query methods (Spring generates SQL from method name!)
    List<Product> findByName(String name);
    List<Product> findByPriceGreaterThan(double price);
    List<Product> findByNameContainingIgnoreCase(String keyword);
    List<Product> findByCategoryNameOrderByPriceDesc(String categoryName);
    
    // Custom JPQL query
    @Query("SELECT p FROM Product p WHERE p.price BETWEEN :min AND :max")
    List<Product> findByPriceRange(@Param("min") double min, @Param("max") double max);
    
    // Pagination
    Page<Product> findByCategoryName(String categoryName, Pageable pageable);
}

// ========== CONTROLLER (MVC - returns View) ==========
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
class ProductController {
    
    private final ProductRepository productRepo;
    
    ProductController(ProductRepository productRepo) {
        this.productRepo = productRepo;
    }
    
    // Show all products page
    @GetMapping("/products")
    public String listProducts(Model model) {
        model.addAttribute("products", productRepo.findAll());
        return "product-list"; // -> templates/product-list.html (Thymeleaf)
    }
    
    // Show add product form
    @GetMapping("/products/add")
    public String showAddForm(Model model) {
        model.addAttribute("product", new Product()); // Empty object for form binding
        return "product-form"; // -> templates/product-form.html
    }
    
    // Handle form submission
    @PostMapping("/products/add")
    public String addProduct(@ModelAttribute Product product) {
        productRepo.save(product);
        return "redirect:/products"; // Redirect to list page (PRG pattern)
    }
}
*/

/*
=============================
Thymeleaf Template: product-list.html
=============================
<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org">
<head><title>Products</title></head>
<body>
    <h1>All Products</h1>
    <a th:href="@{/products/add}">Add New Product</a>
    
    <table>
        <tr><th>ID</th><th>Name</th><th>Price</th></tr>
        <tr th:each="product : ${products}">
            <td th:text="${product.id}"></td>
            <td th:text="${product.name}"></td>
            <td th:text="${product.price}"></td>
        </tr>
    </table>
    
    <p th:if="${#lists.isEmpty(products)}">No products found.</p>
</body>
</html>

=============================
Thymeleaf Template: product-form.html
=============================
<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org">
<head><title>Add Product</title></head>
<body>
    <h1>Add Product</h1>
    <form th:action="@{/products/add}" th:object="${product}" method="post">
        <label>Name: <input type="text" th:field="*{name}" /></label><br/>
        <label>Price: <input type="number" th:field="*{price}" step="0.01" /></label><br/>
        <button type="submit">Save</button>
    </form>
</body>
</html>
*/

public class Spring_MVC_JPA {
    public static void main(String[] args) {
        System.out.println("===== Spring MVC & Data JPA =====");
        System.out.println("@Controller  -> Returns VIEW (HTML via Thymeleaf)");
        System.out.println("@RestController -> Returns DATA (JSON)");
        System.out.println("JpaRepository -> FREE CRUD! No SQL needed.");
        System.out.println("Derived Queries: findByNameAndAge() -> Spring writes SQL for you!");
    }
}
