/**
 * ========================================================================
 * 08. SPRING AI (GENERATIVE AI IN JAVA)
 * ========================================================================
 * NOTES:
 * - Spring AI Java applications mein model integrations ke liye common abstractions deta hai.
 * - Spring AI ek official project hai jo LLMs (OpenAI, Anthropic, Gemini, Ollama) ko Spring Boot me smoothly integrate karta hai.
 * - Common ChatClient API migration effort reduce karti hai; provider change par starter/config, model capabilities, embeddings aur evaluation dobara verify karo. Sirf API key badalna enough guaranteed nahi.
 * 
 * 1. CORE CONCEPTS:
 * - Model (LLM): The brain (GPT-4, Llama 3).
 * - Prompt: Jo text user input me deta hai.
 * - Embeddings: Text ko numbers (vectors) me convert karna (taaki AI similarity samajh sake).
 * - Vector Database: In embeddings ko store aur search karne wala special database (Pinecone, Chroma, pgvector).
 * 
 * 2. RAG (RETRIEVAL-AUGMENTED GENERATION):
 * - Problem: Company policy ke liye authorized documents retrieve karo. Personal leave approval live workflow state hai; policy text se approval infer mat karo.
 * - Solution (RAG):
 *   a) User ka question vector me convert karo.
 *   b) Trusted tenant/user scope ke andar relevant authorized policy chunks retrieve karo; current permissions bhi verify karo.
 *   c) LLM ko dono cheezein do: (System prompt: "Is document ke basis pe answer do" + User question + Retrieved Document).
 *   d) LLM evidence se answer draft karega; grounding/source checks karo, evidence missing ho toh limitation do.
 * 
 * 3. SPRING AI API (ChatClient):
 * - `ChatClient` supported ChatModel integrations ke saath fluent API deta hai.
 * - Complete Hinglish lesson: notes/spring-boot/13-ai-retrieval.md
 */

/*
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AIController {

    private final ChatClient chatClient;

    // Spring Boot automatically injects ChatClient builder configured with properties 
    // (e.g. spring.ai.openai.api-key=sk-xxxx)
    public AIController(ChatClient.Builder builder) {
        this.chatClient = builder.build();
    }

    @GetMapping("/ask")
    public String generateResponse(@RequestParam String question) {
        // Fluent API chaining
        return this.chatClient.prompt()
                .user(question)
                .system("You are a helpful coding assistant that speaks in Hinglish.")
                .call()
                .content(); // Returns string response from LLM
    }
}
*/

public class Spring_AI_Intro {
    public static void main(String[] args) {
        System.out.println("Spring AI is the LangChain equivalent for the Java ecosystem!");
    }
}
