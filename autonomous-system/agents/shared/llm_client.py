"""
LLM Integration — Real code generation, review, and fix suggestions
Supports OpenAI, Anthropic, and local models
"""

import json
import logging
import os
import time
from typing import Optional
from dataclasses import dataclass, field

logger = logging.getLogger(__name__)


@dataclass
class LLMResponse:
    content: str
    model: str
    tokens_used: int = 0
    cost_usd: float = 0.0
    latency_seconds: float = 0.0
    finish_reason: str = "stop"


@dataclass
class LLMConfig:
    provider: str = "openai"
    model: str = "gpt-4o-mini"
    api_key: str = ""
    base_url: str = ""
    temperature: float = 0.3
    max_tokens: int = 4096
    timeout_seconds: int = 120


class LLMClient:
    """
    Unified LLM client supporting multiple providers.
    Falls back to template-based generation if no API key configured.
    """

    def __init__(self, config: LLMConfig = None):
        self.config = config or LLMConfig()
        self._token_usage = {"total_tokens": 0, "total_cost": 0.0, "total_calls": 0}

        if not self.config.api_key:
            self.config.api_key = os.environ.get("LLM_API_KEY", "")
        if not self.config.base_url:
            self.config.base_url = os.environ.get("LLM_BASE_URL", "")

        self._use_api = bool(self.config.api_key)
        if not self._use_api:
            logger.warning(
                "No LLM API key configured — using template-based generation"
            )

    async def generate_code(self, task: dict, file_content: str = "") -> str:
        """Generate code based on task description"""
        prompt = self._build_code_prompt(task, file_content)

        if self._use_api:
            response = await self._call_api(prompt)
            return response.content
        else:
            return self._template_generate(task, file_content)

    async def review_code(self, code: str, task: dict) -> dict:
        """Review code and provide feedback"""
        prompt = self._build_review_prompt(code, task)

        if self._use_api:
            response = await self._call_api(prompt)
            return self._parse_review_response(response.content)
        else:
            return self._template_review(code, task)

    async def fix_code(self, error: str, code: str, task: dict) -> str:
        """Generate fix for error"""
        prompt = self._build_fix_prompt(error, code, task)

        if self._use_api:
            response = await self._call_api(prompt)
            return response.content
        else:
            return self._template_fix(error, code, task)

    async def _call_api(self, prompt: str) -> LLMResponse:
        start_time = time.time()

        if self.config.provider == "openai":
            response = await self._call_openai(prompt)
        elif self.config.provider == "anthropic":
            response = await self._call_anthropic(prompt)
        elif self.config.provider == "local":
            response = await self._call_local(prompt)
        else:
            raise ValueError(f"Unknown provider: {self.config.provider}")

        response.latency_seconds = round(time.time() - start_time, 2)
        self._token_usage["total_tokens"] += response.tokens_used
        self._token_usage["total_calls"] += 1
        self._token_usage["total_cost"] += response.cost_usd

        return response

    async def _call_openai(self, prompt: str) -> LLMResponse:
        try:
            from openai import AsyncOpenAI

            client = AsyncOpenAI(
                api_key=self.config.api_key,
                base_url=self.config.base_url or None,
            )

            response = await client.chat.completions.create(
                model=self.config.model,
                messages=[{"role": "user", "content": prompt}],
                temperature=self.config.temperature,
                max_tokens=self.config.max_tokens,
                timeout=self.config.timeout_seconds,
            )

            usage = response.usage
            tokens = usage.total_tokens if usage else 0
            cost = tokens * 0.000001

            return LLMResponse(
                content=response.choices[0].message.content,
                model=self.config.model,
                tokens_used=tokens,
                cost_usd=cost,
                finish_reason=response.choices[0].finish_reason,
            )
        except ImportError:
            logger.warning("openai package not installed")
            self._use_api = False
            return LLMResponse(
                content=self._template_fallback(prompt), model="template"
            )
        except Exception as e:
            logger.error(f"OpenAI API call failed: {e}")
            raise

    async def _call_anthropic(self, prompt: str) -> LLMResponse:
        try:
            from anthropic import AsyncAnthropic

            client = AsyncAnthropic(api_key=self.config.api_key)

            response = await client.messages.create(
                model=self.config.model,
                max_tokens=self.config.max_tokens,
                messages=[{"role": "user", "content": prompt}],
            )

            tokens = response.usage.input_tokens + response.usage.output_tokens
            cost = tokens * 0.000003

            return LLMResponse(
                content=response.content[0].text,
                model=self.config.model,
                tokens_used=tokens,
                cost_usd=cost,
            )
        except ImportError:
            logger.warning("anthropic package not installed")
            self._use_api = False
            return LLMResponse(
                content=self._template_fallback(prompt), model="template"
            )
        except Exception as e:
            logger.error(f"Anthropic API call failed: {e}")
            raise

    async def _call_local(self, prompt: str) -> LLMResponse:
        try:
            import httpx

            url = self.config.base_url or "http://localhost:11434/api/generate"
            async with httpx.AsyncClient(timeout=self.config.timeout_seconds) as client:
                resp = await client.post(
                    url,
                    json={
                        "model": self.config.model,
                        "prompt": prompt,
                        "temperature": self.config.temperature,
                    },
                )
                resp.raise_for_status()
                data = resp.json()

            return LLMResponse(
                content=data.get("response", ""),
                model=self.config.model,
                tokens_used=0,
                cost_usd=0.0,
            )
        except Exception as e:
            logger.error(f"Local LLM call failed: {e}")
            raise

    def _build_code_prompt(self, task: dict, file_content: str) -> str:
        existing = ""
        if file_content:
            existing = f"Existing file content:\n{file_content}\n"

        criteria = ", ".join(task.get("acceptance_criteria", []))
        files = ", ".join(task.get("files_affected", []))

        return (
            f"You are an expert software developer. Implement the following task:\n\n"
            f"Task: {task.get('title', '')}\n"
            f"Description: {task.get('description', '')}\n"
            f"Category: {task.get('category', 'general')}\n"
            f"Priority: {task.get('priority', 3)}\n\n"
            f"{existing}\n"
            f"Acceptance Criteria: {criteria}\n"
            f"Files Affected: {files}\n\n"
            f"Provide ONLY the code. No explanations, no markdown. Use clean code principles."
        )

    def _build_review_prompt(self, code: str, task: dict) -> str:
        return f"""Review the following code for task: {task.get("title", "")}

Code:
```
{code}
```

Evaluate on these criteria:
1. Correctness: Does it meet the acceptance criteria?
2. Code Quality: Is it clean, readable, well-structured?
3. Security: Any vulnerabilities?
4. Performance: Any obvious inefficiencies?
5. Test Coverage: Are there adequate tests?

Provide a score from 0-100 and detailed feedback."""

    def _build_fix_prompt(self, error: str, code: str, task: dict) -> str:
        return f"""Fix the following error in the code.

Task: {task.get("title", "")}
Error: {error}

Current Code:
```
{code}
```

Provide the FIXED code only. No explanations."""

    def _parse_review_response(self, content: str) -> dict:
        try:
            import re

            score_match = re.search(r"(\d{1,3})/100", content)
            score = int(score_match.group(1)) if score_match else 50
        except Exception:
            score = 50

        return {
            "score": score,
            "feedback": content[:500],
            "criteria_scores": {
                "correctness": score,
                "code_quality": score,
                "test_coverage": score,
                "performance": score,
                "documentation": score,
                "security": score,
            },
        }

    def _template_generate(self, task: dict, file_content: str) -> str:
        import datetime

        task_id = task.get("task_id", "unknown")
        timestamp = datetime.datetime.now().isoformat()
        return f"// [LLM-template] Task: {task_id} | Generated at: {timestamp}\n// Description: {task.get('description', '')}\n"

    def _template_review(self, code: str, task: dict) -> dict:
        score = 65
        if len(code) > 100:
            score += 10
        if "def " in code or "function " in code:
            score += 5
        return {
            "score": min(score, 100),
            "feedback": "Template review: code structure looks reasonable",
            "criteria_scores": {
                "correctness": score,
                "code_quality": score,
                "test_coverage": score,
                "performance": score,
                "documentation": score,
                "security": score,
            },
        }

    def _template_fix(self, error: str, code: str, task: dict) -> str:
        return f"{code}\n// [Template fix] Attempted fix for: {error[:100]}\n"

    def _template_fallback(self, prompt: str) -> str:
        return f"// Template fallback response\n// Prompt length: {len(prompt)} chars\n"

    def get_usage_stats(self) -> dict:
        return dict(self._token_usage)
