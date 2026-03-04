import { jest } from "@jest/globals";

// 1. Define the mock first
jest.unstable_mockModule("openai", () => ({
  default: jest.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: jest.fn().mockResolvedValue({
          choices: [{ message: { content: "Mocked AI Response" } }],
        }),
      },
    },
  })),
}));

describe("AI Service", () => {
  it("should return a string response from the AI", async () => {
    // 2. DYNAMICALLY import the service AFTER the mock is registered
    const { generateSocialWorkerAdvice } =
      await import("../services/aiService.js");

    const mockClient = {
      name: "Test",
      surname: "User",
      age: 25,
      location: "Soweto",
      issue: "Stress",
    };

    const response = await generateSocialWorkerAdvice(mockClient, "Help me");

    // 3. This will now match because the mock intercepted the dynamic import
    expect(response).toBe("Mocked AI Response");
    expect(typeof response).toBe("string");
  });
});
