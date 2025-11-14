# Face-Swap Tracker Tool - User Guide

## What This Tool Does

A simple terminal-based tracker to help you manage manual face-swapping through Discord InsightFace bot.

**Features:**
- Shows you which image to process next
- Displays the exact Discord command to use
- Tracks your progress (so you can pause/resume)
- Saves progress automatically
- Shows visual progress bar

**What it DOESN'T do:**
- ❌ Does NOT automate Discord (you still do that manually)
- ❌ Does NOT upload images for you
- ❌ Does NOT download results

**It's just a smart checklist that keeps you organized.**

---

## Installation

### Prerequisites
- Python 3 (already installed on your Mac)
- Terminal/Command Line access

### Setup

1. **Open Terminal** (Applications → Utilities → Terminal)

2. **Navigate to the project folder:**
   ```bash
   cd ~/Desktop/xm-automate-code-integrate
   ```

3. **Make the script executable:**
   ```bash
   chmod +x face_swap_tracker.py
   ```

4. **Verify your image folder path:**
   - The script looks for images at:
     `/Users/amalabusoud/Desktop/xiara-upsampler-automation/input/Curated_Dataset_70`
   - If your folder is elsewhere, edit line 13 in the script

---

## How to Use

### Step 1: Run the Script

In Terminal:
```bash
python3 face_swap_tracker.py
```

Or:
```bash
./face_swap_tracker.py
```

### Step 2: Select Images

The script will show you all images in your folder and ask:
```
How many images do you want to process? (recommend 10 for launch):
```

Type `10` and press Enter.

✅ The tool will select the first 10 images for processing.

### Step 3: Choose Face ID

The script will show available face IDs:
```
1. favxm1
2. favxm2
3. favxm3
...
```

**Choose ONE of these options:**

**Option A: Single Face ID**
- Type `3` (for favxm3) and press Enter

**Option B: Combo (up to 4)**
- Type `1,3,5` (for favxm1, favxm3, favxm5) and press Enter

**Recommendation:** Based on your previous tests, choose the face ID that worked best. Stick with ONE for consistency.

### Step 4: Process Images

The tool will show:
```
Progress: 0/10 completed (0%)
████████████████████████████████████████

CURRENT IMAGE (1/10):
  image_001.png

DISCORD COMMAND:
  /favxm3

INSTRUCTIONS:
1. Copy the Discord command above
2. Paste it into Discord (InsightFace bot)
3. Upload the image listed above
4. Wait for result
5. Download the face-swapped image
6. Save it to: /Users/amalabusoud/Desktop/xiara_faceswapped/
   Name it: XM_01_swapped.png

OPTIONS:
  [d] Mark as Done (move to next)
  [s] Skip this image
  [b] Go back to previous
  [q] Quit and save progress
```

### Step 5: Execute in Discord

1. **Copy the Discord command** shown (e.g., `/favxm3`)
2. **Open Discord** → Go to InsightFace bot
3. **Paste command** and press Enter
4. **Upload the image** shown in the tracker
5. **Wait** for InsightFace to process
6. **Download** the result
7. **Save it** to `/Desktop/xiara_faceswapped/`
8. **Name it** `XM_01_swapped.png` (use the number shown)

### Step 6: Mark as Done

Back in the tracker terminal, type `d` and press Enter.

The tool advances to the next image.

**Repeat Steps 5-6 for all 10 images.**

---

## Commands While Running

### `d` - Mark as Done
Marks current image complete and moves to next.

### `s` - Skip
Skips current image (you can come back to it later).

### `b` - Go Back
Returns to previous image if you need to redo it.

### `q` - Quit
Exits and saves progress. Run script again to resume.

---

## Progress Tracking

### Where Progress is Saved
`/Users/amalabusoud/Desktop/xiara_faceswap_progress.json`

This file stores:
- Which images you selected
- Which face ID you're using
- Which images are complete
- Your current position

**You can close the script anytime and resume later!**

### Resume After Interruption

