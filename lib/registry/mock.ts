// ═══════════════════════════════════════════════════════════════
// MILADY REGISTRY — MOCK DATA
// ═══════════════════════════════════════════════════════════════

import { MiladySubject, MiladyTheme, DripGrade } from './types';

function computeGrade(score: number): DripGrade {
  if (score >= 95) return 'S+';
  if (score >= 80) return 'A';
  if (score >= 65) return 'B';
  if (score >= 50) return 'C';
  return 'D';
}

function createSubject(
  id: string,
  hatTheme: MiladyTheme | undefined,
  shirtTheme: MiladyTheme | undefined,
  dripScore: number,
  traits: Record<string, string>
): MiladySubject {
  const themes: MiladyTheme[] = [];
  if (hatTheme) themes.push(hatTheme);
  if (shirtTheme && shirtTheme !== hatTheme) themes.push(shirtTheme);

  return {
    id,
    imageUrl: '', // Will use placeholder or real OpenSea data
    name: `Milady #${id}`,
    dripScore,
    dripGrade: computeGrade(dripScore),
    themes,
    hatTheme,
    shirtTheme,
    matchBonus: hatTheme !== undefined && hatTheme === shirtTheme,
    traits,
  };
}

export const MOCK_SUBJECTS: MiladySubject[] = [
  createSubject('9988', 'GYARU', 'GYARU', 92, {
    Hat: 'Gyaru Bow',
    Shirt: 'Gyaru Blouse',
    Eyes: 'Circle Lens',
    Hair: 'Blonde Extensions',
    Background: 'Pink',
  }),
  createSubject('4521', 'PREP', 'PREP', 87, {
    Hat: 'Boat Hat',
    Shirt: 'Polo',
    Eyes: 'Clear',
    Hair: 'Side Part',
    Background: 'Navy',
  }),
  createSubject('7734', 'LOLITA', 'HARAJUKU', 78, {
    Hat: 'Lace Bonnet',
    Shirt: 'Harajuku Tee',
    Eyes: 'Doll',
    Hair: 'Twintails',
    Background: 'Cream',
  }),
  createSubject('1156', 'HYPEBEAST', 'HYPEBEAST', 95, {
    Hat: 'Supreme Beanie',
    Shirt: 'Bape Hoodie',
    Eyes: 'Tired',
    Hair: 'Buzz Cut',
    Background: 'Black',
  }),
  createSubject('8823', 'GOTH', 'GOTH', 88, {
    Hat: 'Witch Hat',
    Shirt: 'Lace Corset',
    Eyes: 'Dark',
    Hair: 'Black Long',
    Background: 'Purple',
  }),
  createSubject('3342', 'HARAJUKU', 'GYARU', 71, {
    Hat: 'Decora Clips',
    Shirt: 'Gyaru Crop',
    Eyes: 'Star',
    Hair: 'Rainbow',
    Background: 'White',
  }),
  createSubject('5567', 'PREP', 'LOLITA', 64, {
    Hat: 'Tennis Visor',
    Shirt: 'Frilly Blouse',
    Eyes: 'Innocent',
    Hair: 'Bob',
    Background: 'Beige',
  }),
  createSubject('2219', 'GYARU', 'HYPEBEAST', 82, {
    Hat: 'Gyaru Cap',
    Shirt: 'Off-White Tee',
    Eyes: 'Glamour',
    Hair: 'Blonde Waves',
    Background: 'Yellow',
  }),
  createSubject('6678', 'LOLITA', 'LOLITA', 91, {
    Hat: 'Bonnet',
    Shirt: 'OP Dress',
    Eyes: 'Porcelain',
    Hair: 'Ringlets',
    Background: 'Rose',
  }),
  createSubject('9901', 'HARAJUKU', 'HARAJUKU', 85, {
    Hat: 'Fairy Kei Hat',
    Shirt: 'Neon Bomber',
    Eyes: 'Kawaii',
    Hair: 'Pastel',
    Background: 'Mint',
  }),
  createSubject('1234', 'GOTH', 'PREP', 58, {
    Hat: 'Black Beret',
    Shirt: 'White Oxford',
    Eyes: 'Brooding',
    Hair: 'Black Bob',
    Background: 'Gray',
  }),
  createSubject('7788', 'HYPEBEAST', 'GOTH', 74, {
    Hat: 'Yeezy Cap',
    Shirt: 'Black Mesh',
    Eyes: 'Tired',
    Hair: 'Fade',
    Background: 'Charcoal',
  }),
  createSubject('4455', 'PREP', 'GYARU', 67, {
    Hat: 'Polo Cap',
    Shirt: 'Gyaru Tank',
    Eyes: 'Bright',
    Hair: 'Straight',
    Background: 'Tan',
  }),
  createSubject('3321', 'LOLITA', 'GOTH', 79, {
    Hat: 'Mini Hat',
    Shirt: 'Gothic Blouse',
    Eyes: 'Doll',
    Hair: 'Black Curls',
    Background: 'Burgundy',
  }),
  createSubject('8899', 'GYARU', 'PREP', 72, {
    Hat: 'Hibiscus Clip',
    Shirt: 'Cardigan',
    Eyes: 'Big',
    Hair: 'Tan Blonde',
    Background: 'Coral',
  }),
  createSubject('5544', 'HARAJUKU', 'LOLITA', 83, {
    Hat: 'Spank Hat',
    Shirt: 'Lolita Cutsew',
    Eyes: 'Sparkle',
    Hair: 'Mint',
    Background: 'Lavender',
  }),
  createSubject('2233', 'GOTH', 'HYPEBEAST', 69, {
    Hat: 'Leather Cap',
    Shirt: 'Supreme Tee',
    Eyes: 'Smoky',
    Hair: 'Undercut',
    Background: 'Dark Gray',
  }),
  createSubject('6655', 'HYPEBEAST', 'HARAJUKU', 76, {
    Hat: 'Palace Cap',
    Shirt: 'Decora Layer',
    Eyes: 'Hype',
    Hair: 'Bleached',
    Background: 'Neon',
  }),
  createSubject('1100', 'PREP', 'PREP', 89, {
    Hat: 'Golf Visor',
    Shirt: 'Button Down',
    Eyes: 'Clear',
    Hair: 'Neat',
    Background: 'White',
  }),
  createSubject('9999', 'GYARU', 'GYARU', 97, {
    Hat: 'Ganguro Visor',
    Shirt: 'Ganguro Top',
    Eyes: 'White Liner',
    Hair: 'Platinum',
    Background: 'Orange',
  }),
];
