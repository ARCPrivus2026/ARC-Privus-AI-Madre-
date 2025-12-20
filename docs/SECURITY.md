# Security Best Practices

## Overview

Security is a fundamental pillar of ARC Privus AI Madre. This document outlines security best practices and guidelines for developers.

## Authentication & Authorization

### JWT Tokens

- **Token Expiration**: Set appropriate expiration times (default: 60 minutes)
- **Token Storage**: Store tokens securely (HttpOnly cookies in production)
- **Token Refresh**: Implement refresh token mechanism
- **Token Revocation**: Maintain revocation list for compromised tokens

### Password Security

```python
# Good: Using bcrypt with automatic salt
from passlib.context import CryptContext
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
hashed = pwd_context.hash(password)

# Bad: Plain text or weak hashing
password = "plain_text"  # NEVER DO THIS
```

### Password Requirements

- Minimum 8 characters
- Mix of uppercase, lowercase, numbers, and symbols (recommended)
- Check against common password lists
- Implement rate limiting on login attempts

## Input Validation

### Always Validate User Input

```python
from pydantic import BaseModel, validator

class UserInput(BaseModel):
    email: str
    age: int
    
    @validator('age')
    def age_must_be_positive(cls, v):
        if v < 0:
            raise ValueError('Age must be positive')
        return v
```

### Sanitization

```python
# Remove dangerous characters
def sanitize_input(text: str) -> str:
    dangerous = ["<", ">", "&", '"', "'", "/", "\\"]
    for char in dangerous:
        text = text.replace(char, "")
    return text.strip()
```

## SQL Injection Prevention

### Use ORMs and Parameterized Queries

```python
# Good: Using SQLAlchemy ORM
user = db.query(User).filter(User.email == email).first()

# Bad: String concatenation
query = f"SELECT * FROM users WHERE email = '{email}'"  # NEVER DO THIS
```

## Cross-Site Scripting (XSS) Prevention

### Frontend

```typescript
// Good: React automatically escapes
<div>{userInput}</div>

// Bad: dangerouslySetInnerHTML without sanitization
<div dangerouslySetInnerHTML={{__html: userInput}} />  // Dangerous!
```

### Backend

- Escape HTML in responses
- Set appropriate Content-Type headers
- Use Content Security Policy (CSP) headers

## Cross-Site Request Forgery (CSRF)

### CSRF Tokens

```python
# Implement CSRF token validation
from fastapi_csrf_protect import CsrfProtect

@app.post("/api/action")
async def action(csrf_protect: CsrfProtect = Depends()):
    await csrf_protect.validate_csrf_in_cookies(request)
    # Process action
```

## CORS Configuration

```python
# Configure CORS properly
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://yourdomain.com"],  # Specific origins
    allow_credentials=True,
    allow_methods=["GET", "POST"],  # Specific methods
    allow_headers=["*"],
)
```

## Rate Limiting

### Implement Rate Limiting

```python
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)

@app.post("/api/login")
@limiter.limit("5/minute")  # 5 attempts per minute
async def login():
    pass
```

## Secrets Management

### Environment Variables

```bash
# Good: Using environment variables
SECRET_KEY=${SECRET_KEY}

# Bad: Hardcoded secrets
SECRET_KEY="hardcoded-secret-123"  # NEVER DO THIS
```

### Secret Rotation

- Rotate secrets regularly
- Use secret management tools (AWS Secrets Manager, HashiCorp Vault)
- Never commit secrets to version control

## HTTPS/TLS

### Production Requirements

- Always use HTTPS in production
- Use valid SSL/TLS certificates
- Enforce HTTPS redirects
- Use HSTS headers

```python
# Add security headers
@app.middleware("http")
async def add_security_headers(request, call_next):
    response = await call_next(request)
    response.headers["Strict-Transport-Security"] = "max-age=31536000"
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    return response
```

## Logging and Monitoring

### Security Logging

```python
import logging

# Log security events
logger.info(f"Login attempt: {email}")
logger.warning(f"Failed login: {email}")
logger.error(f"Suspicious activity: {details}")
```

### What to Log

- Authentication attempts (success and failure)
- Authorization failures
- Input validation failures
- Suspicious patterns
- System errors

### What NOT to Log

- Passwords (even hashed)
- Full credit card numbers
- Personal identification numbers
- Secret keys or tokens

## Dependency Management

### Keep Dependencies Updated

```bash
# Check for vulnerabilities
pip list --outdated
npm audit

# Update dependencies
pip install --upgrade package
npm update
```

### Use Security Scanners

- Dependabot (GitHub)
- Snyk
- Safety (Python)
- npm audit (Node.js)

## File Upload Security

### Validate File Uploads

```python
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'pdf'}
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB

def allowed_file(filename: str) -> bool:
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def validate_file_size(file) -> bool:
    file.seek(0, 2)  # Seek to end
    size = file.tell()
    file.seek(0)  # Reset
    return size <= MAX_FILE_SIZE
```

## API Security

### API Keys

- Generate strong API keys
- Implement key rotation
- Allow key revocation
- Rate limit by API key

### API Versioning

- Version your APIs (/api/v1/, /api/v2/)
- Deprecate old versions gracefully
- Document breaking changes

## Database Security

### Connection Security

```python
# Use SSL/TLS for database connections
DATABASE_URL = "postgresql://user:pass@host:5432/db?sslmode=require"
```

### Principle of Least Privilege

- Use separate database users for different services
- Grant minimal required permissions
- Never use database root/admin in applications

## Error Handling

### Avoid Information Disclosure

```python
# Good: Generic error message
try:
    process_sensitive_data()
except Exception as e:
    logger.error(f"Processing error: {str(e)}")
    raise HTTPException(status_code=500, detail="An error occurred")

# Bad: Exposing internal details
except Exception as e:
    raise HTTPException(status_code=500, detail=str(e))  # May leak info
```

## Security Checklist

### Development

- [ ] All inputs are validated
- [ ] All outputs are escaped/sanitized
- [ ] Authentication implemented correctly
- [ ] Authorization checks in place
- [ ] No secrets in code
- [ ] Dependencies are up to date
- [ ] Security headers configured

### Production

- [ ] HTTPS enabled
- [ ] Database connections secured
- [ ] Rate limiting active
- [ ] Logging configured
- [ ] Monitoring in place
- [ ] Backup system active
- [ ] Secrets rotated
- [ ] Security scanning enabled

## Incident Response

### In Case of Security Breach

1. **Contain**: Isolate affected systems
2. **Assess**: Determine scope and impact
3. **Notify**: Inform affected users and authorities
4. **Remediate**: Fix vulnerabilities
5. **Review**: Analyze root cause
6. **Improve**: Update security measures

## Security Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [CWE Top 25](https://cwe.mitre.org/top25/)
- [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework)

## Regular Security Reviews

- Conduct quarterly security audits
- Perform penetration testing
- Review access logs
- Update security policies
- Train team on security practices

---

Remember: **Security is not a feature, it's a requirement.**
