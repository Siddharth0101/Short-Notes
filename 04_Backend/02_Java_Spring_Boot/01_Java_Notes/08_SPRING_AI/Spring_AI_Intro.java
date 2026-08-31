/**
 * ========================================================================
 * 08. SPRING AI (GENERATIVE AI IN JAVA)
 * ========================================================================
 * NOTES:
 * - Generative AI pehle mostly Python (LangChain, LlamaIndex) tak limited tha.
 * - Spring AI ek official project hai jo LLMs (OpenAI, Anthropic, Gemini, Ollama) ko Spring Boot me smoothly integrate karta hai.
 * - Benefit: Ek standard API (ChatClient) likho. Kal ko agar ChatGPT se Gemini pe switch karna ho, toh code change nahi hoga, sirf application.properties me API key change hogi.
 * 
 * 1. CORE CONCEPTS:
 * - Model (LLM): The brain (GPT-4, Llama 3).
 * - Prompt: Jo text user input me deta hai.
 * - Embeddings: Text ko numbers (vectors) me convert karna (taaki AI similarity samajh sake).
 * - Vector Database: In embeddings ko store aur search karne wala special database (Pinecone, Chroma, pgvector).
 * 
 * 2. RAG (RETRIEVAL-AUGMENTED GENERATION):
 * - Problem: LLM ke paas general knowledge hoti hai, par aapki private company data ki nahi. Agar usse pucho "kal meri leave approve hui?", wo fail ho jayega.
 * - Solution (RAG):
 *   a) User ka question vector me convert karo.
 *   b) Vector DB se uss question se milti julti apni private company policy documents nikalo (Retrieve).
 *   c) LLM ko dono cheezein do: (System prompt: "Is document ke basis pe answer do" + User question + Retrieved Document).
 *   d) LLM generate karke answer dega (Augmented Generation).
 * 
 * 3. SPRING AI API (ChatClient):
 * - `ChatClient` interface is the fluent API to interact with any Model.
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
