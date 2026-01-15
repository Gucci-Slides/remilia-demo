// ═══════════════════════════════════════════════════════════════
// MOCK MILADY DATASET — 20 Records for Ritual Scroll
// ═══════════════════════════════════════════════════════════════

export type MiladyTheme = 
  | 'GYARU' 
  | 'PREP' 
  | 'LOLITA' 
  | 'HYPEBEAST' 
  | 'HARAJUKU' 
  | 'GOTH'
  | 'UNKNOWN';

export type DripGrade = 'S+' | 'A' | 'B' | 'C' | 'D';

export interface MiladyRecord {
  id: string;
  imageUrl: string;
  name: string;
  hatTheme: MiladyTheme;
  shirtTheme: MiladyTheme;
  dripScore: number;
  dripGrade: DripGrade;
  matchBonus: boolean;
  traits: { key: string; value: string }[];
  registryDate: string;
}

function computeDripGrade(score: number): DripGrade {
  if (score >= 95) return 'S+';
  if (score >= 80) return 'A';
  if (score >= 65) return 'B';
  if (score >= 50) return 'C';
  return 'D';
}

function createRecord(
  id: string,
  hatTheme: MiladyTheme,
  shirtTheme: MiladyTheme,
  dripScore: number,
  traits: { key: string; value: string }[]
): MiladyRecord {
  return {
    id,
    imageUrl: `https://i.seadn.io/s/raw/files/milady-placeholder-${id}.png`, // Placeholder
    name: `Milady #${id}`,
    hatTheme,
    shirtTheme,
    dripScore,
    dripGrade: computeDripGrade(dripScore),
    matchBonus: hatTheme === shirtTheme && hatTheme !== 'UNKNOWN',
    traits,
    registryDate: '2024-XX-XX',
  };
}

