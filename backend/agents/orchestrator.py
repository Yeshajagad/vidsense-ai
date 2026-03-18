import os
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.schema import HumanMessage
from dotenv import load_dotenv
import json, shutil

load_dotenv()

llm = ChatGoogleGenerativeAI(
    model="gemini-1.5-flash",
    google_api_key=os.getenv("GOOGLE_API_KEY")
)

def parse_intent(prompt: str) -> dict:
    system = """You are a video editing intent parser. 
Given a user prompt, return ONLY a valid JSON object with these keys:
- actions: list of strings from [remove_silence, add_captions, blur_objects, speed_up, censor_word, generate_chapters, add_music]
- params: dict with optional keys: speed_factor (float), censor_word (str), blur_target (str), mood (str)

Example output:
{"actions": ["remove_silence", "add_captions"], "params": {}}
"""
    response = llm.invoke([HumanMessage(content=f"{system}\n\nUser prompt: {prompt}")])
    text = response.content.strip()
    # Extract JSON from response
    if "```" in text:
        text = text.split("```")[1].replace("json", "").strip()
    try:
        return json.loads(text)
    except:
        return {"actions": ["add_captions"], "params": {}}


def run_agent(input_path: str, output_path: str, prompt: str) -> dict:
    from tools.video_tools import remove_silences, speed_up_video
    from tools.audio_tools import add_captions, censor_word
    from tools.vision_tools import blur_objects
    from tools.music_tools import add_background_music
    from tools.video_parser import generate_chapters

    intent = parse_intent(prompt)
    actions = intent.get("actions", [])
    params = intent.get("params", {})

    current_path = input_path
    temp_dir = "temp"
    step = 0
    summary_parts = []
    chapters = []

    def next_temp(label):
        nonlocal step
        step += 1
        return f"{temp_dir}/step_{step}_{label}.mp4"

    for action in actions:
        try:
            if action == "remove_silence":
                out = next_temp("silence")
                remove_silences(current_path, out)
                current_path = out
                summary_parts.append("Removed silences")

            elif action == "add_captions":
                out = next_temp("captions")
                add_captions(current_path, out)
                current_path = out
                summary_parts.append("Added captions")

            elif action == "blur_objects":
                target = params.get("blur_target", "person")
                out = next_temp("blur")
                blur_objects(current_path, out, target_class=target)
                current_path = out
                summary_parts.append(f"Blurred {target}s")

            elif action == "speed_up":
                factor = float(params.get("speed_factor", 1.5))
                out = next_temp("speed")
                speed_up_video(current_path, out, factor=factor)
                current_path = out
                summary_parts.append(f"Sped up {factor}x")

            elif action == "censor_word":
                word = params.get("censor_word", "")
                if word:
                    out = next_temp("censor")
                    censor_word(current_path, out, word=word)
                    current_path = out
                    summary_parts.append(f"Censored word: {word}")

            elif action == "generate_chapters":
                chapters = generate_chapters(current_path)
                summary_parts.append("Generated chapters")

            elif action == "add_music":
                mood = params.get("mood", None)
                out = next_temp("music")
                _, detected_mood = add_background_music(current_path, out, mood=mood)
                current_path = out
                summary_parts.append(f"Added {detected_mood} background music")

        except Exception as e:
            summary_parts.append(f"⚠️ {action} failed: {str(e)}")
            continue

    shutil.copy(current_path, output_path)

    return {
        "summary": " | ".join(summary_parts) if summary_parts else "No actions applied",
        "chapters": chapters
    }
