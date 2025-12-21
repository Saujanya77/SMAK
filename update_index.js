const fs = require('fs');
const path = require('path');

const filePath = 'src/pages/Index.tsx';
let content = fs.readFileSync(filePath, 'utf-8');

// Replace logo
content = content.replace(
  /src="https:\/\/i\.postimg\.cc\/LXmZbsWJ\/Logo\.jpg"/,
  'src={homepageContent?.logo || "https://i.postimg.cc/LXmZbsWJ/Logo.jpg"}'
);

// Replace hero title - using a more flexible approach
const lines = content.split('\n');
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('Empowering Tomorrow') && lines[i].includes('Healers Through Knowledge today')) {
    lines[i] = '                {homepageContent?.heroTitle || "Empowering Tomorrow\'s Healers Through Knowledge today"}';
  }
  if (lines[i].includes('Welcome to') && lines[i].includes('The Society for Medical Academia')) {
    lines[i] = '                {homepageContent?.heroSubtitle || "Welcome to"} <span className="font-semibold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">The Society for Medical Academia and Knowledge</span>';
  }
  if (lines[i].includes('A student-led nonprofit platform uniting future doctors')) {
    lines[i] = '                {homepageContent?.heroDescription || "A student-led nonprofit platform uniting future doctors through knowledge,  research, leadership andcollaboration"}';
  }
}

content = lines.join('\n');

fs.writeFileSync(filePath, content, 'utf-8');
console.log('Updated Index.tsx');
