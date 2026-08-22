

// Animate logo 
function setupLogoAnimation(elementSelector, imagesArray, frameDelay = 100) {
  const element = document.querySelector(elementSelector);
  
  if (!element) {
    console.error(`Element ${elementSelector} not found`);
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
  './assets/img/logoanimation1.png',
  './assets/img/logoanimation2.png',
  './assets/img/logoanimation3.png',
  './assets/img/logoanimation4.png',
  './assets/img/logoanimation5.png',
  './assets/img/logoanimation6.png',
  './assets/img/logoanimation7.png',
  './assets/img/logo.png',

];

setupLogoAnimation('#logo img', logoFrames, 120);