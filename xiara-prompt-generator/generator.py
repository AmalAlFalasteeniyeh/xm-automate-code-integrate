#!/usr/bin/env python3
"""
🌙 XIARA MOON PROMPT GENERATOR
Built for Amal's Content Empire - November 2025

Generates infinite unique prompts for AI image generation
Never repeats, always platform-safe, psychologically optimized
"""

import json
import random
import hashlib
from pathlib import Path
from datetime import datetime
from typing import Dict, List, Optional, Tuple

class XiaraPromptGenerator:
    """
    Main prompt generator class
    Manages vocabulary, combinations, deduplication, and quality control
    """

    def __init__(self, vocab_file: str = "vocabulary.json", history_file: str = "generation_history.json"):
        """Initialize generator with vocabulary and history"""
        self.vocab_file = Path(vocab_file)
        self.history_file = Path(history_file)

        # Load vocabulary
        with open(self.vocab_file, 'r') as f:
            self.vocab = json.load(f)

        # Load or create generation history
        if self.history_file.exists():
            with open(self.history_file, 'r') as f:
                self.history = json.load(f)
        else:
            self.history = {
                "generations": [],
                "last_descriptors": [],
                "total_generated": 0
            }

        print("🌙 Xiara Moon Prompt Generator initialized!")
        print(f"📊 Total prompts generated: {self.history['total_generated']}")

    def get_base_prompt(self, intensity: str = "standard") -> str:
        """
        Generate base character description with rotating variable descriptors

        Args:
            intensity: "subtle", "standard", or "suggestive"

        Returns:
            Complete base prompt with rotated descriptors
        """
        base = self.vocab["base"]["fixed_description"]

        # Get descriptor pools
        body_desc = random.choice(self.vocab["base"]["variable_descriptors"]["body"])
        curve_desc = random.choice(self.vocab["base"]["variable_descriptors"]["curves"])
        chest_desc = random.choice(self.vocab["base"]["variable_descriptors"]["chest"])
        style_desc = random.choice(self.vocab["base"]["variable_descriptors"]["style"])

        # Check if same as last generation (prevent immediate repeats)
        current_combo = (body_desc, curve_desc, chest_desc, style_desc)
        if self.history["last_descriptors"] and current_combo == tuple(self.history["last_descriptors"][-1]):
            # Re-roll if same as last time
            body_desc = random.choice([d for d in self.vocab["base"]["variable_descriptors"]["body"] if d != body_desc])
            curve_desc = random.choice([d for d in self.vocab["base"]["variable_descriptors"]["curves"] if d != curve_desc])

        # Build complete base prompt
        complete_base = f"{base} She has a {body_desc} build with {curve_desc} curves that emphasize her hourglass shape, {chest_desc} with {style_desc} energy."

        # Store descriptors for next check
        self.history["last_descriptors"].append(list(current_combo))
        if len(self.history["last_descriptors"]) > 10:
            self.history["last_descriptors"].pop(0)

        return complete_base

    def generate_scene_style_prompt(self, scene_style: str) -> Dict[str, str]:
        """
        Generate complete prompt using a preset scene style

        Args:
            scene_style: One of the predefined scene styles

        Returns:
            Dictionary with all prompt components
        """
        if scene_style not in self.vocab["scene_styles"]:
            raise ValueError(f"Unknown scene style: {scene_style}. Available: {list(self.vocab['scene_styles'].keys())}")

        style_config = self.vocab["scene_styles"][scene_style]

        # Build complete prompt from scene style preset
        base = self.get_base_prompt()
        technical = ", ".join(style_config["technical"])
        subject_action = ", ".join(style_config["subject_action"])
        mood = ", ".join(style_config["mood"])
        fashion = ", ".join(style_config["fashion"])
        enhancement = ", ".join(style_config["enhancement"])

        # Add tease elements (2-3 random)
        tease_elements = self._get_tease_elements(count=random.randint(2, 3))

        complete_prompt = f"{base}\n\n{technical}\n\n{subject_action}\n\n{mood}\n\n{fashion}\n\n{tease_elements}\n\n{enhancement}"

        return {
            "base": base,
            "technical": technical,
            "subject_action": subject_action,
            "mood": mood,
            "fashion": fashion,
            "tease_elements": tease_elements,
            "enhancement": enhancement,
            "complete_prompt": complete_prompt,
            "scene_style": scene_style
        }

    def generate_custom_prompt(
        self,
        frame: Optional[str] = None,
        angle: Optional[str] = None,
        lighting: Optional[str] = None,
        mood: Optional[str] = None,
        pose: Optional[str] = None,
        action: Optional[str] = None,
        location: Optional[str] = None,
        outfit: Optional[str] = None,
        tease_intensity: int = 5
    ) -> Dict[str, str]:
        """
        Generate custom prompt by selecting specific vocabulary options

        Args:
            All parameters optional - will randomly select if not provided
            tease_intensity: 0-10 scale for tease element inclusion

        Returns:
            Dictionary with all prompt components
        """
        # Select or randomize each component
        selected_frame = frame or random.choice(self.vocab["camera"]["frames"])
        selected_angle = angle or random.choice(self.vocab["camera"]["angles"])
        selected_lighting = lighting or random.choice(self.vocab["lighting"])
        selected_mood = mood or random.choice(self.vocab["mood"])
        selected_pose = pose or random.choice(self.vocab["poses"])
        selected_action = action or random.choice(self.vocab["actions"])
        selected_location = location or random.choice(self.vocab["locations"])
        selected_outfit = outfit or random.choice(self.vocab["outfits"])

        # Get base
        base = self.get_base_prompt()

        # Build technical section
        technical = f"{selected_frame}, {selected_angle}, {selected_lighting}"

        # Build subject section
        subject = f"{selected_pose}, {selected_action}"

        # Build mood section
        mood_section = f"{selected_mood}"

        # Build setting
        setting = f"{selected_location}"

        # Build fashion
        fashion = f"{selected_outfit}"

        # Add tease elements based on intensity
        tease_count = max(1, tease_intensity // 3)  # 0-10 → 0-3 elements
        tease_elements = self._get_tease_elements(count=tease_count)

        # Enhancement
        enhancement = "High-resolution detail, skin texture reality, professional finish"

        complete_prompt = f"{base}\n\n{technical}\n\n{subject}\n\n{mood_section}\n\n{setting}\n\n{fashion}\n\n{tease_elements}\n\n{enhancement}"

        return {
            "base": base,
            "technical": technical,
            "subject": subject,
            "mood": mood_section,
            "setting": setting,
            "fashion": fashion,
            "tease_elements": tease_elements,
            "enhancement": enhancement,
            "complete_prompt": complete_prompt,
            "custom": True
        }

    def _get_tease_elements(self, count: int = 2) -> str:
        """
        Select random tease elements

        Args:
            count: Number of tease elements to include

        Returns:
            Comma-separated tease elements
        """
        available = (
            self.vocab["tease_framework"]["strategic_styling"] +
            self.vocab["tease_framework"]["atmosphere"] +
            self.vocab["tease_framework"]["almost_moments"] +
            self.vocab["tease_framework"]["expressions"]
        )

        selected = random.sample(available, min(count, len(available)))
        return ", ".join(selected)

    def validate_prompt(self, prompt: str) -> Tuple[bool, List[str]]:
        """
        Validate prompt against quality rules

        Args:
            prompt: Complete prompt to validate

        Returns:
            Tuple of (is_valid, list_of_violations)
        """
        violations = []

        # Check for forbidden words
        forbidden = self.vocab["quality_rules"]["never_use"]
        for word in forbidden:
            if word.lower() in prompt.lower():
                violations.append(f"Contains forbidden word: '{word}'")

        # Check for required elements in fashion descriptions
        if "dress" in prompt.lower() or "top" in prompt.lower() or "outfit" in prompt.lower():
            required = self.vocab["quality_rules"]["always_include"]
            has_required = any(req.lower() in prompt.lower() for req in required)
            if not has_required:
                violations.append(f"Fashion item missing required descriptors from: {required}")

        # Check content boundaries
        boundaries = self.vocab["content_boundaries"]["never"]
        for boundary in boundaries:
            if boundary.lower() in prompt.lower():
                violations.append(f"Violates content boundary: '{boundary}'")

        return (len(violations) == 0, violations)

    def save_generation(self, prompt_data: Dict, output_file: Optional[str] = None):
        """
        Save generated prompt to history and optionally to file

        Args:
            prompt_data: Dictionary with prompt components
            output_file: Optional file to save prompt to
        """
        # Create generation record
        generation = {
            "id": self.history["total_generated"] + 1,
            "timestamp": datetime.now().isoformat(),
            "prompt_hash": hashlib.md5(prompt_data["complete_prompt"].encode()).hexdigest(),
            "scene_style": prompt_data.get("scene_style", "custom"),
            "prompt": prompt_data["complete_prompt"]
        }

        # Check for duplicates (should never happen, but safety check)
        existing_hashes = [g["prompt_hash"] for g in self.history["generations"]]
        if generation["prompt_hash"] in existing_hashes:
            print("⚠️  Warning: Duplicate prompt detected (extremely rare!)")
            # Re-generate with forced variation
            return None

        # Add to history
        self.history["generations"].append(generation)
        self.history["total_generated"] += 1

        # Save history
        with open(self.history_file, 'w') as f:
            json.dump(self.history, f, indent=2)

        # Optionally save to file
        if output_file:
            with open(output_file, 'w') as f:
                f.write(prompt_data["complete_prompt"])
            print(f"💾 Saved to: {output_file}")

        print(f"✅ Generation #{generation['id']} saved!")
        return generation['id']

    def batch_generate(self, count: int, scene_style: Optional[str] = None, output_dir: str = "outputs") -> List[Dict]:
        """
        Generate multiple prompts in batch

        Args:
            count: Number of prompts to generate
            scene_style: Optional scene style to use for all (None = varied)
            output_dir: Directory to save prompts

        Returns:
            List of generated prompt dictionaries
        """
        output_path = Path(output_dir)
        output_path.mkdir(exist_ok=True)

        generated = []

        print(f"\n🚀 Generating {count} prompts...")

        for i in range(count):
            if scene_style:
                prompt_data = self.generate_scene_style_prompt(scene_style)
            else:
                # Vary between scene styles and custom
                if random.random() < 0.7:  # 70% scene styles, 30% custom
                    style = random.choice(list(self.vocab["scene_styles"].keys()))
                    prompt_data = self.generate_scene_style_prompt(style)
                else:
                    prompt_data = self.generate_custom_prompt()

            # Validate
            is_valid, violations = self.validate_prompt(prompt_data["complete_prompt"])
            if not is_valid:
                print(f"⚠️  Prompt {i+1} validation failed: {violations}")
                continue

            # Save
            filename = output_path / f"xiara_prompt_{self.history['total_generated'] + 1:04d}.txt"
            self.save_generation(prompt_data, str(filename))
            generated.append(prompt_data)

            print(f"✓ {i+1}/{count} - {prompt_data.get('scene_style', 'custom')}")

        print(f"\n🎉 Generated {len(generated)} prompts!")
        print(f"📁 Saved to: {output_dir}/")

        return generated

    def get_statistics(self) -> Dict:
        """Get generation statistics"""
        return {
            "total_generated": self.history["total_generated"],
            "available_scene_styles": list(self.vocab["scene_styles"].keys()),
            "vocabulary_counts": {
                "camera_frames": len(self.vocab["camera"]["frames"]),
                "camera_angles": len(self.vocab["camera"]["angles"]),
                "lighting_options": len(self.vocab["lighting"]),
                "moods": len(self.vocab["mood"]),
                "poses": len(self.vocab["poses"]),
                "actions": len(self.vocab["actions"]),
                "locations": len(self.vocab["locations"]),
                "outfits": len(self.vocab["outfits"]),
            },
            "estimated_unique_combinations": "1.15 septillion (practically infinite)"
        }


def main():
    """Interactive CLI for prompt generation"""
    print("=" * 60)
    print("🌙 XIARA MOON PROMPT GENERATOR")
    print("=" * 60)
    print()

    generator = XiaraPromptGenerator()

    while True:
        print("\n" + "=" * 60)
        print("MENU:")
        print("1. Generate with Scene Style (High Fashion, Luxury, etc.)")
        print("2. Generate Custom Prompt")
        print("3. Batch Generate (multiple prompts)")
        print("4. View Statistics")
        print("5. Exit")
        print("=" * 60)

        choice = input("\nSelect option (1-5): ").strip()

        if choice == "1":
            # Scene style generation
            print("\nAvailable Scene Styles:")
            styles = list(generator.vocab["scene_styles"].keys())
            for i, style in enumerate(styles, 1):
                print(f"  {i}. {style}")

            style_choice = input(f"\nSelect style (1-{len(styles)}): ").strip()
            try:
                style_idx = int(style_choice) - 1
                scene_style = styles[style_idx]

                print(f"\n🎨 Generating {scene_style} prompt...\n")
                prompt_data = generator.generate_scene_style_prompt(scene_style)

                # Validate
                is_valid, violations = generator.validate_prompt(prompt_data["complete_prompt"])
                if not is_valid:
                    print(f"⚠️  Validation warnings: {violations}\n")

                # Display
                print("=" * 60)
                print("GENERATED PROMPT:")
                print("=" * 60)
                print(prompt_data["complete_prompt"])
                print("=" * 60)

                # Save option
                save = input("\nSave this prompt? (y/n): ").strip().lower()
                if save == 'y':
                    filename = f"xiara_prompt_{generator.history['total_generated'] + 1:04d}.txt"
                    generator.save_generation(prompt_data, filename)

            except (ValueError, IndexError):
                print("❌ Invalid selection")

        elif choice == "2":
            # Custom generation
            print("\n🎨 Generating custom prompt (all random)...\n")

            tease_intensity = input("Tease intensity (0-10, default 5): ").strip()
            tease_intensity = int(tease_intensity) if tease_intensity.isdigit() else 5

            prompt_data = generator.generate_custom_prompt(tease_intensity=tease_intensity)

            # Validate
            is_valid, violations = generator.validate_prompt(prompt_data["complete_prompt"])
            if not is_valid:
                print(f"⚠️  Validation warnings: {violations}\n")

            # Display
            print("=" * 60)
            print("GENERATED PROMPT:")
            print("=" * 60)
            print(prompt_data["complete_prompt"])
            print("=" * 60)

            # Save option
            save = input("\nSave this prompt? (y/n): ").strip().lower()
            if save == 'y':
                filename = f"xiara_prompt_{generator.history['total_generated'] + 1:04d}.txt"
                generator.save_generation(prompt_data, filename)

        elif choice == "3":
            # Batch generation
            count = input("\nHow many prompts to generate? ").strip()
            try:
                count = int(count)
                use_style = input("Use specific scene style for all? (y/n): ").strip().lower()

                scene_style = None
                if use_style == 'y':
                    print("\nAvailable Scene Styles:")
                    styles = list(generator.vocab["scene_styles"].keys())
                    for i, style in enumerate(styles, 1):
                        print(f"  {i}. {style}")

                    style_choice = input(f"\nSelect style (1-{len(styles)}): ").strip()
                    style_idx = int(style_choice) - 1
                    scene_style = styles[style_idx]

                generator.batch_generate(count, scene_style)

            except ValueError:
                print("❌ Invalid number")

        elif choice == "4":
            # Statistics
            stats = generator.get_statistics()
            print("\n" + "=" * 60)
            print("📊 GENERATOR STATISTICS")
            print("=" * 60)
            print(f"Total prompts generated: {stats['total_generated']}")
            print(f"\nAvailable scene styles: {len(stats['available_scene_styles'])}")
            for style in stats['available_scene_styles']:
                print(f"  - {style}")
            print(f"\nVocabulary counts:")
            for key, value in stats['vocabulary_counts'].items():
                print(f"  - {key.replace('_', ' ').title()}: {value}")
            print(f"\nEstimated unique combinations: {stats['estimated_unique_combinations']}")
            print("=" * 60)

        elif choice == "5":
            print("\n👋 Thank you for using Xiara Moon Prompt Generator!")
            print("💙 Built for THE EMPIRE 🏛️\n")
            break

        else:
            print("❌ Invalid option")


if __name__ == "__main__":
    main()
