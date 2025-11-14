# XIARA MOON IMAGE GENERATION SYSTEM
**Complete Production Bible - November 11, 2025**
**Status:** PRODUCTION READY
**Platform:** Leonardo AI
**Critical Discovery Session:** Documented in full

---

## 🔥 CRITICAL DISCOVERIES

### Discovery #1: Seed + Model = Consistency Lock
**What We Learned:**
- Seeds work ONLY within the same model on the same platform
- Same seed + different model = different person
- Same seed + same model = perfect consistency across unlimited variations

### Discovery #2: The Two-Model Problem
**The Challenge:**
- **Flux Kontext Max** = Perfect face quality, natural beauty ✅ BUT censors suggestive content ❌
- **Seedream 4.0** = Handles tease/suggestive content ✅ BUT different face interpretation ❌

**The Solution:**
- Use both models with their respective seeds
- Combine via Image Reference OR face-swap post-generation

### Discovery #3: Body Descriptors Must Come FIRST
**What We Learned:**
- AI prioritizes what comes first in prompt
- "Voluptuous woman wearing X" ≠ "Woman wearing X with voluptuous figure"
- Front-load ALL body type descriptors before clothing/pose/setting

---

## 🎯 THE MAGIC SEEDS

### SEED #1: Perfect Xiara Moon Face
- **Platform:** Leonardo AI
- **Model:** Flux Kontext Max
- **Seed:** `456479699`
- **Result:** Perfect facial consistency - hazel eyes, full lips, perfect bone structure
- **Use Case:** Lifestyle, casual, professional content
- **Limitation:** Censors suggestive/tease content

### SEED #2: Endless Tease Energy Body
- **Platform:** Leonardo AI
- **Model:** Seedream 4.0
- **Seed:** `1605471498`
- **Result:** Suggestive poses, tease energy, body emphasis without censorship
- **Use Case:** Premium content, tease photography, intimate shots
- **Limitation:** Different face than Seed #1

---

## 📝 THE MASTER PROMPT FORMULA

### BASE STRUCTURE (ALWAYS USE THIS ORDER):
1. **[BODY TYPE DESCRIPTORS - FIRST!]**
2. **[AGE]**
3. **[CLOTHING/FABRIC DESCRIPTION]**
4. **[POSE/POSITIONING]**
5. **[FACE DESCRIPTION - NEVER CHANGE]**
6. **[EXPRESSION/EMOTION]**
7. **[SETTING/BACKGROUND]**
8. **[LIGHTING]**
9. **[TECHNICAL QUALITY TAGS]**
10. **[MOOD/ENERGY]**

### LOCKED FACE DESCRIPTION (Copy Verbatim Every Time):
```
She is pictured with long, wavy, brown, touseled hair. She has [EXPRESSION TYPE] and her eyes are sparkling hazel brown with beautiful naturally long individual lashes and precisely short-winged black cat eyeliner, striking beauty, full lips, sharply detailed skin and hair for an ultra-real feel as she looks into the camera with [INTERACTION TYPE].
```

**Expression Type Options:**
- "a soft, approachable smile"
- "a sultry half-lidded gaze"
- "a strong sultry gaze"
- "a confident knowing expression"
- "a playful inviting smile"

**Interaction Type Options:**
- "inviting interaction"
- "inviting confident expression"
- "direct intimate eye contact"
- "knowing confident look"
- "playful engaging energy"

### BODY TYPE DESCRIPTORS (Front-Load These):

**For Curvy/Voluptuous Xiara Moon:**
```
A striking young brunette woman with pronounced hourglass figure, naturally full bust, athletic curves, toned yet voluptuous physique, elegantly thick thighs, full feminine form,
```

**For Athletic/Toned Xiara Moon:**
```
A striking young brunette woman with elegant athletic curves, toned fit physique, graceful proportions, naturally feminine build, defined yet soft figure,
```

**For Maximum Curves (Testing Limits):**
```
A captivating voluptuous young brunette woman with naturally full E-cup bust, exaggerated hourglass figure, thick athletic thighs, pronounced curves, full-figured feminine form,
```

### QUALITY TAGS (Always Include at End):
```
8K photography, natural warm skin tones, sharp skin, hair and surface detail, ultra-real feel, sharply detailed [environment], [photography style]
```

---

## 🎨 WORKING PROMPT EXAMPLES