export const MOCK_MILADIES: MiladyRecord[] = [
  createRecord('9988', 'GYARU', 'GYARU', 92, [
    { key: 'Hat', value: 'Gyaru Bow' },
    { key: 'Shirt', value: 'Gyaru Blouse' },
    { key: 'Eyes', value: 'Circle Lens' },
    { key: 'Hair', value: 'Blonde Extensions' },
  ]),
  createRecord('4521', 'PREP', 'PREP', 87, [
    { key: 'Hat', value: 'Boat Hat' },
    { key: 'Shirt', value: 'Polo' },
    { key: 'Eyes', value: 'Clear' },
    { key: 'Hair', value: 'Side Part' },
  ]),
  createRecord('7734', 'LOLITA', 'HARAJUKU', 78, [
    { key: 'Hat', value: 'Lace Bonnet' },
    { key: 'Shirt', value: 'Harajuku Tee' },
    { key: 'Eyes', value: 'Doll' },
    { key: 'Hair', value: 'Twintails' },
  ]),
  createRecord('1156', 'HYPEBEAST', 'HYPEBEAST', 95, [
    { key: 'Hat', value: 'Supreme Beanie' },
    { key: 'Shirt', value: 'Bape Hoodie' },
    { key: 'Eyes', value: 'Tired' },
    { key: 'Hair', value: 'Buzz Cut' },
  ]),
  createRecord('8823', 'GOTH', 'GOTH', 88, [
    { key: 'Hat', value: 'Witch Hat' },
    { key: 'Shirt', value: 'Lace Corset' },
    { key: 'Eyes', value: 'Dark' },
    { key: 'Hair', value: 'Black Long' },
  ]),
  createRecord('3342', 'HARAJUKU', 'GYARU', 71, [
    { key: 'Hat', value: 'Decora Clips' },
    { key: 'Shirt', value: 'Gyaru Crop' },
    { key: 'Eyes', value: 'Star' },
    { key: 'Hair', value: 'Rainbow' },
  ]),
  createRecord('5567', 'PREP', 'LOLITA', 64, [
    { key: 'Hat', value: 'Tennis Visor' },
    { key: 'Shirt', value: 'Frilly Blouse' },
    { key: 'Eyes', value: 'Innocent' },
    { key: 'Hair', value: 'Bob' },
  ]),
  createRecord('2219', 'GYARU', 'HYPEBEAST', 82, [
    { key: 'Hat', value: 'Gyaru Cap' },
    { key: 'Shirt', value: 'Off-White Tee' },
    { key: 'Eyes', value: 'Glamour' },
    { key: 'Hair', value: 'Blonde Waves' },
  ]),
  createRecord('6678', 'LOLITA', 'LOLITA', 91, [
    { key: 'Hat', value: 'Bonnet' },
    { key: 'Shirt', value: 'OP Dress' },
    { key: 'Eyes', value: 'Porcelain' },
    { key: 'Hair', value: 'Ringlets' },
  ]),
  createRecord('9901', 'HARAJUKU', 'HARAJUKU', 85, [
    { key: 'Hat', value: 'Fairy Kei Hat' },
    { key: 'Shirt', value: 'Neon Bomber' },
    { key: 'Eyes', value: 'Kawaii' },
    { key: 'Hair', value: 'Pastel' },
  ]),
  createRecord('1234', 'GOTH', 'PREP', 58, [
    { key: 'Hat', value: 'Black Beret' },
    { key: 'Shirt', value: 'White Oxford' },
    { key: 'Eyes', value: 'Brooding' },
    { key: 'Hair', value: 'Black Bob' },
  ]),
  createRecord('7788', 'HYPEBEAST', 'GOTH', 74, [
    { key: 'Hat', value: 'Yeezy Cap' },
    { key: 'Shirt', value: 'Black Mesh' },
    { key: 'Eyes', value: 'Tired' },
    { key: 'Hair', value: 'Fade' },
  ]),
  createRecord('4455', 'PREP', 'GYARU', 67, [
    { key: 'Hat', value: 'Polo Cap' },
    { key: 'Shirt', value: 'Gyaru Tank' },
    { key: 'Eyes', value: 'Bright' },
    { key: 'Hair', value: 'Straight' },
  ]),
  createRecord('3321', 'LOLITA', 'GOTH', 79, [
    { key: 'Hat', value: 'Mini Hat' },
    { key: 'Shirt', value: 'Gothic Blouse' },
    { key: 'Eyes', value: 'Doll' },
    { key: 'Hair', value: 'Black Curls' },
  ]),
  createRecord('8899', 'GYARU', 'PREP', 72, [
    { key: 'Hat', value: 'Hibiscus Clip' },
    { key: 'Shirt', value: 'Cardigan' },
    { key: 'Eyes', value: 'Big' },
    { key: 'Hair', value: 'Tan Blonde' },
  ]),
  createRecord('5544', 'HARAJUKU', 'LOLITA', 83, [
    { key: 'Hat', value: 'Spank Hat' },
    { key: 'Shirt', value: 'Lolita Cutsew' },
    { key: 'Eyes', value: 'Sparkle' },
    { key: 'Hair', value: 'Mint' },
  ]),
  createRecord('2233', 'GOTH', 'HYPEBEAST', 69, [
    { key: 'Hat', value: 'Leather Cap' },
    { key: 'Shirt', value: 'Supreme Tee' },
    { key: 'Eyes', value: 'Smoky' },
    { key: 'Hair', value: 'Undercut' },
  ]),
  createRecord('6655', 'HYPEBEAST', 'HARAJUKU', 76, [
    { key: 'Hat', value: 'Palace Cap' },
    { key: 'Shirt', value: 'Decora Layer' },
    { key: 'Eyes', value: 'Hype' },
    { key: 'Hair', value: 'Bleached' },
  ]),
  createRecord('1100', 'PREP', 'PREP', 89, [
    { key: 'Hat', value: 'Golf Visor' },
    { key: 'Shirt', value: 'Button Down' },
    { key: 'Eyes', value: 'Clear' },
    { key: 'Hair', value: 'Neat' },
  ]),
  createRecord('9999', 'GYARU', 'GYARU', 97, [
    { key: 'Hat', value: 'Ganguro Visor' },
    { key: 'Shirt', value: 'Ganguro Top' },
    { key: 'Eyes', value: 'White Liner' },
    { key: 'Hair', value: 'Platinum' },
  ]),
];

export function getMiladyById(id: string): MiladyRecord | undefined {
  return MOCK_MILADIES.find(m => m.id === id);
}
