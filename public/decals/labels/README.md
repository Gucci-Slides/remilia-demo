# Cartridge Label Decals

Place PNG images here for each cartridge label.

## Required Files

One PNG per cartridge ID defined in `components/cartridge-system/types.ts`:

- `origin.png` - ORIGIN cartridge label
- `archive.png` - ARCHIVE cartridge label
- `registry.png` - REGISTRY cartridge label
- `lookbook.png` - LOOKBOOK cartridge label
- `terminal.png` - TERMINAL cartridge label
- `about.png` - ABOUT cartridge label

## Specifications

- **Format**: PNG with alpha transparency
- **Recommended size**: 512×256 px or 1024×512 px
- **Aspect ratio**: ~2:1 (landscape)
- **Color space**: sRGB
- **Background**: Transparent

## Styling Guidelines

Labels should have:
- Clear, readable text (title/serial)
- Y2K / PS1-era aesthetic
- High contrast for decal projection
- Optional: wear/scratch effects for authenticity

## Fallback

If a label texture fails to load, the cartridge will display without the label decal.
The system handles missing textures gracefully.
