import os, re
import pdfplumber
import docx
from TTS.api import TTS
from moviepy.editor import ImageClip, AudioFileClip, concatenate_videoclips
from PIL import Image, ImageDraw, ImageFont
import textwrap

def extract_text(file_path: str) -> str:
    ext = os.path.splitext(file_path)[1].lower()
    if ext == ".pdf":
        with pdfplumber.open(file_path) as pdf:
            return "\n".join(p.extract_text() or "" for p in pdf.pages)
    elif ext in [".docx", ".doc"]:
        doc = docx.Document(file_path)
        return "\n".join(p.text for p in doc.paragraphs)
    elif ext == ".txt":
        with open(file_path, "r") as f:
            return f.read()
    return ""

def split_into_sections(text: str) -> list:
    sentences = re.split(r'(?<=[.!?])\s+', text.strip())
    sections = []
    chunk = ""
    for s in sentences:
        chunk += " " + s
        if len(chunk.split()) >= 30:
            sections.append(chunk.strip())
            chunk = ""
    if chunk.strip():
        sections.append(chunk.strip())
    return sections[:10]  # limit to 10 slides

def create_slide_image(text: str, index: int, output_dir: str) -> str:
    img = Image.new("RGB", (1280, 720), color=(15, 23, 42))
    draw = ImageDraw.Draw(img)

    try:
        font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 36)
        small_font = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 24)
    except:
        font = ImageFont.load_default()
        small_font = font

    draw.rectangle([40, 40, 1240, 120], fill=(59, 130, 246))
    draw.text((60, 65), f"Slide {index + 1}", font=small_font, fill=(255, 255, 255))

    lines = textwrap.wrap(text, width=55)
    y = 160
    for line in lines[:8]:
        draw.text((60, y), line, font=font, fill=(226, 232, 240))
        y += 60

    path = f"{output_dir}/slide_{index}.png"
    img.save(path)
    return path

def run_doc_pipeline(input_path: str, output_path: str):
    temp_dir = "temp"
    text = extract_text(input_path)

    if not text.strip():
        raise ValueError("Could not extract text from document")

    sections = split_into_sections(text)

    tts = TTS(model_name="tts_models/en/ljspeech/tacotron2-DDC", progress_bar=False)

    clips = []
    for i, section in enumerate(sections):
        slide_path = create_slide_image(section, i, temp_dir)
        audio_path = f"{temp_dir}/audio_{i}.wav"
        tts.tts_to_file(text=section, file_path=audio_path)

        audio_clip = AudioFileClip(audio_path)
        image_clip = ImageClip(slide_path).set_duration(audio_clip.duration)
        video_clip = image_clip.set_audio(audio_clip)
        clips.append(video_clip)

    final = concatenate_videoclips(clips, method="compose")
    final.write_videofile(output_path, fps=24, codec="libx264", audio_codec="aac", logger=None)
    return {"status": "done", "slides": len(sections)}
