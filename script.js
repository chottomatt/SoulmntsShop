

// Animate logo 
function setupLogoAnimation(elementSelector, imagesArray, frameDelay = 100) {
  const element = document.querySelector(elementSelector);
  
  if (!element) {
    console.error(`Elemento ${elementSelector} não encontrado`);
    return;
  }
  
  let animationInterval = null;
  let currentFrame = 0;
  const originalSrc = element.src; // Save original image
  
  // Entering Mouse
  element.addEventListener('mouseenter', () => {
    if (animationInterval) return; // Já está
    
    currentFrame = 0;
    
    animationInterval = setInterval(() => {
      element.src = imagesArray[currentFrame];
      currentFrame = (currentFrame + 1) % imagesArray.length; // Loop
    }, frameDelay);
  });
  
  // Leaving Mouse
  element.addEventListener('mouseleave', () => {
    if (animationInterval) {
      clearInterval(animationInterval);
      animationInterval = null;
    }
    element.src = originalSrc; // Original Picture
  });
}

const logoFrames = [
  'img/logoanimation1.png',
  'img/logoanimation2.png',
  'img/logoanimation3.png',
  'img/logoanimation4.png',
  'img/logoanimation5.png',
  'img/logoanimation6.png',
  'img/logoanimation7.png',
];

setupLogoAnimation('#logo img', logoFrames, 150);