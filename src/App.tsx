import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { Button } from './components/ui/button'
import { Input } from './components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card'

function App() {
  const [count, setCount] = useState(0)
  const [name, setName] = useState('')

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-16">
        <div className="flex gap-4 justify-center items-center mb-8">
          <a href="https://vite.dev" target="_blank" className="hover:scale-110 transition-transform">
            <img src={viteLogo} className="h-16 w-16" alt="Vite logo" />
          </a>
          <a href="https://react.dev" target="_blank" className="hover:scale-110 transition-transform">
            <img src={reactLogo} className="h-16 w-16" alt="React logo" />
          </a>
        </div>
        
        <h1 className="text-4xl font-bold text-center mb-8 text-white">Concert Booking App</h1>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Counter Demo</CardTitle>
              <CardDescription className="text-slate-300">Using shadcn/ui Button component</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center text-2xl font-bold text-white">
                Count: {count}
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() => setCount((count) => count + 1)}
                  className="flex-1 bg-white text-slate-900 hover:bg-gray-200"
                >
                  Increment
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setCount(0)}
                  className="flex-1"
                >
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Input Demo</CardTitle>
              <CardDescription className="text-slate-300">Using shadcn/ui Input component</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Enter your name..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-white/20 border-white/30 text-white placeholder:text-slate-400"
              />
              {name && (
                <div className="text-center text-lg text-white">
                  Hello, {name}! 👋
                </div>
              )}
              <div className="flex gap-2">
                <Button
                  onClick={() => setName('')}
                  className="flex-1 bg-white text-slate-900 hover:bg-gray-200"
                >
                  Clear
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setName('Concert Lover')}
                  className="flex-1"
                >
                  Demo Name
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-12">
          <p className="text-slate-400">
            Shadcn/ui components are now working perfectly with Tailwind CSS v4! 🎉
          </p>
        </div>
      </div>
    </div>
  )
}

export default App