If you quit (press `q`) or the script closes:

1. Run the script again: `python3 face_swap_tracker.py`
2. It will automatically resume where you left off
3. Continue processing remaining images

---

## Output Organization

### Face-Swapped Images Go Here:
`/Users/amalabusoud/Desktop/xiara_faceswapped/`

### Naming Convention:
- `XM_01_swapped.png`
- `XM_02_swapped.png`
- `XM_03_swapped.png`
- ...
- `XM_10_swapped.png`

**Keep this naming consistent!** It makes the next step (upscaling) much easier.

---

## After Completion

When all 10 images are done, the script shows:
```
SESSION COMPLETE! 🎉

Total selected: 10
Completed: 10
Remaining: 0

Face ID used: favxm3

Swapped images saved to:
  /Users/amalabusoud/Desktop/xiara_faceswapped/

✅ ALL IMAGES COMPLETE!

NEXT STEPS:
1. Verify all images are in the output folder
2. Proceed to Day 2: Upscaling (3-stage process)
3. See your 7_DAY_LAUNCH_PLAN.md for details
```

**Next:** Go to Day 2 of your 7-Day Launch Plan!

---

## Troubleshooting

### Problem: "Image folder not found"

**Solution:**
1. Open the script in a text editor
2. Find line 13: `IMAGE_FOLDER = "..."`
3. Update the path to your actual image folder
4. Save and run again

### Problem: Script won't run

**Solution:**
```bash
# Make it executable
chmod +x face_swap_tracker.py

# Run with Python directly
python3 face_swap_tracker.py
```

### Problem: Want to start over

**Solution:**
```bash
# Delete progress file
rm ~/Desktop/xiara_faceswap_progress.json

# Run script again
python3 face_swap_tracker.py
```

### Problem: Made a mistake marking image as done

**Solution:**
- Press `b` to go back
- Or quit (`q`) and manually edit the progress JSON file
- Or delete progress file and start over

---

## Tips for Efficiency

### 1. Open Discord and Terminal Side-by-Side
- Terminal on left (showing tracker)
- Discord on right (for uploading)
- Makes it faster to copy/paste commands

### 2. Batch Download Results
- Process 5 images in Discord first
- Then download all 5 results
- Then mark all 5 as done in tracker

### 3. Take Breaks
- The script saves progress automatically
- Process 5 images, take a break
- Come back and do the remaining 5

### 4. Keep Folder Open
- Open `/Desktop/xiara_faceswapped/` in Finder
- Makes it easy to save downloaded images
- Verify each image as you go

---

## FAQ

**Q: Can I process more than 10 images?**
A: Yes! When the script asks "How many images?" just enter a different number. But for launch, 10 is enough.

**Q: Can I use different face IDs for different images?**
A: Not with this tool. Choose ONE face ID for the batch. For consistency, that's actually better!

**Q: What if I want to test multiple face IDs?**
A: After completing your first batch, run the script again and choose a different face ID. Compare results later.

**Q: The script is too simple. Can we make it fancier?**
A: NO. Simple = reliable. Fancy = derailment risk. Use it as-is for launch.

**Q: Can this tool upload to Discord automatically?**
A: No, and that's intentional. Manual = YOU control the process. No surprises. No loops.

---

## Remember

**This tool's job is to:**
- Keep you organized ✅
- Track progress ✅
- Prevent losing your place ✅
- Show you what to do next ✅

**This tool does NOT:**
- Make decisions for you ❌
- Automate Discord ❌
- Replace your judgment ❌
- Try to "enhance" your workflow ❌

**It's a checklist, not a collaborator. That's why it works.**

---

## Next Steps

After face-swapping all 10 images:

1. ✅ Verify all in `/Desktop/xiara_faceswapped/`
2. ✅ Verify naming: `XM_01` through `XM_10`
3. ✅ Move to **Day 2** of 7-Day Launch Plan
4. ✅ Begin 3-stage upscaling process

**You've got this! One step at a time.** 🚀
