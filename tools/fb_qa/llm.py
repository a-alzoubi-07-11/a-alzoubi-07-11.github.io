"""Tiny client for the Gemini API free tier (no SDK, no paid plan).

Get a free key at https://aistudio.google.com/apikey and set it in the
environment variable GEMINI_API_KEY (never in a committed file).
The client paces itself (llm_min_seconds_between_calls) and stops after
llm_max_calls_per_run, so it stays inside the free-tier limits.
"""
from __future__ import annotations

import json
import os
import re
import time
import urllib.error
import urllib.request

from common import load_config

ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent"


class LLMError(RuntimeError):
    pass


class BudgetExhausted(LLMError):
    pass


class Gemini:
    def __init__(self, cfg: dict | None = None):
        cfg = cfg or load_config()
        self.key = os.environ.get("GEMINI_API_KEY", "").strip()
        if not self.key:
            raise LLMError("GEMINI_API_KEY is not set. Get a free key at https://aistudio.google.com/apikey")
        self.model = cfg["gemini_model"]
        self.gap = float(cfg["llm_min_seconds_between_calls"])
        self.budget = int(cfg["llm_max_calls_per_run"])
        self.calls = 0
        self._last = 0.0

    def json(self, prompt: str, temperature: float = 0.2):
        """Send a prompt that asks for JSON; return the parsed object."""
        text = self._generate(prompt, temperature, json_mode=True)
        return parse_json(text)

    def text(self, prompt: str, temperature: float = 0.5) -> str:
        return self._generate(prompt, temperature, json_mode=False)

    def _generate(self, prompt: str, temperature: float, json_mode: bool) -> str:
        if self.calls >= self.budget:
            raise BudgetExhausted(f"LLM call budget for this run ({self.budget}) used up; continue tomorrow.")
        body = {"contents": [{"role": "user", "parts": [{"text": prompt}]}],
                "generationConfig": {"temperature": temperature}}
        if json_mode:
            body["generationConfig"]["responseMimeType"] = "application/json"
        data = json.dumps(body).encode("utf-8")
        for attempt in range(5):
            wait = self.gap - (time.monotonic() - self._last)
            if wait > 0:
                time.sleep(wait)
            req = urllib.request.Request(ENDPOINT.format(model=self.model), data=data, method="POST",
                                         headers={"Content-Type": "application/json",
                                                  "x-goog-api-key": self.key})
            self._last = time.monotonic()
            try:
                with urllib.request.urlopen(req, timeout=120) as r:
                    resp = json.loads(r.read().decode("utf-8"))
                self.calls += 1
                try:
                    return "".join(p.get("text", "") for p in resp["candidates"][0]["content"]["parts"])
                except (KeyError, IndexError):
                    raise LLMError(f"Empty/blocked answer: {str(resp)[:300]}")
            except urllib.error.HTTPError as e:
                msg = e.read().decode("utf-8", "replace")[:300]
                if e.code in (429, 500, 503) and attempt < 4:
                    time.sleep(min(90, 15 * (attempt + 1)))     # free-tier rate limit: back off
                    continue
                raise LLMError(f"Gemini HTTP {e.code}: {msg}")
            except urllib.error.URLError as e:
                if attempt < 4:
                    time.sleep(10)
                    continue
                raise LLMError(f"Network error: {e}")
        raise LLMError("Gemini: too many retries")


def parse_json(text: str):
    text = text.strip()
    m = re.search(r"```(?:json)?\s*(.*?)```", text, re.S)
    if m:
        text = m.group(1).strip()
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        for open_, close in (("{", "}"), ("[", "]")):
            i, j = text.find(open_), text.rfind(close)
            if i != -1 and j > i:
                try:
                    return json.loads(text[i:j + 1])
                except json.JSONDecodeError:
                    pass
        raise LLMError(f"Could not parse JSON from model: {text[:300]}")
