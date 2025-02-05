from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Dict
import logging
from transformers import AutoModelForCausalLM, AutoTokenizer

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Chatbot")

class ChatRequest(BaseModel):
    user_input: str

class ChatResponse(BaseModel):
    response: str
    conversation_id: str

class ChatbotManager:
    def __init__(self):
        self.conversations: Dict[str, List[Dict]] = {}
        try:
            model_name = "microsoft/DialoGPT-medium"
            self.tokenizer = AutoTokenizer.from_pretrained(model_name)
            self.model = AutoModelForCausalLM.from_pretrained(model_name)
            logger.info("Model loaded successfully")
        except Exception as e:
            logger.error(f"Model load error: {e}")
            raise RuntimeError(f"Init failed: {str(e)}")

    def generate_response(self, conversation_id: str, user_input: str) -> str:
        try:
            inputs = self.tokenizer.encode(user_input + self.tokenizer.eos_token, return_tensors='pt')
            outputs = self.model.generate(
                inputs, 
                max_length=1000,
                pad_token_id=self.tokenizer.eos_token_id,
                temperature=0.7,
                top_p=0.9
            )
            response = self.tokenizer.decode(outputs[0], skip_special_tokens=True)
            return response
        except Exception as e:
            logger.error(f"Generation error: {e}")
            raise HTTPException(status_code=500, detail="Failed to generate response")

chatbot = ChatbotManager()

@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    try:
        user_input = request.user_input.strip()
        if not user_input:
            raise HTTPException(status_code=400, detail="Empty input")
        response = chatbot.generate_response("default", user_input)
        return ChatResponse(response=response, conversation_id="default")
    except Exception as e:
        logger.error(f"Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    return {"status": "healthy", "model": "DialoGPT-medium"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)