### EXAMPLE 1: Lifestyle/Casual (Flux Kontext Max)
```
A friendly and attractive young brunette woman, about 24 years, wearing a fitted beige tank top, positioned from the waist up. She is pictured with long, wavy, brown, touseled hair. She has a soft, approachable smile and her eyes are sparkling hazel brown with beautiful naturally long individual lashes and precisely short-winged black cat eyeliner, striking beauty, full lips, sharply detailed skin and hair for an ultra-real feel as she looks into the camera with inviting interaction. The background is a softly blurred outdoor minimalist, subtle luxury rooftop scene, keeping the focus on her. Lifestyle photography, natural skin tones.
```
- **Model:** Flux Kontext Max
- **Seed:** 456479699

### EXAMPLE 2: Tease Energy - Level 1 (Seedream 4.0)
```
A striking young brunette woman with pronounced hourglass figure, naturally full bust, athletic curves, about 24 years, wearing paper-thin translucent white silk chemise, completely sheer with nothing beneath, fabric stretched tight across full chest showing compressed skin and natural form, thin straps falling off shoulders. Seated on edge of unmade white bed, legs crossed, leaning forward with arms pressed together enhancing cleavage. Long, wavy, brown, touseled hair falling forward. She has sultry half-lidded gaze and her eyes are sparkling hazel brown with beautiful naturally long individual lashes and precisely short-winged black cat eyeliner, striking beauty, full lips, sharply detailed skin and hair for an ultra-real feel as she looks into the camera with inviting confident expression. Soft morning light making fabric nearly transparent, her curvy silhouette visible through material. White on white palette. Intimate bedroom photography, 8K detail, natural warm skin tones. Bridal innocence meets raw sensuality.
```
- **Model:** Seedream 4.0
- **Seed:** 1605471498

### EXAMPLE 3: Tease Energy - Level 2 (Seedream 4.0)
```
A voluptuous young brunette woman with full natural bust, pronounced hourglass curves, elegantly thick thighs, athletic yet curvy build, about 24 years, in gossamer-thin nude mesh bodysuit with strategic lace placement, transparent fabric showing busty silhouette beneath, her full curves straining against barely-there coverage. Body pressed forward on velvet chaise, back arched emphasizing pronounced chest and rounded hips, one hand running through long wavy brown touseled hair. She has strong sultry gaze and her eyes are sparkling hazel brown with beautiful naturally long individual lashes and precisely short-winged black cat eyeliner, striking beauty, full lips slightly parted, sharply detailed skin and hair for an ultra-real feel as she looks into the camera with direct intimate eye contact. The mesh clings to voluptuous figure like second skin, every generous contour visible, compressed curves creating natural depth. Warm bronze skin with sharp detail. Low moody lighting creating shadows across full figure. Luxury bedroom, silk sheets. 8K photography, cinematic depth, natural warm skin tones. Sophisticated tease showcasing full-figured feminine form.
```
- **Model:** Seedream 4.0
- **Seed:** 1605471498

---

## 🔄 PRODUCTION WORKFLOWS

### WORKFLOW A: Dual-Model Approach (Recommended)

**Step 1: Generate lifestyle/casual content**
- **Use:** Flux Kontext Max + Seed 456479699
- **Result:** Perfect face, professional quality
- **Use for:** Instagram, LinkedIn, casual content

**Step 2: Generate tease/premium content**
- **Use:** Seedream 4.0 + Seed 1605471498
- **Result:** Suggestive energy, premium positioning
- **Use for:** Paid tiers, exclusive content

**Step 3: Face-swap if needed**
- Take Flux face (Step 1)
- Apply to Seedream body (Step 2)
- **Use:** InsightFaceSwap Discord bot
- **Result:** Perfect face + tease energy combined

### WORKFLOW B: Image Reference Method (Testing)

**Strategy 1: Seedream → Flux**
1. Generate tease content with Seedream 4.0 (Seed 1605471498)
2. Use that image as Content Reference in Flux Kontext Max
3. Lock Seed 456479699 in Flux
4. Set reference strength to HIGH (80-100%)
5. Generate
- **Result:** Flux face + Seedream body/energy

**Strategy 2: Flux → Seedream**
1. Generate face with Flux Kontext Max (Seed 456479699)
2. Use that image as Content Reference in Seedream 4.0
3. Lock Seed 1605471498 in Seedream
4. Set reference strength to HIGH
5. Generate
- **Result:** Same goal, reversed approach

