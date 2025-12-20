"""
AI Service endpoints for ARC Privus AI Madre
Provides access to AI capabilities and modules
"""
from fastapi import APIRouter, HTTPException, status, Depends
from pydantic import BaseModel, Field
from typing import Dict, List, Optional
import logging

from app.core.security import verify_token
from app.modules.ai.service import AIService

logger = logging.getLogger(__name__)
router = APIRouter()

# Initialize AI service
ai_service = AIService()


class AIRequest(BaseModel):
    """AI inference request model"""
    prompt: str = Field(..., description="Input prompt for AI processing")
    max_tokens: Optional[int] = Field(1000, description="Maximum tokens to generate")
    temperature: Optional[float] = Field(0.7, description="Sampling temperature")
    context: Optional[Dict] = Field(None, description="Additional context for processing")


class AIResponse(BaseModel):
    """AI inference response model"""
    result: str
    tokens_used: int
    processing_time: float
    model_version: str


@router.post("/infer", response_model=AIResponse)
async def ai_inference(
    request: AIRequest,
    token_payload: dict = Depends(verify_token)
):
    """
    Perform AI inference with the provided prompt
    
    Args:
        request: AI inference request
        token_payload: Authenticated user token payload
        
    Returns:
        AI inference result
    """
    logger.info(f"AI inference request from user: {token_payload.get('sub')}")
    
    try:
        result = await ai_service.process_request(
            prompt=request.prompt,
            max_tokens=request.max_tokens,
            temperature=request.temperature,
            context=request.context
        )
        return result
    except Exception as e:
        logger.error(f"AI inference error: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="AI processing failed"
        )


@router.get("/models")
async def list_available_models(token_payload: dict = Depends(verify_token)) -> Dict:
    """
    List available AI models
    
    Args:
        token_payload: Authenticated user token payload
        
    Returns:
        List of available AI models
    """
    models = ai_service.get_available_models()
    return {"models": models}


@router.get("/capabilities")
async def get_ai_capabilities() -> Dict:
    """
    Get AI system capabilities
    
    Returns:
        Dictionary of AI capabilities and features
    """
    return {
        "capabilities": [
            {
                "name": "Natural Language Processing",
                "description": "Advanced text understanding and generation",
                "status": "active"
            },
            {
                "name": "Sentiment Analysis",
                "description": "Analyze sentiment and emotions in text",
                "status": "active"
            },
            {
                "name": "Text Classification",
                "description": "Classify and categorize text content",
                "status": "active"
            },
            {
                "name": "Entity Recognition",
                "description": "Extract and identify entities from text",
                "status": "planned"
            },
            {
                "name": "Language Translation",
                "description": "Translate between multiple languages",
                "status": "planned"
            }
        ],
        "modules": {
            "education": "Educational content generation and tutoring",
            "business": "Business intelligence and automation",
            "monetization": "Revenue optimization and market analysis"
        }
    }
