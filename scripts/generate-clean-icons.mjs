import fs from 'fs';

const svgs = JSON.parse(fs.readFileSync('_ref/all-svgs.json', 'utf8'));

// Map of IDs to component names
const idMap = {
  'svg-1239319412_8642': 'AvatarFrameSvg',
  'svg961302541_1009': 'LinkedInSocialSvg',
  'svg433447929_950': 'DribbbleSocialSvg',
  'svg-1746898691_3292': 'InstagramSocialSvg',
  'svg1367543754_2103': 'ServiceUxUiSvg',
  'svg1977135445_3440': 'ServiceWebMobileSvg',
  'svg468792844_1983': 'ServiceDesignCreativeSvg',
  'svg-1481518347_2549': 'ServiceDevelopmentSvg',
  'svg279054864_349': 'EmailIconSvg',
  'svg-98638043_146': 'ServicesDividerLineSvg',
};

function cleanSvgForJsx(rawSvg, compName) {
  let cleaned = rawSvg
    .replace(/class=/g, 'className=')
    .replace(/stroke-width=/g, 'strokeWidth=')
    .replace(/stroke-linecap=/g, 'strokeLinecap=')
    .replace(/stroke-linejoin=/g, 'strokeLinejoin=')
    .replace(/stroke-miterlimit=/g, 'strokeMiterlimit=')
    .replace(/stroke-opacity=/g, 'strokeOpacity=')
    .replace(/fill-rule=/g, 'fillRule=')
    .replace(/clip-rule=/g, 'clipRule=')
    .replace(/clip-path=/g, 'clipPath=')
    .replace(/xmlns:xlink=/g, 'xmlnsXlink=')
    .replace(/xlink:href=/g, 'xlinkHref=')
    .replace(/stop-color=/g, 'stopColor=')
    .replace(/stop-opacity=/g, 'stopOpacity=')
    .replace(/fill-opacity=/g, 'fillOpacity=')
    .replace(/id="[^"]*"/, ''); // Remove the id from root svg

  // Allow passing className or props
  cleaned = cleaned.replace(/<svg /, '<svg {...props} ');

  return `export function ${compName}(props: React.SVGProps<SVGSVGElement>) {\n  return (\n    ${cleaned}\n  );\n}\n`;
}

let out = `import React from 'react';\n\n// Exact verbatim SVGs extracted from https://kawsar.design/\n\n`;

svgs.forEach((s, idx) => {
  const m = s.match(/id="([^"]+)"/);
  if (m && idMap[m[1]]) {
    const compName = idMap[m[1]];
    out += `// ${compName} (Original ID: ${m[1]})\n`;
    out += cleanSvgForJsx(s, compName) + '\n';
  }
});

// Also add Dribbble Latest Work SVG
out += `// Dribbble icon in Latest Work button
export function DribbbleLatestWorkSvg(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16.006" width="16" height="16" fill="rgb(255, 255, 255)">
      <path d="M 15.837 6.39 C 15.73 5.875 15.573 5.373 15.366 4.883 C 15.165 4.406 14.914 3.954 14.625 3.528 C 14.337 3.101 14.01 2.712 13.652 2.348 C 13.288 1.984 12.887 1.651 12.472 1.375 C 12.046 1.086 11.581 0.835 11.117 0.634 C 10.633 0.427 10.131 0.27 9.61 0.163 C 9.083 0.056 8.543 0 7.997 0 C 7.451 0 6.911 0.056 6.384 0.163 C 5.869 0.27 5.367 0.427 4.883 0.634 C 4.406 0.835 3.954 1.086 3.528 1.375 C 3.101 1.663 2.705 1.99 2.348 2.348 C 1.99 2.705 1.657 3.113 1.375 3.528 C 1.086 3.954 0.835 4.406 0.634 4.883 C 0.427 5.367 0.27 5.869 0.163 6.39 C 0.056 6.917 0 7.457 0 8.003 C 0 8.549 0.056 9.089 0.163 9.616 C 0.27 10.131 0.427 10.633 0.634 11.117 C 0.835 11.594 1.086 12.046 1.375 12.479 C 1.663 12.905 1.99 13.295 2.348 13.659 C 2.712 14.023 3.113 14.349 3.528 14.632 C 3.954 14.92 4.419 15.171 4.883 15.372 C 5.367 15.579 5.869 15.736 6.384 15.843 C 6.911 15.95 7.451 16.006 7.997 16.006 C 8.543 16.006 9.077 15.95 9.61 15.843 C 10.125 15.736 10.627 15.579 11.117 15.372 C 11.594 15.171 12.046 14.92 12.472 14.632 C 12.899 14.343 13.295 14.016 13.652 13.659 C 14.016 13.295 14.343 12.893 14.625 12.479 C 14.914 12.052 15.165 11.594 15.366 11.117 C 15.573 10.633 15.73 10.131 15.837 9.616 C 15.944 9.089 16 8.549 16 8.003 C 16 7.457 15.944 6.917 15.837 6.39 Z M 7.997 1.168 C 9.729 1.168 11.305 1.814 12.51 2.875 C 12.491 2.9 11.525 4.381 8.938 5.348 C 7.771 3.201 6.484 1.494 6.377 1.356 C 6.898 1.237 7.438 1.168 7.997 1.168 Z M 6.346 1.368 M 5.078 1.82 C 5.172 1.94 6.434 3.659 7.62 5.762 C 4.337 6.628 1.488 6.597 1.312 6.591 C 1.745 4.475 3.17 2.718 5.078 1.82 Z M 2.906 12.566 C 1.82 11.361 1.155 9.761 1.155 8.003 C 1.155 7.928 1.161 7.859 1.161 7.79 C 1.281 7.79 4.658 7.871 8.179 6.817 C 8.373 7.2 8.562 7.595 8.738 7.978 C 8.65 8.003 8.556 8.028 8.468 8.06 C 4.777 9.252 2.906 12.566 2.906 12.566 Z M 7.997 14.839 C 6.403 14.839 4.953 14.293 3.791 13.389 C 3.816 13.339 5.141 10.52 9.158 9.12 C 9.171 9.114 9.189 9.108 9.202 9.108 C 10.162 11.606 10.558 13.696 10.658 14.299 C 9.842 14.644 8.938 14.839 7.997 14.839 Z M 11.813 13.671 C 11.744 13.257 11.38 11.255 10.483 8.788 C 12.692 8.436 14.607 9.039 14.745 9.089 C 14.443 10.991 13.345 12.636 11.813 13.671 Z M 10.068 7.708 C 10.018 7.589 9.968 7.476 9.918 7.357 C 9.773 7.018 9.623 6.691 9.459 6.365 C 12.158 5.266 13.257 3.678 13.27 3.659 C 14.224 4.827 14.807 6.315 14.826 7.934 C 14.732 7.915 12.416 7.413 10.068 7.708 Z" />
    </svg>
  );
}
`;

fs.writeFileSync('components/icons.tsx', out, 'utf8');
console.log('Successfully wrote components/icons.tsx');
