// Utility to resolve mecha frame artwork from src/assets/imagen and public/frames
const customImages = import.meta.glob('@/assets/imagen/*', { eager: true, import: 'default' });

const frameImageMap = {
  'sagarmatha': '1024px-Sagarmatha.webp',
  'atlas': '800px-TransparentAtlas.webp',
  'caliban': '800px-TransparentCaliban.webp',
  'sunzi': '800px-TransparentSunzi.png',
  'swallowtail': '800px-TransparentSwallowtail.webp',
  'calendula': 'TransparentCalendula.webp',
  'emperor': 'TransparentEmperor.webp',
  'enkidu': 'TransparentEnkidu.webp',
  'genghis': 'TransparentGenghisWorldkiller.webp',
  'kidd': 'TransparentKidd.webp',
  'kobold': 'TransparentKobold.webp',
  'lich': 'TransparentLich.webp',
  'orchis': 'TransparentOrchis.webp',
  'white_witch': 'TransparentWhiteWitch.webp',
  'white witch': 'TransparentWhiteWitch.webp',
  'whitewitch': 'TransparentWhiteWitch.webp',
  'zheng': 'TransparentZheng.webp'
};

export function getFrameImage(frame) {
  if (!frame) return 'https://raw.githubusercontent.com/massif-press/lancer-data/master/lib/assets/icons/mech.png';
  if (frame.image_url) return frame.image_url;
  if (frame.image) return frame.image;

  const id = (frame.id || '').toLowerCase();
  const name = (frame.name || '').toLowerCase();

  // Search in custom imagen map
  for (const [key, fileName] of Object.entries(frameImageMap)) {
    if (id.includes(key) || name.includes(key)) {
      for (const path in customImages) {
        if (path.includes(fileName)) {
          return customImages[path];
        }
      }
    }
  }

  // Fallback to public/frames/
  if (frame.id) {
    return `/frames/${frame.id}.png`;
  }

  return 'https://raw.githubusercontent.com/massif-press/lancer-data/master/lib/assets/icons/mech.png';
}

export default getFrameImage;