**Status:** Still testing which direction works better

### WORKFLOW C: Seed Discovery Protocol

**When to Use:** Finding new perfect seeds for different scenarios

**Process:**
1. Pick target model (Flux or Seedream)
2. Write standard test prompt with locked face description
3. Test seed batches:
   - **Batch 1:** Near original seed (±100-200)
   - **Batch 2:** Popular seeds (1234567890, etc.)
   - **Batch 3:** Random quality seeds
4. Generate 4 images per seed
5. Evaluate for face consistency + body type + energy
6. Save winning seeds for specific use cases

---

## 💡 KEY INSIGHTS & RULES

### Rule #1: Never Change the Locked Elements

**LOCKED FOREVER:**
- Face description (exact wording)
- Hair description (long, wavy, brown, touseled)
- Eye details (hazel, lashes, eyeliner)
- Lip description (full lips)
- Skin quality tags (sharply detailed)

**CHANGE EVERY TIME:**
- Body type descriptors (adjust for desired shape)
- Clothing/fabric description
- Pose/positioning
- Setting/background
- Lighting mood
- Expression type
- Interaction energy

### Rule #2: Body Descriptors Always Come First

❌ **WRONG ORDER:**
```
A young brunette woman wearing sheer fabric with voluptuous curves...
```

✅ **CORRECT ORDER:**
```
A voluptuous young brunette woman with full curves wearing sheer fabric...
```

**The AI processes left-to-right. Body type MUST be established before clothing/pose.**

### Rule #3: Understand Model Strengths

**Flux Kontext Max Strengths:**
- Perfect facial consistency
- Natural beauty, approachable
- Professional quality
- Lifestyle photography aesthetic
- Clean, editorial look

**Flux Kontext Max Limitations:**
- Censors suggestive content
- Blocks "sheer," "revealing," tease language
- Conservative interpretation

**Seedream 4.0 Strengths:**
- Handles suggestive/tease content
- Understands "sheer," "transparent," "barely there"
- Premium/intimate positioning
- Sensual energy without censorship

**Seedream 4.0 Limitations:**
- Different face interpretation than Flux
- May require more specific body descriptors
- Can default to thin body type without emphasis

### Rule #4: Testing Content Boundaries

**Progressive Testing Protocol:**
1. Start with simple/safe prompt
2. Add one "tease" element at a time
3. Test generation
4. If it passes, add next element
5. If it blocks, remove last addition
6. The point just before blocking = your production boundary

**Tease Elements to Add Progressively:**
- "fitted" → "tight" → "clinging"
- "thin fabric" → "sheer" → "transparent" → "nearly invisible"
- "showing curves" → "revealing form" → "barely concealing"
- "leaning forward" → "back arched" → "pressed together"

**Your Boundary = Maximum energy without blocks = Your production sweet spot**

---

## 📊 CONTENT TIER SYSTEM

### TIER 1: Public/Instagram (Flux Kontext Max - Seed 456479699)

**Content Type:**
- Lifestyle shots
- Casual fashion
- Professional headshots
- Rooftop/outdoor scenes
- Approachable, friendly energy

**Clothing:**
- Tank tops, fitted dresses
- Jeans + blazers
- Workout wear
- Business casual

**Mood:**
- Confident, friendly
- Approachable smiles
- Direct eye contact
- "Girl next door" elevated

### TIER 2: Premium Followers (Seedream 4.0 - Seed 1605471498)

**Content Type:**
- Intimate bedroom scenes
- Luxury hotel settings
- Elegant lingerie
- Subtle tease energy

**Clothing:**
- Silk robes
- Lace lingerie
- Sheer fabrics (technical coverage)
- Designer intimates

**Mood:**
- Sultry but sophisticated
- "Just woke up" intimate
- Candlelit elegance
- Romantic invitation

### TIER 3: VIP/Paid Subscribers (Seedream 4.0 - Seed 1605471498 + Face Swap)

**Content Type:**
- Maximum tease energy
- "Almost revealing" aesthetics
- Provocative poses
- Endless anticipation

**Clothing:**
- Whisper-thin silk
- Nearly transparent mesh
- "Barely there" coverage
- Strategic fabric positioning

**Mood:**
- Raw sensuality
- "About to reveal" tension
- Confident seduction
- Pleasure architect energy

