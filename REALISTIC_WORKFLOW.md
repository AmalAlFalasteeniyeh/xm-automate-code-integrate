# XIARA MOON - REALISTIC WORKFLOW
## What Actually Works (No Claude Enhancements)

**Last Updated:** November 4, 2025
**Purpose:** Step-by-step process for creating Xiara Moon content
**Philosophy:** Simple, manual, reliable > Complex, automated, broken

---

## WORKFLOW OVERVIEW

```
Generate Images → Face-Swap (Manual) → Upscale (3-Stage) → Publish
Generate Audio → Enhance → Publish
Create Video → Edit → Publish
```

**Key Principle:** Each step is COMPLETE before moving to next. No parallelization until this works.

---

## WORKFLOW 1: IMAGE PRODUCTION

### STEP 1: Image Generation (DONE)

**You already have:** 70 curated images at `/Users/amalabusoud/Desktop/xiara-upsampler-automation/input/Curated_Dataset_70`

**For future batches:**
- Tool: Fal.AI + Your Xiara Moon LoRA
- Settings: FLUX-dev, LoRA weight 0.9, CFG 7-8, 40-50 steps
- Prompt: Use your existing prompts (white corset, Japanese-Brazilian aesthetic)
- Output: 50-100 raw images
- Select: Best 10-20 for face-swapping

**Time:** 2-3 hours per batch (already done for launch)

---

### STEP 2: Face-Swap (MANUAL - Discord Bot)

**What you need:**
- Your 70 curated images (or top 10 selected)
- InsightFace Discord bot access
- Face IDs: favxm1 through favxm10

**Process:**

1. **Pick your best face ID combo**
   - Based on previous tests, you know some combos work better
   - For launch: Pick ONE (favxm3, favxm5, or your preferred)
   - Stick with it for consistency

2. **For each image:**
   - Open Discord
   - Type command: `/favxm3` (or your chosen ID)
   - Upload image
   - Wait for result
   - Download swapped image
   - Save to folder: `/Desktop/xiara_faceswapped/`
   - Move to next image

3. **Organization:**
   ```
   /Desktop/xiara_faceswapped/
       image_01_swapped.png
       image_02_swapped.png
       image_03_swapped.png
       ...
   ```

**Time:** 5-10 minutes per image = 50-100 minutes for 10 images

**Cost:** 1 credit per swap = 10 credits for 10 images

**Tools to help:**
- Use the `face_swap_tracker.py` script (see below) to track progress
- Keeps you organized, prevents losing your place
- Shows which images done, which remain

**DO NOT:**
- ❌ Try to test multiple face ID combos (do this AFTER launch)
- ❌ Attempt to automate this
- ❌ Let Claude touch this process
- ❌ Overthink - just pick one face ID and execute

---

### STEP 3: Upscaling (3-STAGE PROCESS - Upsampler.com)

**You already know this works.** Just execute it.

**Input:** Face-swapped images from Step 2
**Output:** Hyper-realistic, magazine-quality images
**Cost:** ~36 credits per image (all 3 stages)
**Time:** 15-30 minutes per image (processing time)

#### STAGE 1: Foundation Pass

**Settings:**
- Mode: Smart Upscale
- Global Creativity: 6
- Detail: 6
- Regional Creativity: (leave blank)
- Description: (leave empty)
- Enhance Faces: ON

**Upload:** Face-swapped image
**Cost:** ~19 credits
**Download:** Stage 1 output

#### STAGE 2: Detail Enhancement

**Settings:**
- Mode: Smart Upscale
- Global Creativity: 6
- Detail: 6
- Regional Creativity: (leave blank)
- Description: (leave empty)
- Enhance Faces: ON

**Upload:** Stage 1 output
**Cost:** ~9 credits
**Download:** Stage 2 output

#### STAGE 3: Hyper-Realism Pass

**Settings:**
- Mode: Smart Upscale
- Global Creativity: 5 (for faces) or 7 (for full body)
- Detail: 7
- Regional Creativity: (leave blank)
- Description: **[PASTE HYPER-REALISM PROMPT]**
- Enhance Faces: ON

