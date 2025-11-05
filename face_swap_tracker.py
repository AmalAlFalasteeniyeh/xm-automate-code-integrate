#!/usr/bin/env python3
"""
Xiara Moon Face-Swap Tracker
Simple tool to track manual face-swapping progress in Discord
"""

import os
import json
from pathlib import Path
from datetime import datetime

# Configuration
IMAGE_FOLDER = "/Users/amalabusoud/Desktop/xiara-upsampler-automation/input/Curated_Dataset_70"
OUTPUT_FOLDER = "/Users/amalabusoud/Desktop/xiara_faceswapped"
PROGRESS_FILE = "/Users/amalabusoud/Desktop/xiara_faceswap_progress.json"

# Face ID options
FACE_IDS = ["favxm1", "favxm2", "favxm3", "favxm4", "favxm5",
            "favxm6", "favxm7", "favxm8", "favxm9", "favxm10"]


def clear_screen():
    """Clear terminal screen"""
    os.system('clear')


def load_progress():
    """Load saved progress from file"""
    if os.path.exists(PROGRESS_FILE):
        with open(PROGRESS_FILE, 'r') as f:
            return json.load(f)
    return {
        'selected_images': [],
        'face_id': None,
        'completed': [],
        'current_index': 0,
        'started_at': None
    }


def save_progress(progress):
    """Save progress to file"""
    with open(PROGRESS_FILE, 'w') as f:
        json.dump(progress, f, indent=2)


def get_images_from_folder():
    """Get all PNG/JPG images from folder"""
    folder = Path(IMAGE_FOLDER)
    if not folder.exists():
        print(f"❌ Error: Image folder not found at {IMAGE_FOLDER}")
        print("Please update IMAGE_FOLDER path in the script.")
        return []

    images = []
    for ext in ['*.png', '*.jpg', '*.jpeg']:
        images.extend(folder.glob(ext))

    return sorted([img.name for img in images])


def select_images(all_images, progress):
    """Let user select which images to process"""
    clear_screen()
    print("=" * 60)
    print("XIARA MOON FACE-SWAP TRACKER")
    print("=" * 60)
    print()
    print(f"Found {len(all_images)} images in folder")
    print()

    # Show first 10 as preview
    print("First 10 images:")
    for i, img in enumerate(all_images[:10], 1):
        print(f"  {i}. {img}")
    if len(all_images) > 10:
        print(f"  ... and {len(all_images) - 10} more")
    print()

    choice = input("How many images do you want to process? (recommend 10 for launch): ")
    try:
        count = int(choice)
        if count > len(all_images):
            count = len(all_images)

        progress['selected_images'] = all_images[:count]
        progress['started_at'] = datetime.now().isoformat()
        save_progress(progress)

        print(f"\n✅ Selected first {count} images")
        input("\nPress Enter to continue...")
        return True
    except ValueError:
        print("❌ Invalid number. Please try again.")
        input("Press Enter to continue...")
        return False


def choose_face_id(progress):
    """Let user choose which face ID to use"""
    clear_screen()
    print("=" * 60)
    print("CHOOSE FACE ID")
    print("=" * 60)
    print()
    print("Available face IDs:")
    for i, face_id in enumerate(FACE_IDS, 1):
        print(f"  {i}. {face_id}")
    print()
    print("You can also combine up to 4 (e.g., '1,3,5' for favxm1, favxm3, favxm5)")
    print()

    choice = input("Enter face ID number(s): ")

    try:
        # Parse input
        if ',' in choice:
            # Multiple IDs
            indices = [int(x.strip()) - 1 for x in choice.split(',')]
            if len(indices) > 4:
                print("❌ Maximum 4 face IDs allowed")
                input("Press Enter to try again...")
                return False
            selected_ids = [FACE_IDS[i] for i in indices if 0 <= i < len(FACE_IDS)]
        else:
            # Single ID
            index = int(choice) - 1
            if 0 <= index < len(FACE_IDS):
                selected_ids = [FACE_IDS[index]]
            else:
                print("❌ Invalid face ID number")
                input("Press Enter to try again...")
                return False

        progress['face_id'] = selected_ids
        save_progress(progress)

        print(f"\n✅ Using: {' '.join(selected_ids)}")
        input("\nPress Enter to continue...")
        return True

    except (ValueError, IndexError):
        print("❌ Invalid input. Please try again.")
        input("Press Enter to continue...")
        return False


