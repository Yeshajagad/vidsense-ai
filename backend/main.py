from fastapi import FastAPI, UploadFile, File, Form, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
import uvicorn, uuid, os, shutil
from dotenv import load_dotenv
from agents.orchestrator import run_agent
from pipelines.doc_pipeline import run_doc_pipeline

load_dotenv()

app = FastAPI(title="VidSense AI", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = os.getenv("UPLOAD_DIR", "uploads")
OUTPUT_DIR = os.getenv("OUTPUT_DIR", "outputs")

# Track job statuses in memory
job_status = {}

@app.get("/")
def root():
    return {"message": "VidSense AI is running 🎬"}

@app.post("/api/edit")
async def edit_video(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    prompt: str = Form(...)
):
    job_id = str(uuid.uuid4())
    ext = os.path.splitext(file.filename)[1]
    input_path = f"{UPLOAD_DIR}/{job_id}{ext}"
    output_path = f"{OUTPUT_DIR}/{job_id}_output.mp4"

    with open(input_path, "wb") as f:
        shutil.copyfileobj(file.file, f)

    job_status[job_id] = {"status": "processing", "message": "Job started"}

    background_tasks.add_task(
        process_job, job_id, input_path, output_path, prompt
    )

    return {"job_id": job_id, "status": "processing"}

@app.post("/api/doc-to-video")
async def doc_to_video(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...)
):
    job_id = str(uuid.uuid4())
    ext = os.path.splitext(file.filename)[1]
    input_path = f"{UPLOAD_DIR}/{job_id}{ext}"
    output_path = f"{OUTPUT_DIR}/{job_id}_output.mp4"

    with open(input_path, "wb") as f:
        shutil.copyfileobj(file.file, f)

    job_status[job_id] = {"status": "processing", "message": "Doc pipeline started"}

    background_tasks.add_task(
        process_doc_job, job_id, input_path, output_path
    )

    return {"job_id": job_id, "status": "processing"}

@app.get("/api/status/{job_id}")
def get_status(job_id: str):
    return job_status.get(job_id, {"status": "not_found"})

@app.get("/api/download/{filename}")
def download_file(filename: str):
    path = f"{OUTPUT_DIR}/{filename}"
    if os.path.exists(path):
        return FileResponse(path, media_type="video/mp4", filename=filename)
    return {"error": "File not found"}

def process_job(job_id, input_path, output_path, prompt):
    try:
        job_status[job_id] = {"status": "processing", "message": "Running AI agents..."}
        result = run_agent(input_path, output_path, prompt)
        job_status[job_id] = {
            "status": "done",
            "message": result.get("summary", "Completed"),
            "output_file": os.path.basename(output_path)
        }
    except Exception as e:
        job_status[job_id] = {"status": "error", "message": str(e)}

def process_doc_job(job_id, input_path, output_path):
    try:
        job_status[job_id] = {"status": "processing", "message": "Converting document..."}
        result = run_doc_pipeline(input_path, output_path)
        job_status[job_id] = {
            "status": "done",
            "message": "Document converted to video",
            "output_file": os.path.basename(output_path)
        }
    except Exception as e:
        job_status[job_id] = {"status": "error", "message": str(e)}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
