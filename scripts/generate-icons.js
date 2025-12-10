const fs = require('fs');
const path = require('path');

const sizes = {
  android: [
    { size: 36, name: 'drawable-ldpi' },
    { size: 48, name: 'drawable-mdpi' },
    { size: 72, name: 'drawable-hdpi' },
    { size: 96, name: 'drawable-xhdpi' },
    { size: 144, name: 'drawable-xxhdpi' },
    { size: 192, name: 'drawable-xxxhdpi' },
  ],
  ios: [
    { size: 20, scale: [2, 3], idiom: 'iphone' },
    { size: 29, scale: [2, 3], idiom: 'iphone' },
    { size: 40, scale: [2, 3], idiom: 'iphone' },
    { size: 60, scale: [2, 3], idiom: 'iphone' },
    { size: 20, scale: [1, 2], idiom: 'ipad' },
    { size: 29, scale: [1, 2], idiom: 'ipad' },
    { size: 40, scale: [1, 2], idiom: 'ipad' },
    { size: 76, scale: [1, 2], idiom: 'ipad' },
    { size: 83.5, scale: [2], idiom: 'ipad' },
    { size: 1024, scale: [1], idiom: 'ios-marketing' },
  ],
};

console.log('✨ Mentes.ia Icon Generator');
console.log('');
console.log('📱 This script generates app icons for Android and iOS');
console.log('');
console.log('📋 Usage:');
console.log('  npm install sharp');
console.log('  node scripts/generate-icons.js path/to/source-icon.png');
console.log('');
console.log('⚠️  Requirements:');
console.log('  - Source icon: 1024x1024px minimum');
console.log('  - Format: PNG with transparent background');
console.log('  - Background color: #0A0F2D (dark theme)');
console.log('');
console.log('📦 Generated icons will be placed in:');
console.log('  - android/app/src/main/res/');
console.log('  - ios/App/App/Assets.xcassets/AppIcon.appiconset/');
