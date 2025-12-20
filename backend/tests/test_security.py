"""
Tests for security utilities
"""
import pytest
from app.core.security import (
    get_password_hash,
    verify_password,
    create_access_token,
    sanitize_input
)


def test_password_hashing():
    """Test password hashing"""
    password = "test_pass"
    hashed = get_password_hash(password)
    
    # Hash should be different from original
    assert hashed != password
    
    # Should verify correctly
    assert verify_password(password, hashed) is True
    
    # Wrong password should fail
    assert verify_password("wrong", hashed) is False


def test_token_creation():
    """Test JWT token creation"""
    data = {"sub": "test@example.com", "type": "access"}
    token = create_access_token(data)
    
    # Token should be a string
    assert isinstance(token, str)
    
    # Token should have content
    assert len(token) > 0


def test_sanitize_input():
    """Test input sanitization"""
    # Test dangerous characters - HTML escaping
    dangerous_input = "<script>alert('xss')</script>"
    sanitized = sanitize_input(dangerous_input)
    assert "&lt;" in sanitized  # < is escaped to &lt;
    assert "&gt;" in sanitized  # > is escaped to &gt;
    assert "<" not in sanitized
    assert ">" not in sanitized
    
    # Test normal input
    normal_input = "Hello World"
    sanitized = sanitize_input(normal_input)
    assert sanitized == "Hello World"
    
    # Test with quotes - HTML escaping preserves them differently
    input_with_quotes = 'Test "with" quotes'
    sanitized = sanitize_input(input_with_quotes)
    # HTML escape converts quotes to &quot;
    assert "&quot;" in sanitized or '"' in sanitized
