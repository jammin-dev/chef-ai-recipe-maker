# Rate limit workflow

### 🔐 Goal: Prevent abuse (spam, scraping, bot overload) on a public web app.

Since you **can’t rely on authentication**, here are your **best options**:

---

### ✅ Recommended Rate Limiting Strategies

#### 1. **IP-based rate limiting**

- ✅ Easy to implement
- ✅ Works without user login
- ❌ Can be bypassed with VPNs / Tor / mobile networks

Most frameworks (FastAPI included) support this natively or via middleware:

```python
# FastAPI example with slowapi
from fastapi import FastAPI, Request
from slowapi import Limiter
from slowapi.util import get_remote_address
from slowapi.middleware import SlowAPIMiddleware

limiter = Limiter(key_func=get_remote_address)
app = FastAPI()
app.state.limiter = limiter
app.add_middleware(SlowAPIMiddleware)

@app.get("/my-ai-endpoint")
@limiter.limit("5/minute")
async def limited_endpoint(request: Request):
    return {"message": "Hello!"}
```

#### 2. **Anonymous Device ID (localStorage)**

Store a `device_id` in `localStorage` or a cookie, and attach it to each request.

```js
// Frontend
if (!localStorage.getItem("device_id")) {
  localStorage.setItem("device_id", crypto.randomUUID());
}
fetch("/my-ai-endpoint", {
  headers: {
    "X-Device-ID": localStorage.getItem("device_id"),
  },
});
```

Then in FastAPI, read and rate-limit by that header.

**Bonus:** Combine this with IP address for smarter limits:

```python
def combined_key(request: Request):
    ip = get_remote_address(request)
    device_id = request.headers.get("X-Device-ID", "unknown")
    return f"{ip}-{device_id}"
```

---

### 🧠 Advanced: Use CAPTCHA or challenge mechanisms

If you really want to deter bots:

- ✅ Add a **CAPTCHA** (e.g. hCaptcha or Google reCAPTCHA) before allowing access to the endpoint
- ✅ Optionally allow X requests/hour anonymously, then require login or CAPTCHA

---

### 🧰 Summary (Stack Suggestion)

| Layer                | Tool / Method                     | Purpose                         |
| -------------------- | --------------------------------- | ------------------------------- |
| Basic Rate Limiting  | IP-based via `slowapi` or `redis` | Prevent spam globally           |
| Persistent Device ID | `localStorage` + `X-Device-ID`    | More granular per-device limit  |
| Abuse Prevention     | CAPTCHA                           | Block bots and automated spam   |
| Optional Auth        | Login/Signup or OAuth             | Higher request limits for users |

---

If you want, I can help you wire this up step-by-step in FastAPI + your frontend — just tell me your tech stack (React? Next.js?) and how you'd like limits to work (e.g., 3 requests/min/device).