---

## 🎬 BATCH PRODUCTION STRATEGY

### Weekly Content Calendar

**Monday: Lifestyle Batch (50 images)**
- Model: Flux Kontext Max
- Seed: 456479699
- Variations: Different outfits, settings, times of day
- Output: Instagram grid, Stories, Reels b-roll

**Tuesday: Casual Intimate (30 images)**
- Model: Seedream 4.0
- Seed: 1605471498
- Variations: Bedroom morning scenes, getting ready
- Output: Premium feed teasers

**Wednesday: Face Swap Day**
- Take best Flux faces from Monday
- Apply to best Seedream bodies from Tuesday
- Tool: InsightFaceSwap Discord bot
- Output: Perfect consistency + premium energy

**Thursday: VIP Content (20 images)**
- Model: Seedream 4.0
- Seed: 1605471498
- Maximum tease energy prompts
- Output: Paid tier exclusive content

**Friday: Test & Iterate**
- Try new seeds
- Test prompt variations
- Push content boundaries
- Archive winning formulas

---

## 🔧 TECHNICAL SETTINGS

### Leonardo AI Settings - Flux Kontext Max
- **Model:** Flux Kontext Max
- **Seed:** 456479699 (LOCKED - Input in Advanced Settings)
- **Resolution:** 1024x1024 (or 1024x1808 for vertical)
- **Guidance Scale:** 7-8
- **Steps:** 30-40
- **Scheduler:** Default
- **PhotoReal:** OFF (not available for Flux)
- **Alchemy:** ON (if available)
- **Prompt Magic:** OFF

### Leonardo AI Settings - Seedream 4.0
- **Model:** Seedream 4.0
- **Seed:** 1605471498 (LOCKED - Input in Advanced Settings)
- **Resolution:** 1024x1024 (or 1024x1808 for vertical)
- **Guidance Scale:** 7-8
- **Steps:** 30-40
- **Scheduler:** Default
- **Quality:** High/Ultra

---

## 📝 PROMPT BUILDER TEMPLATE

### Copy-Paste Template for Quick Generation:

```
[BODY TYPE: Choose one]
- A striking young brunette woman with elegant athletic curves, toned fit physique
- A striking young brunette woman with pronounced hourglass figure, naturally full bust, athletic curves
- A voluptuous young brunette woman with full natural bust, dramatic hourglass curves, thick thighs

[AGE]
, about 24 years,

[CLOTHING/FABRIC]
wearing [describe outfit/fabric in detail],

[POSE/POSITIONING]
[describe pose - sitting/standing/kneeling/reclining + specific body positioning],

[LOCKED FACE DESCRIPTION - NEVER CHANGE]
She is pictured with long, wavy, brown, touseled hair. She has [a soft smile / sultry gaze / knowing expression] and her eyes are sparkling hazel brown with beautiful naturally long individual lashes and precisely short-winged black cat eyeliner, striking beauty, full lips, sharply detailed skin and hair for an ultra-real feel as she looks into the camera with [inviting interaction / confident expression / direct intimate gaze].

[SETTING/LIGHTING]
The background is [describe setting + lighting mood].

[QUALITY TAGS]
8K photography, natural warm skin tones, sharp skin, hair and surface detail, [photography style], [mood/energy descriptor].
```

**Model:** [Flux Kontext Max OR Seedream 4.0]
**Seed:** [456479699 OR 1605471498]

---

## ⚠️ COMMON MISTAKES TO AVOID

### Mistake #1: Changing the Face Description
- **DON'T:** Modify hair color, eye details, makeup style, face shape
- **DO:** Copy the locked face description verbatim every time

### Mistake #2: Body Descriptors at End of Prompt
- **DON'T:** "Woman wearing X with curves"
- **DO:** "Curvy woman wearing X"

### Mistake #3: Switching Seeds Within Same Model
- **DON'T:** Try different seeds randomly
- **DO:** Lock seed, only change prompt variables

### Mistake #4: Over-Describing Technical Details
- **DON'T:** "Canon 5D Mark IV, 85mm f/1.4, ISO 400, 1/200 shutter"
- **DO:** "8K photography, 85mm lens, shallow depth of field"

### Mistake #5: Using Same Prompt Across Different Models
- **DON'T:** Copy exact prompt from Flux to Seedream
- **DO:** Adjust language for each model's strengths (conservative vs. permissive)

