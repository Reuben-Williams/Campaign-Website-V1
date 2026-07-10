import { describe, expect, it, vi } from "vitest";
import { withBasePath } from "@/lib/paths";

describe("withBasePath", () => {
  it("prefixes root-relative public assets for GitHub Pages exports", async () => {
    vi.stubEnv("NEXT_PUBLIC_BASE_PATH", "/Campaign-Website-V1");

    expect(withBasePath("/images/campaign/carmen-officials-chamber.jpg")).toBe(
      "/Campaign-Website-V1/images/campaign/carmen-officials-chamber.jpg",
    );

    vi.unstubAllEnvs();
  });

  it("leaves absolute external urls unchanged", () => {
    vi.stubEnv("NEXT_PUBLIC_BASE_PATH", "/Campaign-Website-V1");

    expect(withBasePath("https://example.com/image.jpg")).toBe("https://example.com/image.jpg");

    vi.unstubAllEnvs();
  });
});
