const fs = require('fs')
const path = require('path')

// Clean up temporary files
const filesToClean = [
  'scripts/create-admin.js',
  'scripts/reset-admin-password.js'
]

console.log('🧹 Cleaning up temporary files...')

filesToClean.forEach(file => {
  if (fs.existsSync(file)) {
    fs.unlinkSync(file)
    console.log(`✅ Removed ${file}`)
  }
})

console.log('✨ Cleanup complete!')
