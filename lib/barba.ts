import barba from '@barba/core'
import '@barba/css'

// Initialize Barba.js with smooth transitions
barba.init({
  transitions: [
    {
      name: 'fade-transition',
      leave(data) {
        return new Promise((resolve) => {
          data.current.container.style.transition = 'opacity 0.3s ease-out, transform 0.3s ease-out'
          data.current.container.style.opacity = '0'
          data.current.container.style.transform = 'translateY(-20px)'
          setTimeout(resolve, 300)
        })
      },
      enter(data) {
        return new Promise((resolve) => {
          data.next.container.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out'
          data.next.container.style.opacity = '0'
          data.next.container.style.transform = 'translateY(20px)'
          
          setTimeout(() => {
            data.next.container.style.opacity = '1'
            data.next.container.style.transform = 'translateY(0)'
            setTimeout(resolve, 500)
          }, 50)
        })
      }
    },
    {
      name: 'slide-transition',
      leave(data) {
        return new Promise((resolve) => {
          data.current.container.style.transition = 'transform 0.4s ease-in-out'
          data.current.container.style.transform = 'translateX(-100%)'
          setTimeout(resolve, 400)
        })
      },
      enter(data) {
        return new Promise((resolve) => {
          data.next.container.style.transition = 'transform 0.4s ease-in-out'
          data.next.container.style.transform = 'translateX(100%)'
          
          setTimeout(() => {
            data.next.container.style.transform = 'translateX(0)'
            setTimeout(resolve, 400)
          }, 50)
        })
      }
    }
  ],
  views: [
    {
      namespace: 'home',
      beforeEnter() {
        // Add specific animations for home page
        const elements = document.querySelectorAll('.animate-on-enter')
        elements.forEach((el, index) => {
          const element = el as HTMLElement
          element.style.opacity = '0'
          element.style.transform = 'translateY(30px)'
          element.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out'
          
          setTimeout(() => {
            element.style.opacity = '1'
            element.style.transform = 'translateY(0)'
          }, index * 100)
        })
      }
    },
    {
      namespace: 'admin',
      beforeEnter() {
        // Add specific animations for admin pages
        const cards = document.querySelectorAll('.admin-card')
        cards.forEach((card, index) => {
          const cardElement = card as HTMLElement
          cardElement.style.opacity = '0'
          cardElement.style.transform = 'translateX(-30px)'
          cardElement.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out'
          
          setTimeout(() => {
            cardElement.style.opacity = '1'
            cardElement.style.transform = 'translateX(0)'
          }, index * 100)
        })
      }
    }
  ],
  hooks: {
    before: () => {
      // Add loading state
      document.body.classList.add('page-transitioning')
    },
    after: () => {
      // Remove loading state
      document.body.classList.remove('page-transitioning')
      
      // Re-initialize any components that need it
      if (typeof window !== 'undefined') {
        // Re-initialize tooltips, modals, etc.
        window.dispatchEvent(new Event('barba:after'))
      }
    }
  }
})

// Add CSS for page transitions
const style = document.createElement('style')
style.textContent = `
  .barba-container {
    opacity: 1;
  }
  
  .page-transitioning {
    overflow: hidden;
  }
  
  .page-transitioning .barba-container {
    pointer-events: none;
  }
  
  /* Loading overlay */
  .barba-loading {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.9);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
  }
  
  .barba-loading::after {
    content: '';
    width: 40px;
    height: 40px;
    border: 4px solid #e5e7eb;
    border-top: 4px solid #3b82f6;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`
document.head.appendChild(style)

export default barba
