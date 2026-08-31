/**
 * ========================================================================
 * 02. HIBERNATE ORM
 * ========================================================================
 * NOTES:
 * - JDBC me bohot boilerplate code (Connection, Statement, ResultSet looping) likhna padta tha. Aur Java (Object-Oriented) aur Database (Relational/Tables) ke beech me "Paradigm Mismatch" tha.
 * - Hibernate ek ORM (Object-Relational Mapping) framework hai. Ye Java class ko Database table ke sath map (link) kar deta hai.
 * - Result? Aap Java object create/save karte ho, Hibernate usko automatically SQL `INSERT` query me convert karke DB me daal deta hai!
 * 
 * HIBERNATE VS JPA:
 * - JPA (Java Persistence API): Sirf ek specification/rules ka set hai (Interfaces).
 * - Hibernate: Un rules ka implementation hai. Spring Data JPA internally Hibernate ko hi use karta hai.
 * 
 * CORE ANNOTATIONS:
 * - @Entity: Class ke upar lagta hai. Iska matlab hai "Is class ka ek table banega DB me".
 * - @Table(name="students_tbl"): Agar class ka naam Student hai par table ka naam kuch aur chahiye toh.
 * - @Id: Primary Key define karne ke liye.
 * - @GeneratedValue(strategy = GenerationType.IDENTITY): Auto-increment primary key ke liye.
 * - @Column(name="student_name"): Agar variable name aur DB column name alag rakhne ho.
 * - @Transient: Ye variable DB column nahi banega (ignore ho jayega).
 * 
 * HIBERNATE ARCHITECTURE:
 * 1. Configuration: `hibernate.cfg.xml` me database details aur classes ki mapping hoti hai.
 * 2. SessionFactory: Heavy object hai, poori app me ek hi banta hai. Database connections handle karta hai.
 * 3. Session: Ek light-weight object jo ek specific task (save, get) ke liye open hota hai aur fir close. CRUD operations Session ke methods se hote hain (`session.save(obj)`, `session.get(Class, id)`).
 * 4. Transaction: Data write/update/delete karne ke liye transaction (commit/rollback) zaroori hota hai.
 * 
 * HQL (Hibernate Query Language):
 * - HQL me tables ki jagah Classes aur Columns ki jagah instance variables use hote hain.
 * - SQL: `SELECT * FROM students_tbl WHERE student_name = 'Sidd'`
 * - HQL: `FROM Student s WHERE s.name = 'Sidd'` (Database independent query!).
 */

/*
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;

// --- MODEL (Mapped to Database) ---
@Entity
class Student {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id; // Maps to Primary Key
    
    private String name; // Maps to 'name' column
    private String techStack;
    
    // Getters, Setters, Constructors omitted for brevity
}

// --- HIBERNATE CRUD (Pseudo Code inside Main) ---
// Configuration config = new Configuration().configure().addAnnotatedClass(Student.class);
// SessionFactory sf = config.buildSessionFactory();
// Session session = sf.openSession();
// Transaction tx = session.beginTransaction();
// 
// // CREATE (Save object to DB)
// Student s1 = new Student("Navin", "Java");
// session.save(s1);
// 
// // READ (Get object from DB)
// Student s2 = session.get(Student.class, 1);
// 
// tx.commit();
// session.close();
*/

public class Hibernate_ORM {
    public static void main(String[] args) {
        System.out.println("Hibernate magically translates your Java Objects into SQL Queries!");
    }
}