**Hyper-Realism Prompt:**
```
An ultra-realistic image, focusing on skin textures, hair strands and details of fabric to add realism. The skin shows pores, peach fuzz, lip creases and realistic minor imperfections while maintaining the overall identity, features and colors, aesthetics and composition of the subjects. Hair shows individual hair strands in eyebrows, hair, eyelashes and bodyhair or peach fuzz when applicable. Clothing, and other surfaces like furniture, walls, decor, etc. all show detailed sharpness for realism that makes the image appear to be indistinguishable from a real photo. Eyes appear real, with pupils that show a defined circular line for the pupils and retinas against the white of the eye with a realistic eye gloss, no blending and perfect anatomical and subjective realism.
```

**Upload:** Stage 2 output
**Cost:** ~8 credits
**Download:** FINAL OUTPUT

**Save final images to:** `/Desktop/xiara_final/`

**Time for 10 images:** 3-5 hours (most of it is waiting for processing)

**Tips:**
- Can run multiple in parallel (open multiple browser tabs)
- Batch process to save time
- Download immediately when done (don't lose them)

---

### STEP 4: Organization & QA

**File naming:**
```
XM_WhiteCorset_01_FINAL.png
XM_WhiteCorset_02_FINAL.png
...
```

**Quality check each final image:**
- [ ] Visible skin pores (natural, not excessive)
- [ ] Individual hair strands
- [ ] Crisp fabric details
- [ ] Realistic eyes with proper gloss
- [ ] Lip texture and creases
- [ ] No AI artifacts
- [ ] Looks like professional photography

**If image fails QA:**
- Re-run Stage 3 with Creativity at 5 (more conservative)
- Or start over from Stage 1 with that image

**Final delivery:**
- Keep originals in separate folder (never delete)
- Upload finals to Fanvue
- Resize for social media as needed

---

## WORKFLOW 2: AUDIO PRODUCTION

### STEP 1: Script Generation

**Tool:** ClickUp AI

**Process:**

1. Open ClickUp
2. In any doc/task, click AI button
3. Prompt ClickUp AI:

```
Write a 10-12 minute sensual guided masturbation audio script for [women/men/gender-neutral].

Style: Warm, intimate, empowering. Not crude or vulgar.

Structure:
- Opening (30 seconds): Welcome, set the mood, breathing
- Building (3-4 minutes): Sensory guidance, exploration, pacing
- Climax (4-5 minutes): Intensification, release, guided experience
- Wind-down (2-3 minutes): Aftercare, affirmation, closing

Include:
- Breathing cues
- Sensory details (touch, sound, imagination)
- Permission and consent language
- Empowering affirmations
- Natural pauses

Tone: Like a close friend guiding you, confident but caring.

No: harsh language, demands, pressure, shame, judgment.
```

4. Review output
5. Edit for Xiara's voice
6. Break into segments under 3,000 characters each (for Eleven Labs)

**Time:** 30-60 minutes

---

### STEP 2: Voice Generation (Eleven Labs)

**Setup:**
- Select your Xiara voice (already chosen)
- Settings:
  - Stability: 60-70%
  - Clarity: 70-80%
  - Style Exaggeration: 20-30%

**Process:**

1. Copy Segment 1 from script
2. Paste into Eleven Labs
3. Generate audio
4. Listen and verify:
   - Pronunciation correct?
   - Pacing feels right?
   - Emotional tone matches?
5. If good: Download as high-quality MP3
   - File name: `XM_Script1_Segment_01.mp3`
6. If needs adjustment: Fix punctuation/pacing, regenerate
7. Repeat for all segments (typically 5-7 per script)

**Time:** 30-60 minutes per complete script

---

### STEP 3: Audio Assembly

**Tool:** Audacity (free) or iMovie

**Process:**

1. Open audio editor
2. Import all segments in order
3. Add 0.5-1 second silence between segments
4. Listen to full audio for flow
5. Adjust levels if needed (normalize volume)
6. Export as single file:
   - Format: MP3
   - Quality: High (320kbps)
   - File name: `XM_Script1_Complete.mp3`

**Time:** 15-30 minutes

---

### STEP 4: Enhancement (UpSample)

**Process:**

1. Go to UpSample.com
2. Upload complete audio file
3. Settings:
   - Noise Reduction: Medium
   - Clarity Enhancement: High
   - Bass Boost: Light
   - Normalization: Yes
4. Process and download
5. File name: `XM_Script1_FINAL.mp3`

**Time:** 10-20 minutes

---

### STEP 5: Optional Polish (Enhancor)

**Only if needed** - most audio will be good after UpSample.

**Process:**
1. Upload UpSample-enhanced file
2. Apply final polish
3. Download master file

---

### STEP 6: Delivery

**Save to:** `/Desktop/xiara_audio/`

**Upload to Fanvue** as premium content

**Quality check:**
- [ ] Clear audio, no distortion
- [ ] Consistent volume throughout
- [ ] Natural pacing and pauses
- [ ] No robotic sound
- [ ] Smooth transitions between segments
- [ ] Professional quality

**Time for complete audio (script to final):** 2-3 hours

---

## WORKFLOW 3: VIDEO PRODUCTION

### OPTION A: Simple Slideshow (Fastest - For Launch)

**Tool:** CapCut or iMovie

**Process:**

1. Select 5 best final images
2. Import to video editor
3. Set each image to 2 seconds duration
4. Add fade transitions (0.5 seconds)
5. Add moody background music (royalty-free from CapCut library)
6. Add text overlay: "Xiara Moon" + tagline
7. Export as MP4 (1080p)

**Time:** 30-60 minutes

**Output:** 10-second reveal/teaser video

---

### OPTION B: Image-to-Video Animation (Future)

**Tools:** Higgsfield or Mago

**Process:**

1. Select hero image
2. Upload to Higgsfield
3. Add motion prompt:
   - "Subtle camera push-in, soft ambient motion, cinematic lighting"
4. Settings:
   - Duration: 4-5 seconds
   - Motion: Subtle
   - Quality: Highest
5. Generate video clip
6. Download

**Time:** 5-10 minutes per clip (plus processing)

**For longer videos:**
- Generate 5-10 clips
- Import to video editor
- Arrange, add transitions
- Add music/ambient sound
- Export final

**DO NOT ATTEMPT THIS FOR LAUNCH** - use Option A instead.

---

### OPTION C: Pole Dance Video (You already have this)

**Your solid system** - keep using it, don't change anything.

**For social media:**
- 15-30 second clips
- Vertical format (9:16) for Instagram Reels/TikTok
- Teaser style (partial reveals, movement highlights)
- Music that fits brand aesthetic

---

## WORKFLOW 4: SOCIAL MEDIA POSTING

### Platform: Instagram (Primary for now)

**Content Types:**

1. **Feed Posts** (Curated gallery shots)
   - Format: Square (1080x1080) or Portrait (1080x1350)
   - Your hyper-realistic final images
   - Cropped/blurred for free tier
   - Caption: Brand messaging, philosophy, CTA to Fanvue

2. **Reels** (Short videos)
   - Format: Vertical (1080x1920)
   - Duration: 15-30 seconds
   - Pole dance clips OR reveal video
   - Trending audio or original
   - Caption: Hook + CTA

3. **Stories** (Daily engagement)
   - Behind-the-scenes
   - Quotes/messaging
   - Polls/questions
   - Link to Fanvue (swipe-up)

**Posting Schedule (Post-Launch):**
- Feed: 3-4x per week
- Reels: 2-3x per week
- Stories: Daily

**For launch week:**
- 3 posts total before going live
- Then announce launch
- Then consistent schedule begins

---

## WORKFLOW 5: FANVUE SETUP & MANAGEMENT

### One-Time Setup:

1. **Account Creation**
   - Go to Fanvue.com
   - Sign up as creator
   - Complete verification
   - Set up payment/withdrawal

2. **Profile Setup**
   - Username: @xiaramoon (or similar)
   - Bio: (see 7-Day Launch Plan for bio copy)
   - Profile photo: Your best hero shot
   - Banner: Branded graphic
   - Link social media accounts

3. **Tier Configuration**
   - Free tier: Preview content (setup on social media)
   - Premium tier: $19.99/month
     - Access to: Full gallery + audio experiences
   - Superfan tier: (Phase 2 - not needed for launch)

4. **Content Upload**
   - Gallery: Upload 10 hyper-realistic images
   - Audio: Upload 1 complete guided experience
   - Organize into collections

5. **AI Automation Setup**
   - Go to Settings → AI Assistant
   - Enable automated messaging
   - Set personality guidelines:
     ```
     Voice: Warm, confident, intimate but professional
     Tone: Empowering, no judgment, consent-focused
     Style: Like a close friend, intelligent and caring
     Never: Crude, pushy, shame-based, impersonal
     ```
   - Configure auto-responses:
     - Welcome messages (new subscribers)
     - Thank you (tips/purchases)
     - Engagement replies (comments/messages)

---

### Ongoing Management:

**Daily (5-10 minutes):**
- Check AI automation is running
- Review any flagged messages needing manual response
- Post to Stories (if using Fanvue feed)

**Weekly (30-60 minutes):**
- Upload new content (images or audio)
- Review analytics
- Respond to special requests
- Plan next week's content

**Monthly (2-3 hours):**
- Analyze subscriber growth
- Review revenue
- Plan next month's content strategy
- Adjust pricing/tiers if needed

---

## PRODUCTION SCHEDULE TEMPLATE

### For Sustainable Content Creation:

**WEEK 1:**
- Day 1-2: Generate 50 images, select best 10
- Day 3-4: Face-swap and upscale all 10
- Day 5: QA and organize final images
- Day 6-7: Upload to Fanvue, schedule social posts

**WEEK 2:**
- Day 1-2: Generate audio script with ClickUp AI
- Day 3-4: Produce audio (voice generation + assembly)
- Day 5: Enhance and finalize audio
- Day 6-7: Upload to Fanvue, promote on social

**WEEK 3:**
- Day 1-3: Create video content (pole dance or slideshow)
- Day 4-5: Edit and finalize videos
- Day 6-7: Upload and promote

**WEEK 4:**
- Review analytics
- Plan next month
- Create any needed supplementary content
- Community engagement focus

**This gives you:**
- 10 new images per month
- 2 new audio experiences per month
- 2-3 new videos per month
- Sustainable, repeatable process

---

## TROUBLESHOOTING

### Problem: Face-swap results inconsistent
**Solution:**
- Stick with ONE face ID combo
- Test on a few images first before batch processing
- Document which combo you used for future consistency

### Problem: Upscaling fails or looks over-processed
**Solution:**
- Lower Global Creativity to 5 in Stage 3
- Check that you're pasting the hyper-realism prompt
- Ensure Enhance Faces is toggled ON

### Problem: Audio sounds robotic
**Solution:**
- Lower Stability in Eleven Labs to 50-60%
- Add more punctuation for natural pauses
- Try different voice if needed

### Problem: Running out of time
**Solution:**
- Focus on ONE content type per week
- Don't try to produce everything at once
- Quality over quantity - 10 great images > 50 mediocre ones

### Problem: Getting overwhelmed
**Solution:**
- Follow the 7-Day Launch Plan first
- Don't optimize until you're live
- Simple and launched > complex and stuck

---

## KEY PRINCIPLES

1. **Complete one step before moving to next**
   - Don't start upscaling before all images are face-swapped
   - Don't start new audio before previous one is done

2. **Manual > Automated (for now)**
   - Automation is what derailed you
   - Manual = control, visibility, reliability
   - Automate later when revenue is flowing

3. **Batch processing**
   - Do all face-swaps in one session
   - Process all upscaling stages together
   - Reduces context-switching and saves time

4. **Documentation**
   - Write down which face ID you used
   - Note any issues and how you solved them
   - Build your own knowledge base

5. **Launch beats perfect**
   - 10 good images > waiting for 100 perfect ones
   - 1 audio experience > planning 6 tiers
   - Live and iterating > stuck in preparation

---

## WHAT NOT TO DO

**DON'T:**
- ❌ Let Claude automate your workflow
- ❌ Try to test/optimize before launching
- ❌ Attempt complex cinematography tools
- ❌ Build elaborate systems
- ❌ Parallelize before mastering sequential
- ❌ Add new tools to your stack
- ❌ Pursue perfection over completion

**DO:**
- ✅ Follow this workflow exactly
- ✅ Complete one thing at a time
- ✅ Launch with minimum viable content
- ✅ Iterate based on what works
- ✅ Keep it simple
- ✅ Trust the process

---

## SUCCESS METRICS

**You know this workflow is working when:**

- ✅ You can produce 10 hyper-realistic images in one day
- ✅ You complete an audio experience in 2-3 hours
- ✅ You post consistently without getting stuck
- ✅ You launch and start generating revenue
- ✅ You don't need Claude's help to execute
- ✅ You can repeat the process reliably

**If you're stuck again:**
- Stop what you're doing
- Return to this document
- Follow the steps exactly
- Don't deviate or "enhance"
- Simple execution wins

---

## NEXT STEPS

See: `7_DAY_LAUNCH_PLAN.md` for your immediate action plan.

**Remember:** This workflow exists because the complex one failed. Trust simplicity.
