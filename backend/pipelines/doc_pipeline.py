import os, re
import pdfplumber
import docx
from gtts import gTTS
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
    return sections[:10]

def create_slide_image(text: str, index: int, output_dir: str) -> str:
    img = Image.new("RGB", (1280, 720), color=(15, 23, 42))
    draw = ImageDraw.Draw(img)

    try:
        font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 36)
        small_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 24)
    except:
        font = ImageFont.load_default()
        small_font = font

    # Header bar
    draw.rectangle([0, 0, 1280, 90], fill=(37, 99, 235))
    draw.text((40, 28), f"Slide {index + 1}", font=small_font, fill=(255, 255, 255))

    # Body text
    lines = textwrap.wrap(text, width=55)
    y = 130
    for line in lines[:8]:
        draw.text((40, y), line, font=font, fill=(226, 232, 240))
        y += 62

    path = f"{output_dir}/slide_{index}.png"
    img.save(path)
    return path

def run_doc_pipeline(input_path: str, output_path: str):
    temp_dir = "temp"
    os.makedirs(temp_dir, exist_ok=True)

    text = extract_text(input_path)
    if not text.strip():
        raise ValueError("Could not extract text from document")

    sections = split_into_sections(text)
    clips = []

    for i, section in enumerate(sections):
        slide_path = create_slide_image(section, i, temp_dir)
        audio_path = f"{temp_dir}/audio_{i}.mp3"

        # gTTS — works everywhere, no heavy deps
        tts = gTTS(text=section, lang='en', slow=False)
        tts.save(audio_path)

        audio_clip = AudioFileClip(audio_path)
        image_clip  = ImageClip(slide_path).set_duration(audio_clip.duration)
        video_clip  = image_clip.set_audio(audio_clip)
        clips.append(video_clip)

    final = concatenate_videoclips(clips, method="compose")
    final.write_videofile(
        output_path, fps=24,
        codec="libx264", audio_codec="aac",
        logger=None
    )
    return {"status": "done", "slides": len(sections)}
