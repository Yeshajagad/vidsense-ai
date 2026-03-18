import os
import subprocess
from moviepy.editor import VideoFileClip, AudioFileClip, CompositeAudioClip

MOOD_MAP = {
    "calm": "calm.mp3",
    "energetic": "energetic.mp3",
    "motivational": "motivational.mp3",
    "sad": "sad.mp3",
}

def detect_mood(transcript: str) -> str:
    text = transcript.lower()
    if any(w in text for w in ["excited", "amazing", "energy", "fast", "power"]):
        return "energetic"
    elif any(w in text for w in ["sad", "miss", "loss", "grief", "cry"]):
        return "sad"
    elif any(w in text for w in ["achieve", "goal", "success", "inspire", "dream"]):
        return "motivational"
    else:
        return "calm"

def add_background_music(input_path: str, output_path: str, mood: str = None, transcript: str = ""):
    if mood is None:
        mood = detect_mood(transcript)

    music_file = MOOD_MAP.get(mood, "calm.mp3")
    music_path = os.path.join("assets", "music", music_file)

    if not os.path.exists(music_path):
        import shutil
        shutil.copy(input_path, output_path)
        return output_path, mood

    clip = VideoFileClip(input_path)
    music = AudioFileClip(music_path).volumex(0.15)

    if music.duration < clip.duration:
        loops = int(clip.duration / music.duration) + 1
        from moviepy.editor import concatenate_audioclips
        music = concatenate_audioclips([music] * loops)

    music = music.subclip(0, clip.duration)
    original_audio = clip.audio

    if original_audio:
        mixed = CompositeAudioClip([original_audio, music])
    else:
        mixed = music

    final = clip.set_audio(mixed)
    final.write_videofile(output_path, codec="libx264", audio_codec="aac", logger=None)
    clip.close()
    return output_path, mood
