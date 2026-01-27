# Holographic Sticker Decals

Place PNG images here for holographic stickers applied to cartridges.

## Required Files

- `holo.png` - Main holographic sticker texture (optional)

## Optional Files

- `holo-normal.png` - Normal map for enhanced shimmer (optional)

## Specifications

- **Format**: PNG with alpha transparency
- **Recommended size**: 256×256 px or 512×512 px
- **Aspect ratio**: 1:1 (square) recommended
- **Color space**: sRGB
- **Background**: Transparent

## Styling Guidelines

Holographic stickers should have:
- Clean cutout shape (circle, rounded square, etc.)
- Subtle internal pattern (stars, grid, waves)
- Works well with iridescent material overlay

## Material Properties

The holographic material applied to these decals includes:
- Iridescence (rainbow shimmer)
- Clearcoat (glossy surface)
- Metalness (subtle reflectivity)
- Animated shimmer effect

## Fallback

If the holo texture fails to load, the sticker will render as a solid
color using the cartridge's `holoTint` value with full iridescence.
