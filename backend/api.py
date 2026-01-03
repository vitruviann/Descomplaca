from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
import os
import asyncio
from session import session_manager
from gatekeeper import gatekeeper_service
from upload import save_upload_file, cleanup_uploads
from upload import save_upload_file, cleanup_uploads
from bot import bot_instance
from scraper import scraper_instance

from routers import orders, proposals, payments, chat, documents, reviews

app = FastAPI(title="Despachante Digital API")

app.include_router(orders.router)
app.include_router(proposals.router)
app.include_router(payments.router)
app.include_router(chat.router)
app.include_router(documents.router)
app.include_router(reviews.router)


@app.on_event("startup")
async def startup_event():
    # Create tables
    import models
    from database import engine
    models.Base.metadata.create_all(bind=engine)
    
    # Start background task for cleanup
    asyncio.create_task(cleanup_loop())

async def cleanup_loop():
    while True:
        session_manager.cleanup_old_sessions()
        # Also clean uploads for expired sessions? 
        # Ideally session manager would return ID of expired sessions to clean their uploads.
        # For now, simplistic approach.
        await asyncio.sleep(60) # Check every minute

# Allow CORS for Electron frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SessionStartResponse(BaseModel):
    session_id: str

@app.get("/")
async def root():
    return {"status": "online", "message": "Despachante Digital Backend Running"}

@app.post("/session/start", response_model=SessionStartResponse)
async def start_session():
    session_id = session_manager.create_session()
    return {"session_id": session_id}

@app.get("/services")
async def list_services():
    return gatekeeper_service.get_available_services()

@app.post("/upload/{session_id}")
async def upload_document(session_id: str, file: UploadFile = File(...)):
    if not session_manager.get_session(session_id):
        raise HTTPException(status_code=404, detail="Session not found")
    
    file_path = await save_upload_file(file, session_id)
    return {"status": "uploaded", "path": file_path}

@app.post("/login/govbr/start")
async def start_govbr_login():
    # Trigger bot to go to login page
    success = await bot_instance.navigate_to_gov_br()
    if success:
        return {"status": "navigated", "message": "Please scan QR Code"}
    else:
        raise HTTPException(status_code=500, detail="Failed to navigate to Gov.br")

@app.post("/process/start/{session_id}")
async def start_process(session_id: str):
    if not session_manager.get_session(session_id):
        raise HTTPException(status_code=404, detail="Session not found")
    
    # Simulate partial flow
    # 1. Check login (Bot should be logged in by now if user scanned QR)
    # is_logged_in = await bot_instance.check_login_success()
    # if not is_logged_in:
    #     return {"status": "error", "message": "Login Gov.br não detectado"}
    
    # 2. Scrape Data
    user_data = await bot_instance.scrape_user_data()
    
    # 3. Fill Municipal Form
    result = await bot_instance.fill_vila_velha_form(user_data)
    
    # 4. Cleanup
    session_manager.clear_session(session_id)
    # await bot_instance.close() # Maybe keep open for next? Or close context.
    
    return {"status": "success", "protocol": "DET-2025-X"}

@app.post("/cleanup/{session_id}")
async def cleanup_session(session_id: str):
    session_manager.clear_session(session_id)
    return {"status": "cleaned"}


# In-memory storage for pipeline data (replace with DB for production)
pipeline_cache = {
    "data": [],
    "last_updated": None
}

@app.post("/pipeline/refresh")
async def refresh_pipeline():
    # In a real scenario, credentials should come from a secure store or the request
    # For now, we mock valid credentials or expect sessions to be active if run manually
    # Or expect user to provide them in the request body
    # For now, triggered without explicit creds (relying on open browser or hardcoded in scraper dev)
    
    # NOTE: Since we don't have user creds in code, this will fail if not logged in.
    # Future enhancement: Accept credentials in body.
    
    try:
        data = await scraper_instance.fetch_pipeline_data()
        pipeline_cache["data"] = data
        import datetime
        pipeline_cache["last_updated"] = datetime.datetime.now().isoformat()
        return {"status": "success", "count": len(data)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/pipeline/data")
async def get_pipeline_data():
    return pipeline_cache

if __name__ == "__main__":
    uvicorn.run("api:app", host="127.0.0.1", port=8000, reload=True)
