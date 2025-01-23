import boxen from 'boxen'
import figlet from 'figlet'
import gradient from 'gradient-string'

export async function showBanner(): Promise<void> {
  // Create gradient colors
  const gradientColors = gradient([
    { color: '#00ff00', pos: 0 },
    { color: '#00ffff', pos: 0.5 },
    { color: '#ff00ff', pos: 1 }
  ])

  // Create figlet text
  const text = await new Promise<string>(resolve => {
    figlet(
      'Links Base',
      {
        font: 'Standard',
        horizontalLayout: 'default',
        verticalLayout: 'default'
      },
      (err, data) => {
        if (err) {
          resolve('Links Base')
          return
        }
        resolve(data || 'Links Base')
      }
    )
  })

  // Apply gradient to figlet text
  const gradientText = gradientColors(text)

  // Create info box
  const info = boxen(
    'Create a new Links Base project\nA modern, static link management application',
    {
      padding: 1,
      margin: 1,
      borderStyle: 'round',
      borderColor: 'cyan'
    }
  )

  // Print banner and info
  console.log(gradientText)
  console.log(info)
}