---

## 🚀 NEXT STEPS & OPTIMIZATION

### Phase 1: Lock Down Production (Complete ✅)
- ✅ Identify working seeds
- ✅ Create prompt formulas
- ✅ Test content boundaries
- ✅ Establish workflows

### Phase 2: Scale Content Library (In Progress)
- ⏳ Generate 100 Tier 1 images (Flux)
- ⏳ Generate 50 Tier 2 images (Seedream)
- ⏳ Generate 30 Tier 3 images (Seedream Max)
- ⏳ Face-swap Tier 2 & 3 with Flux faces
- ⏳ Organize into content calendar

### Phase 3: Automation & Systems
- ⏳ Create prompt database in ClickUp
- ⏳ Set up batch generation workflow
- ⏳ Automate face-swap pipeline
- ⏳ Build content scheduling system
- ⏳ Track which images perform best

### Phase 4: Advanced Optimization
- ⏳ Find additional specialty seeds (different moods/settings)
- ⏳ Test new models as Leonardo releases them
- ⏳ Create custom LoRA if Leonardo enables it
- ⏳ Develop prompt variations for seasonal content
- ⏳ Build A/B testing system for content performance

---

## 📚 TROUBLESHOOTING GUIDE

### Problem: Face Not Consistent
**Solution:**
- Verify seed is locked in Advanced Settings
- Check that model matches intended seed (Flux vs Seedream)
- Ensure face description is copied verbatim
- Clear cache and regenerate

### Problem: Body Type Wrong (Too Skinny)
**Solution:**
- Move body descriptors to FRONT of prompt
- Add more specific terms: "full bust," "thick thighs," "pronounced curves"
- Increase emphasis with repetition
- Try: "voluptuous...with full curves...busty figure..."

### Problem: Content Getting Censored/Blocked
**Solution:**
- Switch from Flux Kontext Max to Seedream 4.0
- Dial back tease language by one level
- Use "sheer" instead of "transparent"
- Use "barely concealing" instead of "revealing"
- Test progressive additions one at a time

### Problem: Seed Not Working
**Solution:**
- Seeds are model-specific - verify correct model
- Seeds are platform-specific - only works on Leonardo
- Try nearby seed numbers (+/- 100)
- Generate 4 images to see consistency

### Problem: Image Quality Low
**Solution:**
- Check resolution settings (1024x1024 minimum)
- Enable Alchemy if available
- Increase step count to 40
- Add quality tags: "8K, ultra-real, sharp detail"

---

## 🎯 SUCCESS METRICS

### What Defines a "Perfect" Xiara Moon Image:

**Face Consistency ✅**
- Hazel brown eyes identical
- Cat eyeliner placement consistent
- Full lips same shape/size
- Bone structure matches
- Hair texture/color consistent

**Body Consistency ✅**
- Proportions match target (athletic-curvy OR voluptuous)
- Posture feels natural
- Skin texture realistic
- No anatomical errors

**Energy/Mood ✅**
- Matches intended tier (lifestyle vs tease)
- Expression appropriate to scenario
- Pose conveys right energy
- Viewer feels desired emotional response

**Technical Quality ✅**
- Sharp focus on face/body
- Proper lighting (no blown highlights)
- Natural skin tones
- No AI artifacts or glitches
- Professional composition

---

## 🏁 FINAL NOTES

This system represents the culmination of extensive testing to achieve perfect consistency for the Xiara Moon AI influencer brand. The two-seed approach (Flux + Seedream) allows for both professional quality and premium tease energy while maintaining facial consistency through post-generation face-swapping.

**The workflow is production-ready.**

**Key success factors:**
1. Never deviate from locked face description
2. Always front-load body type descriptors
3. Match model to content tier (Flux = casual, Seedream = tease)
4. Test boundaries progressively
5. Use face-swap for ultimate consistency

**Next action:** Generate content library and begin audience testing to refine which formulas drive the most engagement and revenue.

---

**Document Version:** 1.0
**Last Updated:** November 11, 2025
**Status:** Production Ready
**Location:** `/home/user/xm-automate-code-integrate/XIARA_MOON_COMPLETE_GENERATION_SYSTEM.md`

This document is the complete production bible for Xiara Moon branded content generation. Treat the locked elements as sacred, vary the flexible elements creatively, and scale production with confidence.
