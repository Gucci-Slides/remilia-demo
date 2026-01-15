# Remilia Typography System — Font Files

This directory should contain the following font files for the Remilia landing page typography system.

## Required Fonts

### ITC Benguiat (Monument)
Used for: Oversized REMILIA wordmark, monumental single-word statements

Files needed:
- `ITCBenguiat-Book.woff2` (weight 400)
- `ITCBenguiat-Bold.woff2` (weight 700)

### Canela (Editorial)
Used for: Section titles, narrative scroll text, philosophical lines

Files needed:
- `Canela-Light.woff2` (weight 300)
- `Canela-Regular.woff2` (weight 400)
- `Canela-Medium.woff2` (weight 500)

## Licensing

Both ITC Benguiat and Canela are proprietary typefaces that require licensing:

- **ITC Benguiat**: Available from [ITC/Monotype](https://www.fonts.com/font/itc/itc-benguiat)
- **Canela**: Available from [Commercial Type](https://commercialtype.com/catalog/canela)

## Fallbacks

If font files are not present, the system will fallback to:
- Monument: Georgia → Times New Roman → serif
- Editorial: Georgia → Times New Roman → serif
- Meta: Inter (loaded via Google Fonts) → system-ui → sans-serif

## Note on Font Formats

WOFF2 is preferred for best compression and browser support. If you only have OTF/TTF files, convert them using a tool like [Transfonter](https://transfonter.org/) or [Font Squirrel Generator](https://www.fontsquirrel.com/tools/webfont-generator).
