class CloudflareAIClient:
    def summarize(self, text: str) -> str:
        return text[:160]
