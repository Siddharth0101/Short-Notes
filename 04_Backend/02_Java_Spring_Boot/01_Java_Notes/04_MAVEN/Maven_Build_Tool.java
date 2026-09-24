/**
 * ## Quick revision
 *
 * - Maven — dependencies, build lifecycle aur plugins manage karta hai.
 * - `pom.xml` — project/build configuration.
 * - Lifecycle — compile → test → package → verify; phases earlier phases bhi chalati hain.
 * - Dependency scope — compile/test/runtime/provided ka classpath behavior alag.
 * - JUnit — behavior assertions; normal, boundary aur failure cases cover karo.
 * - Mockito — dependency behavior control; har internal call verify mat karo.
 * - Integration test — real database/HTTP boundary verify karo.
 * - Reproducible build — versions pin karo aur clean build verify karo.
 * - Dependency conflict — transitive versions inspect; effective dependency tree se winner samjho.
 * - Test double — fake simple implementation, stub canned result, mock interaction expectations.
 * - Build wrapper — project ka expected Maven version consistently run karne mein useful.
 */

public class Maven_Build_Tool {
    public static void main(String[] args) {
        System.out.println("Maven handles your dependencies, so you can focus on coding!");
        
    }
}