def show_current_image(progress):
    """Show current image to process"""
    if progress['current_index'] >= len(progress['selected_images']):
        return False  # All done

    current_img = progress['selected_images'][progress['current_index']]
    total = len(progress['selected_images'])
    current_num = progress['current_index'] + 1
    completed = len(progress['completed'])

    clear_screen()
    print("=" * 60)
    print("XIARA MOON FACE-SWAP TRACKER")
    print("=" * 60)
    print()
    print(f"Progress: {completed}/{total} completed ({int(completed/total*100)}%)")
    print("█" * int(completed/total * 40) + "░" * (40 - int(completed/total * 40)))
    print()
    print("-" * 60)
    print(f"CURRENT IMAGE ({current_num}/{total}):")
    print(f"  {current_img}")
    print()
    print(f"DISCORD COMMAND:")
    print(f"  /{' /'.join(progress['face_id'])}")
    print()
    print("-" * 60)
    print()
    print("INSTRUCTIONS:")
    print("1. Copy the Discord command above")
    print("2. Paste it into Discord (InsightFace bot)")
    print("3. Upload the image listed above")
    print("4. Wait for result")
    print("5. Download the face-swapped image")
    print("6. Save it to:", OUTPUT_FOLDER)
    print(f"   Name it: XM_{current_num:02d}_swapped.png")
    print()
    print("-" * 60)
    print()
    print("OPTIONS:")
    print("  [d] Mark as Done (move to next)")
    print("  [s] Skip this image")
    print("  [b] Go back to previous")
    print("  [q] Quit and save progress")
    print()

    choice = input("Your choice: ").lower().strip()

    if choice == 'd':
        # Mark as done
        progress['completed'].append(current_img)
        progress['current_index'] += 1
        save_progress(progress)
        return True
    elif choice == 's':
        # Skip
        progress['current_index'] += 1
        save_progress(progress)
        return True
    elif choice == 'b':
        # Go back
        if progress['current_index'] > 0:
            progress['current_index'] -= 1
            if progress['completed'] and progress['completed'][-1] == progress['selected_images'][progress['current_index']]:
                progress['completed'].pop()
        save_progress(progress)
        return True
    elif choice == 'q':
        return False
    else:
        return True


def show_summary(progress):
    """Show final summary"""
    clear_screen()
    print("=" * 60)
    print("SESSION COMPLETE! 🎉")
    print("=" * 60)
    print()
    print(f"Total selected: {len(progress['selected_images'])}")
    print(f"Completed: {len(progress['completed'])}")
    print(f"Remaining: {len(progress['selected_images']) - len(progress['completed'])}")
    print()
    print(f"Face ID used: {' '.join(progress['face_id'])}")
    print()
    print(f"Swapped images saved to:")
    print(f"  {OUTPUT_FOLDER}")
    print()

    if len(progress['completed']) < len(progress['selected_images']):
        print("⚠️  You have unfinished images.")
        print("Run this script again to resume where you left off!")
    else:
        print("✅ ALL IMAGES COMPLETE!")
        print()
        print("NEXT STEPS:")
        print("1. Verify all images are in the output folder")
        print("2. Proceed to Day 2: Upscaling (3-stage process)")
        print("3. See your 7_DAY_LAUNCH_PLAN.md for details")

    print()
    print("-" * 60)


def main():
    """Main program loop"""
    # Ensure output folder exists
    os.makedirs(OUTPUT_FOLDER, exist_ok=True)

    # Load progress
    progress = load_progress()

    # Get available images
    all_images = get_images_from_folder()
    if not all_images:
        return

    # Setup phase
    if not progress['selected_images']:
        if not select_images(all_images, progress):
            return

    if not progress['face_id']:
        if not choose_face_id(progress):
            return

    # Processing phase
    while progress['current_index'] < len(progress['selected_images']):
        if not show_current_image(progress):
            break

    # Summary
    show_summary(progress)

    # Ask if they want to reset for next batch
    if len(progress['completed']) == len(progress['selected_images']):
        print()
        choice = input("Start a new batch? (y/n): ").lower()
        if choice == 'y':
            os.remove(PROGRESS_FILE)
            print("\n✅ Progress reset. Run script again to start new batch.")


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n⚠️  Interrupted. Progress saved. Run script again to resume.")
    except Exception as e:
        print(f"\n\n❌ Error: {e}")
        print("Please check the script and try again.")
