'use client'

export function StarFieldSimple() {
  console.log('🎨 StarFieldSimple: Rendering simple div')
  
  return (
    <div
      style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        width: '100%', 
        height: '100%', 
        background: 'rgba(0, 255, 0, 0.1)', 
        zIndex: 1,
        pointerEvents: 'none',
        border: '2px solid blue'
      }}
    >
      STARS ANIMATION
    </div>
  )
}

