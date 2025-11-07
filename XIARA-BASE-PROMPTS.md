# 🌙 XIARA MOON - BASE CHARACTER PROMPTS

## BASE DESCRIPTION (Foundation for ALL prompts)

```
Ultra-realistic photograph of Xiara Moon, a stunning 24-year-old with sun-kissed cheeks,
radiant skin, long brown wavy beach hair with hazel brown eyes, full lips, natural long lashes,
wearing precise-winged cat eyeliner. She is 5'4" with a toned and healthy build and curves
that emphasize her hourglass shape.
```

---

## VARIABLE DESCRIPTOR SYSTEM

**CRITICAL:** These words MUST be used but rotated for variety. Using the same descriptors repeatedly causes AI generators to lose consistency or focus incorrectly (e.g., over-emphasizing "black eyeliner").

### **REQUIRED DESCRIPTOR CATEGORIES:**

**BODY DESCRIPTORS** (Choose 1 per generation):
- tight
- toned
- athletic
- sculpted
- fit

**CURVE DESCRIPTORS** (Choose 1 per generation):
- curvy
- seductive
- striking
- sensual
- hourglass

**CHEST DESCRIPTORS** (Choose 1 per generation):
- busty
- medium-sized
- voluptuous
- well-proportioned

**STYLE/ENERGY DESCRIPTORS** (Choose 1 per generation):
- flirty
- suggestive
- sensual
- playful
- seductive

**COVERAGE DESCRIPTORS** (Use when applicable):
- minimal
- exposed
- revealing
- strategic

**HAIR STATE DESCRIPTORS** (Use when applicable):
- tousled
- flowing
- windswept
- cascading

**DÉCOLLETAGE DESCRIPTORS** (Use when applicable):
- cleavage
- décolletage
- neckline

---

## USAGE RULES:

1. **Start EVERY prompt** with base description
2. **Add 3-4 variable descriptors** from different categories
3. **Rotate descriptors** - never use same combination twice in a row
4. **Track usage** - system logs which descriptors were used
5. **Deduplication** - prevents redundant descriptor combinations

---

## EXAMPLE COMPLETE BASE PROMPTS:

### Version 1 (Standard):
```
Ultra-realistic photograph of Xiara Moon, a stunning 24-year-old with sun-kissed cheeks,
radiant skin, long brown wavy beach hair with hazel brown eyes, full lips, natural long lashes,
wearing precise-winged cat eyeliner. She is 5'4" with a toned and tight build and seductive
curves that emphasize her hourglass shape, busty with confident sensual energy.
```

### Version 2 (Subtle):
```
Ultra-realistic photograph of Xiara Moon, a stunning 24-year-old with sun-kissed cheeks,
radiant skin, long brown wavy tousled beach hair with hazel brown eyes, full lips, natural
long lashes, wearing precise-winged cat eyeliner. She is 5'4" with an athletic build and
striking curves that emphasize her hourglass shape, medium-sized with flirty playful presence.
```

### Version 3 (Suggestive):
```
Ultra-realistic photograph of Xiara Moon, a stunning 24-year-old with sun-kissed cheeks,
radiant skin, long brown windswept beach hair with hazel brown eyes, full lips, natural long
lashes, wearing precise-winged cat eyeliner. She is 5'4" with a sculpted build and curvy
sensual figure that emphasizes her hourglass shape, voluptuous with suggestive allure and
visible décolletage.
```

---

## GENERATOR LOGIC:

```python
def generate_base_prompt():
    base = "Ultra-realistic photograph of Xiara Moon, a stunning 24-year-old..."

    body = random.choice(['tight', 'toned', 'athletic', 'sculpted', 'fit'])
    curves = random.choice(['curvy', 'seductive', 'striking', 'sensual'])
    chest = random.choice(['busty', 'medium-sized', 'voluptuous'])
    style = random.choice(['flirty', 'suggestive', 'sensual', 'playful'])

    # Prevent same combination as last generation
    while (body, curves, chest, style) == last_combination:
        # Re-roll

    return f"{base} with {body} build and {curves} curves, {chest} with {style} energy"
```

---

## WHY THIS MATTERS:

- ✅ Prevents AI fixation on specific details
- ✅ Maintains character consistency across variations
- ✅ Allows flexibility for different content types
- ✅ Ensures variety without losing Xiara's identity
- ✅ Works across different AI image generators

---

**Built for Xiara Moon Content Empire** 🌙💙
**Never nude. Always suggestive. Forever consistent.** 🏛️
